
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Star, Book, Zap, Sparkles, ChevronRight } from 'lucide-react';
import { ZODIACS, getZodiacFromDate } from '../constants';
import { getHoroscope, getLovePrediction, getPlanetaryInsights } from '../services/geminiService';

interface ZodiacSectionProps {
  isDarkMode: boolean;
}

type ZodiacTab = 'LoveMatcher' | 'Horoscope' | 'PlanetaryAspects' | 'Almanac' | 'LuckyDay';

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const ZodiacSection: React.FC<ZodiacSectionProps> = ({ isDarkMode }) => {
  const [tab, setTab] = useState<ZodiacTab>('LoveMatcher');
  
  // Love Matcher State
  const [m1, setM1] = useState(1);
  const [d1, setD1] = useState(1);
  const [m2, setM2] = useState(1);
  const [d2, setD2] = useState(1);

  const [matchResult, setMatchResult] = useState<{ percentage: number, reason: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [horoscope, setHoroscope] = useState<{ sign: string, text: string } | null>(null);
  const [planetaryInfo, setPlanetaryInfo] = useState<{ sign: string, text: string } | null>(null);
  const [selectedAlmanac, setSelectedAlmanac] = useState(ZODIACS[0]);
  const [luckyZodiac, setLuckyZodiac] = useState(ZODIACS[0].name);

  const handleMatch = async () => {
    setIsLoading(true);
    const sign1 = getZodiacFromDate(m1, d1);
    const sign2 = getZodiacFromDate(m2, d2);
    try {
      const result = await getLovePrediction(sign1, sign2);
      setMatchResult(result);
    } catch (e) {
      setMatchResult({ percentage: 75, reason: "The stars suggest a strong bond, despite minor friction in the outer orbits." });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlanetaryInsights = async (sign: string) => {
    setIsLoading(true);
    try {
      const res = await getPlanetaryInsights(sign);
      setPlanetaryInfo({ sign, text: res || 'Consulting planetary movements...' });
    } catch (e) {
      setPlanetaryInfo({ sign, text: "The planetary alignment is currently obscured." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleHoroscope = async (sign: string) => {
    setIsLoading(true);
    try {
      const today = new Date().toDateString();
      const saved = localStorage.getItem(`horoscope_${sign}_${today}`);
      if (saved) {
        setHoroscope({ sign, text: saved });
      } else {
        const res = await getHoroscope(sign);
        localStorage.setItem(`horoscope_${sign}_${today}`, res || '');
        setHoroscope({ sign, text: res || 'Consulting stars...' });
      }
    } catch (e) {
      setHoroscope({ sign, text: "A mercury retrograde has blocked the transmission." });
    } finally {
      setIsLoading(false);
    }
  };

  const getLuckyData = (sign: string) => {
    const today = new Date().toDateString();
    const seed = sign + today;
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = seed.charCodeAt(i) + ((hash << 5) - hash);
    }
    const colors = ["Ruby Red", "Emerald Green", "Azure Blue", "Goldenrod", "Vibrant Purple", "Sunset Orange", "Teal", "Rose Pink", "Silver", "Ivory"];
    const luckyColor = colors[Math.abs(hash) % colors.length];
    const luckyNumber = (Math.abs(hash) % 99) + 1;
    return { color: luckyColor, number: luckyNumber };
  };

  const currentLucky = getLuckyData(luckyZodiac);

  const DayPicker = ({ val, setVal }: { val: number, setVal: (v: number) => void }) => (
    <select value={val} onChange={(e) => setVal(parseInt(e.target.value))} className={`flex-1 p-3 md:p-4 rounded-xl font-black border-2 text-sm md:text-base outline-none appearance-none ${isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-100 text-slate-900'}`}>
      {Array.from({ length: 31 }, (_, i) => i + 1).map(d => <option key={d} value={d}>{d}</option>)}
    </select>
  );

  const MonthPicker = ({ val, setVal }: { val: number, setVal: (v: number) => void }) => (
    <select value={val} onChange={(e) => setVal(parseInt(e.target.value))} className={`flex-1 p-3 md:p-4 rounded-xl font-black border-2 text-sm md:text-base outline-none appearance-none ${isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-100 text-slate-900'}`}>
      {MONTHS.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
    </select>
  );

  return (
    <div className="space-y-6">
      {/* Scrollable Tabs for Mobile */}
      <div className="flex gap-2 -mx-4 px-4 pb-2 overflow-x-auto no-scrollbar scroll-smooth">
        {['LoveMatcher', 'Horoscope', 'PlanetaryAspects', 'Almanac', 'LuckyDay'].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t as ZodiacTab)}
            className={`px-5 py-2.5 rounded-full font-black text-xs md:text-sm transition-all whitespace-nowrap uppercase tracking-tighter ${tab === t ? 'bg-[#26890c] text-white scale-105 shadow-md' : 'bg-gray-200 dark:bg-slate-700 opacity-70 text-slate-900 dark:text-white'}`}
          >
            {t.replace(/([A-Z])/g, ' $1').trim()}
          </button>
        ))}
      </div>

      {tab === 'LoveMatcher' && (
        <div className={`p-6 md:p-8 rounded-[2.5rem] ${isDarkMode ? 'bg-slate-800 text-white' : 'bg-white text-slate-900'} shadow-xl text-center`}>
          <Heart className="mx-auto mb-6 text-red-500 animate-pulse" size={48} />
          <h2 className="text-2xl md:text-3xl font-black mb-8 uppercase italic">Love Matcher</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-6 mb-10">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase opacity-50 tracking-widest mb-1">Self Birthdate</label>
              <div className="flex gap-2">
                <MonthPicker val={m1} setVal={setM1} />
                <DayPicker val={d1} setVal={setD1} />
              </div>
            </div>
            
            <div className="flex justify-center">
              <div className="text-3xl font-black text-red-500 animate-bounce">&hearts;</div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase opacity-50 tracking-widest mb-1">Partner Birthdate</label>
              <div className="flex gap-2">
                <MonthPicker val={m2} setVal={setM2} />
                <DayPicker val={d2} setVal={setD2} />
              </div>
            </div>
          </div>

          <button 
            disabled={isLoading} 
            onClick={handleMatch} 
            className={`kahoot-button-red w-full md:w-auto px-10 py-4 rounded-2xl text-white font-black text-lg md:text-xl mb-10 uppercase shadow-lg transition-transform active:scale-95 ${isLoading ? 'opacity-50' : ''}`}
          >
            {isLoading ? 'MATCHING...' : 'REVEAL SCORE'}
          </button>

          {matchResult && (
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="p-6 md:p-8 rounded-3xl border-4 border-[#e21b3c] bg-[#e21b3c]/5">
              <p className="text-5xl md:text-6xl font-black text-[#e21b3c] mb-4">{matchResult.percentage}%</p>
              <div className="text-left bg-white/50 dark:bg-slate-900/50 p-4 md:p-6 rounded-2xl">
                 <p className={`text-sm md:text-lg font-bold leading-relaxed ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{matchResult.reason}</p>
              </div>
            </motion.div>
          )}
        </div>
      )}

      {tab === 'Horoscope' && (
        <div className={`p-6 md:p-8 rounded-[2.5rem] ${isDarkMode ? 'bg-slate-800 text-white' : 'bg-white text-slate-900'} shadow-xl`}>
          <Star className="mx-auto mb-6 text-yellow-400" size={48} />
          <h2 className="text-2xl md:text-3xl font-black text-center mb-8 uppercase italic">Daily Reading</h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 mb-10">
            {ZODIACS.map(z => (
              <button 
                key={z.name} 
                onClick={() => handleHoroscope(z.name)} 
                className={`p-3 rounded-xl border-2 font-black text-[10px] uppercase transition-all flex flex-col items-center gap-1 ${horoscope?.sign === z.name ? 'border-[#ffa602] bg-[#ffa602]/10 text-[#ffa602]' : 'border-transparent bg-gray-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}
              >
                <span className="text-2xl">{z.symbol}</span>
                {z.name.substring(0, 3)}
              </button>
            ))}
          </div>
          {horoscope && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`p-6 md:p-8 rounded-3xl border-2 border-yellow-200 dark:border-slate-600 ${isDarkMode ? 'bg-slate-700' : 'bg-white'}`}>
              <h4 className="text-xl font-black text-[#ffa602] mb-2 uppercase italic">{horoscope.sign}</h4>
              <p className={`text-sm md:text-lg font-bold leading-relaxed ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{horoscope.text}</p>
            </motion.div>
          )}
          {isLoading && !horoscope && (
            <div className="text-center py-10 animate-pulse font-black text-[#ffa602] uppercase tracking-widest text-xs">
              Translating the stars...
            </div>
          )}
        </div>
      )}

      {tab === 'PlanetaryAspects' && (
        <div className={`p-6 md:p-8 rounded-[2.5rem] ${isDarkMode ? 'bg-slate-800 text-white' : 'bg-white text-slate-900'} shadow-xl`}>
          <Sparkles className="mx-auto mb-6 text-purple-500" size={48} />
          <h2 className="text-2xl md:text-3xl font-black text-center mb-6 uppercase italic">Cosmic Transits</h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 mb-10">
            {ZODIACS.map(z => (
              <button 
                key={z.name} 
                onClick={() => handlePlanetaryInsights(z.name)} 
                className={`p-3 rounded-xl border-2 font-black text-[10px] uppercase transition-all flex flex-col items-center gap-1 ${planetaryInfo?.sign === z.name ? 'border-purple-500 bg-purple-500/10 text-purple-500' : 'border-transparent bg-gray-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}
              >
                <span className="text-2xl">{z.symbol}</span>
                {z.name.substring(0, 3)}
              </button>
            ))}
          </div>
          {planetaryInfo && (
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className={`p-6 md:p-10 rounded-3xl border-2 border-purple-500 ${isDarkMode ? 'bg-slate-700' : 'bg-white'}`}>
               <h4 className="text-xl md:text-3xl font-black mb-6 uppercase text-purple-500 italic">{planetaryInfo.sign} Insights</h4>
               <div className={`text-sm md:text-xl leading-relaxed font-bold space-y-4 whitespace-pre-line ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                 {planetaryInfo.text}
               </div>
            </motion.div>
          )}
          {isLoading && !planetaryInfo && (
            <div className="text-center py-10 animate-pulse font-black text-purple-500 uppercase tracking-widest text-xs">
              Mapping the cosmos...
            </div>
          )}
        </div>
      )}

      {tab === 'Almanac' && (
        <div className={`p-6 md:p-8 rounded-[2.5rem] ${isDarkMode ? 'bg-slate-800 text-white' : 'bg-white text-slate-900'} shadow-xl`}>
          <Book className="mx-auto mb-6 text-[#1368ce]" size={48} />
          <h2 className="text-2xl md:text-3xl font-black text-center mb-8 uppercase italic">Zodiac Almanac</h2>
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="w-full lg:w-1/3 flex lg:flex-col gap-2 overflow-x-auto no-scrollbar lg:h-[400px] lg:pr-2 custom-scrollbar pb-2 lg:pb-0">
              {ZODIACS.map(z => (
                <button 
                  key={z.name} 
                  onClick={() => setSelectedAlmanac(z)} 
                  className={`shrink-0 lg:shrink p-3 md:p-4 rounded-xl text-center lg:text-left font-black text-[10px] md:text-xs transition-all uppercase flex items-center justify-between gap-2 ${selectedAlmanac.name === z.name ? 'bg-[#1368ce] text-white' : 'bg-gray-100 dark:bg-slate-700 text-gray-400'}`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{z.symbol}</span>
                    {z.name}
                  </div>
                  <ChevronRight size={14} className={selectedAlmanac.name === z.name ? 'opacity-100' : 'opacity-0'} />
                </button>
              ))}
            </div>
            <div className="flex-1 p-6 md:p-8 rounded-3xl border-2 border-gray-100 dark:border-slate-700">
               <h3 className="text-2xl md:text-4xl font-black text-[#1368ce] mb-1 italic uppercase">{selectedAlmanac.symbol} {selectedAlmanac.name}</h3>
               <p className={`text-xs md:text-lg font-black opacity-40 mb-6 uppercase tracking-widest ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{selectedAlmanac.dates}</p>
               <div className="space-y-6">
                 <div>
                   <h5 className="font-black text-[10px] uppercase tracking-widest opacity-30 mb-2 italic">Essential Traits</h5>
                   <p className={`text-sm md:text-lg font-bold leading-relaxed ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{selectedAlmanac.description}</p>
                 </div>
                 <div>
                   <h5 className="font-black text-[10px] uppercase tracking-widest opacity-30 mb-2 italic">Ancient Lore</h5>
                   <p className={`text-sm md:text-lg italic font-medium leading-relaxed ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{selectedAlmanac.history}</p>
                 </div>
               </div>
            </div>
          </div>
        </div>
      )}

      {tab === 'LuckyDay' && (
        <div className={`p-6 md:p-8 rounded-[2.5rem] ${isDarkMode ? 'bg-slate-800 text-white' : 'bg-white text-slate-900'} shadow-xl text-center`}>
          <Zap className="mx-auto mb-6 text-purple-500" size={48} />
          <h2 className="text-2xl md:text-3xl font-black mb-8 uppercase italic">Lucky Predictor</h2>
          <div className="mb-10 max-w-xs mx-auto relative">
             <select 
               value={luckyZodiac} 
               onChange={(e) => setLuckyZodiac(e.target.value)} 
               className={`w-full p-4 rounded-2xl font-black border-2 outline-none text-center appearance-none cursor-pointer uppercase tracking-widest ${isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-100 text-slate-900'}`}
             >
               {ZODIACS.map(z => <option key={z.name} value={z.name}>{z.symbol} {z.name.toUpperCase()}</option>)}
             </select>
             <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
                <ChevronRight size={20} className="rotate-90" />
             </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
            <div className="p-8 rounded-[2rem] bg-purple-500 text-white shadow-lg flex flex-col items-center justify-center transform transition-transform hover:scale-[1.02]">
               <h4 className="text-[10px] font-black uppercase tracking-widest mb-4 opacity-70">Lucky Color</h4>
               <p className="text-2xl md:text-3xl font-black uppercase italic tracking-tighter">{currentLucky.color}</p>
            </div>
            <div className={`p-8 rounded-[2rem] ${isDarkMode ? 'bg-slate-700' : 'bg-gray-50'} shadow-lg border-2 border-purple-500 flex flex-col items-center justify-center transform transition-transform hover:scale-[1.02]`}>
               <h4 className="text-[10px] font-black uppercase tracking-widest mb-4 text-purple-500 opacity-70">Lucky Number</h4>
               <p className="text-6xl md:text-7xl font-black text-purple-500 italic">{currentLucky.number}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ZodiacSection;

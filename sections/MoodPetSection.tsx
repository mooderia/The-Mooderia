
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User } from '../types';
import { Coins, ShoppingBag, Gamepad2, Bed, Lock, X, Ghost, Plus, Clock, Smile, Utensils, Droplets, Zap, Target, MousePointer2, Calculator } from 'lucide-react';

interface MoodPetSectionProps {
  user: User;
  isDarkMode: boolean;
  onUpdate: (hunger: number, thirst: number, rest: number, coins: number, sleepUntil?: number | null) => void;
}

const ITEMS = [
  { id: 'f1', type: 'hunger', name: 'Metropolis Munchies', emoji: '🍿', cost: 10, fill: 15 },
  { id: 'f2', type: 'hunger', name: 'Cosmic Burger', emoji: '🍔', cost: 25, fill: 40 },
  { id: 'f3', type: 'hunger', name: 'District Feast', emoji: '🥘', cost: 50, fill: 90 },
  { id: 'd1', type: 'thirst', name: 'Mood Water', emoji: '💧', cost: 5, fill: 10 },
  { id: 'd2', type: 'thirst', name: 'Energy Elixir', emoji: '⚡', cost: 20, fill: 35 },
  { id: 'd3', type: 'thirst', name: 'Royal Tea', emoji: '🍵', cost: 45, fill: 80 },
];

const GAMES = [
  { id: 'g1', name: 'Coin Clicker', difficulty: 'Easy', rewardPerUnit: 0.2, drain: 5, color: 'bg-green-500', icon: <MousePointer2 size={24}/>, description: 'Click the coin as fast as you can!' },
  { id: 'g2', name: 'Vibe Hunter', difficulty: 'Medium', rewardPerUnit: 2, drain: 15, color: 'bg-blue-500', icon: <Target size={24}/>, description: 'Catch the moving vibes!' },
  { id: 'g3', name: 'Math Blitz', difficulty: 'Hard', rewardPerUnit: 5, drain: 30, color: 'bg-purple-600', icon: <Calculator size={24}/>, description: 'Solve equations under pressure!' },
];

const SLEEP_OPTIONS = [
  { id: 's1', label: 'Quick Nap', duration: 10 * 60 * 1000, fill: 20 },
  { id: 's2', label: 'Deep Slumber', duration: 60 * 60 * 1000, fill: 60 },
  { id: 's3', label: 'Cosmic Sleep', duration: 4 * 60 * 60 * 1000, fill: 100 },
];

const MoodPetSection: React.FC<MoodPetSectionProps> = ({ user, isDarkMode, onUpdate }) => {
  const [activeTab, setActiveTab] = useState<'Interaction' | 'Shop' | 'Games'>('Interaction');
  const [showSleepModal, setShowSleepModal] = useState(false);
  const [activeGameId, setActiveGameId] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);

  // Sync sleep timer
  useEffect(() => {
    if (!user.petSleepUntil) return;
    const interval = setInterval(() => {
      const remaining = user.petSleepUntil! - Date.now();
      if (remaining <= 0) {
        onUpdate(0, 0, 100, 0, null);
      } else {
        setTimeLeft(Math.floor(remaining / 1000));
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [user.petSleepUntil]);

  const handleBuy = (item: typeof ITEMS[0]) => {
    if (user.moodCoins < item.cost) return;
    onUpdate(item.type === 'hunger' ? item.fill : 0, item.type === 'thirst' ? item.fill : 0, 0, -item.cost);
  };

  const finishGame = (reward: number, drain: number) => {
    onUpdate(0, 0, -drain, Math.floor(reward));
    setActiveGameId(null);
  };

  if (user.petSleepUntil && Date.now() < user.petSleepUntil) {
    const hours = Math.floor(timeLeft / 3600);
    const mins = Math.floor((timeLeft % 3600) / 60);
    const secs = timeLeft % 60;
    return (
      <div className={`h-full flex flex-col items-center justify-center p-8 rounded-[3rem] ${isDarkMode ? 'bg-slate-800' : 'bg-white shadow-2xl'} border-8 border-purple-500/20`}>
        <div className="relative mb-8">
           <div className="text-[120px] filter grayscale opacity-40">💤</div>
           <Lock className="absolute bottom-0 right-0 text-red-500 bg-white p-4 rounded-full shadow-2xl" size={80} />
        </div>
        <h2 className="text-4xl font-black italic uppercase tracking-tighter text-[#46178f] mb-4 text-center">Do Not Disturb!</h2>
        <p className="text-lg font-bold opacity-60 text-center max-w-sm mb-8">Your Mood Pet is recharging. Please wait for the energy cycle to complete.</p>
        <div className="bg-purple-600 text-white px-10 py-6 rounded-[2rem] shadow-[0_10px_0_0_#321067]">
          <p className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-70">Wake up in</p>
          <p className="text-5xl font-black italic tracking-tighter">
            {hours > 0 ? `${hours}h ` : ''}{mins}m {secs}s
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full gap-6">
      {activeGameId ? (
        <GameInterface 
          gameId={activeGameId} 
          isDarkMode={isDarkMode} 
          onFinish={finishGame}
        />
      ) : (
        <>
          {/* Interaction Area */}
          <div className={`flex-1 flex flex-col items-center justify-center p-8 rounded-[3rem] ${isDarkMode ? 'bg-slate-800' : 'bg-white'} shadow-xl border-b-8 border-gray-100 dark:border-slate-700`}>
            <motion.div 
              animate={{ y: [0, -15, 0], scale: [1, 1.05, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="text-9xl mb-12 drop-shadow-2xl cursor-pointer active:scale-90"
            >
              {user.petHunger < 20 ? '😵' : user.petThirst < 20 ? '🌵' : user.petRest < 20 ? '😴' : user.petEmoji || '🐱'}
            </motion.div>

            <div className="w-full grid grid-cols-3 gap-4">
               {[
                 { label: 'Hunger', val: user.petHunger, color: 'bg-red-500', icon: <Utensils size={14} /> },
                 { label: 'Thirst', val: user.petThirst, color: 'bg-blue-500', icon: <Droplets size={14} /> },
                 { label: 'Rest', val: user.petRest, color: 'bg-green-500', icon: <Zap size={14} /> },
               ].map(bar => (
                 <div key={bar.label} className="space-y-1">
                   <div className="flex justify-between items-center text-[10px] font-black uppercase opacity-40 italic">
                     <span className="flex items-center gap-1">{bar.icon}{bar.label}</span>
                     <span>{bar.val}%</span>
                   </div>
                   <div className="h-3 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden border border-gray-200 dark:border-slate-600">
                     <motion.div 
                       initial={{ width: 0 }}
                       animate={{ width: `${bar.val}%` }}
                       className={`h-full ${bar.color} rounded-full`}
                     />
                   </div>
                 </div>
               ))}
            </div>
          </div>

          {/* Control Tabs */}
          <div className="flex gap-2 shrink-0 overflow-x-auto no-scrollbar pb-2">
             {[
               { id: 'Interaction', icon: <Smile />, color: 'bg-purple-500' },
               { id: 'Shop', icon: <ShoppingBag />, color: 'bg-yellow-500' },
               { id: 'Games', icon: <Gamepad2 />, color: 'bg-blue-500' },
             ].map(btn => (
               <button
                 key={btn.id}
                 onClick={() => setActiveTab(btn.id as any)}
                 className={`flex-1 py-4 px-6 rounded-2xl flex items-center justify-center gap-2 font-black uppercase text-xs transition-all ${activeTab === btn.id ? `${btn.color} text-white shadow-lg scale-105` : 'bg-gray-200 dark:bg-slate-700 opacity-60'}`}
               >
                 {btn.icon}
                 <span>{btn.id}</span>
               </button>
             ))}
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {activeTab === 'Interaction' && (
              <div className="flex gap-4">
                <button 
                  onClick={() => setShowSleepModal(true)}
                  className="flex-1 p-8 rounded-[2rem] bg-[#46178f] text-white flex flex-col items-center justify-center gap-3 shadow-[0_8px_0_0_#321067] active:translate-y-2 active:shadow-none transition-all"
                >
                  <Bed size={40} />
                  <span className="font-black italic uppercase text-lg">Send to Bed</span>
                </button>
              </div>
            )}

            {activeTab === 'Shop' && (
              <div className="grid grid-cols-2 gap-4 pb-10">
                {ITEMS.map(item => (
                  <button 
                    key={item.id} 
                    onClick={() => handleBuy(item)}
                    disabled={user.moodCoins < item.cost}
                    className={`p-4 rounded-3xl border-2 flex flex-col items-center text-center gap-1 transition-all ${user.moodCoins < item.cost ? 'opacity-40 grayscale cursor-not-allowed' : 'hover:scale-[1.02] shadow-md'} ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100'}`}
                  >
                    <span className="text-4xl mb-2">{item.emoji}</span>
                    <p className="text-[10px] font-black uppercase leading-none mb-1">{item.name}</p>
                    <p className="text-[8px] font-bold opacity-40 mb-3">Refills {item.fill}% {item.type}</p>
                    <div className="bg-yellow-400 px-3 py-1 rounded-full text-white font-black text-xs flex items-center gap-1">
                      <Coins size={12} /> {item.cost}
                    </div>
                  </button>
                ))}
              </div>
            )}

            {activeTab === 'Games' && (
              <div className="space-y-4 pb-10">
                {GAMES.map(game => (
                  <div key={game.id} className={`p-6 rounded-[2rem] border-2 flex items-center justify-between gap-4 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100'}`}>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-blue-500">{game.icon}</span>
                        <h4 className="font-black uppercase italic text-lg leading-none">{game.name}</h4>
                      </div>
                      <p className="text-[10px] font-bold opacity-60 mb-2">{game.description}</p>
                      <div className="flex gap-4">
                        <span className="text-[9px] font-black text-green-500 uppercase">Rewards: Performance Based</span>
                        <span className="text-[9px] font-black text-red-500 uppercase">Cost: {game.drain} Rest</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => setActiveGameId(game.id)}
                      disabled={user.petRest < game.drain}
                      className={`kahoot-button px-6 py-3 text-white rounded-xl font-black text-xs uppercase shadow-lg ${game.color} ${user.petRest < game.drain ? 'opacity-30 cursor-not-allowed' : ''}`}
                    >
                      START
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      <AnimatePresence>
        {showSleepModal && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`w-full max-w-sm rounded-[3rem] p-8 shadow-2xl relative ${isDarkMode ? 'bg-slate-800 text-white' : 'bg-white text-slate-900'}`}
            >
              <button onClick={() => setShowSleepModal(false)} className="absolute top-6 right-6 opacity-30 hover:opacity-100"><X /></button>
              <div className="text-center mb-8">
                <Bed className="mx-auto text-purple-500 mb-4" size={48} />
                <h3 className="text-2xl font-black italic uppercase">Mood Nap</h3>
                <p className="text-xs opacity-50 font-bold uppercase tracking-widest">Select rest duration</p>
              </div>
              <div className="space-y-3">
                {SLEEP_OPTIONS.map(opt => (
                  <button 
                    key={opt.id}
                    onClick={() => {
                      onUpdate(0, 0, opt.fill, 0, Date.now() + opt.duration);
                      setShowSleepModal(false);
                    }}
                    className={`w-full p-5 rounded-2xl border-2 font-black text-sm uppercase flex justify-between items-center transition-all hover:scale-[1.02] ${isDarkMode ? 'bg-slate-700 border-slate-600' : 'bg-gray-50 border-gray-100 hover:border-purple-500'}`}
                  >
                    <div className="flex items-center gap-3"><Clock size={16} /> {opt.label}</div>
                    <span className="text-purple-500">+{opt.fill}%</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* --- MINI GAMES INTERFACE --- */

interface GameInterfaceProps {
  gameId: string;
  isDarkMode: boolean;
  onFinish: (reward: number, drain: number) => void;
}

const GameInterface: React.FC<GameInterfaceProps> = ({ gameId, isDarkMode, onFinish }) => {
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(0);
  const [gameState, setGameState] = useState<'IDLE' | 'PLAYING' | 'FINISHED'>('IDLE');
  const gameRef = useRef<any>(null);

  const start = () => {
    setScore(0);
    setGameState('PLAYING');
    setTimer(gameId === 'g1' ? 5 : gameId === 'g2' ? 10 : 15);
  };

  useEffect(() => {
    if (gameState === 'PLAYING' && timer > 0) {
      const t = setInterval(() => setTimer(prev => prev - 1), 1000);
      return () => clearInterval(t);
    } else if (gameState === 'PLAYING' && timer === 0) {
      setGameState('FINISHED');
    }
  }, [gameState, timer]);

  const handleFinish = () => {
    const game = GAMES.find(g => g.id === gameId);
    if (game) {
      onFinish(score * game.rewardPerUnit, game.drain);
    }
  };

  return (
    <div className={`h-full flex flex-col p-6 rounded-[3rem] ${isDarkMode ? 'bg-slate-800' : 'bg-white shadow-2xl'} overflow-hidden`}>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-black uppercase italic tracking-tighter">
          {GAMES.find(g => g.id === gameId)?.name}
        </h3>
        <div className="flex gap-4">
          <div className="bg-yellow-400 text-white px-4 py-2 rounded-xl font-black text-xs flex items-center gap-1 shadow-md">
            SCORE: {score}
          </div>
          <div className="bg-blue-500 text-white px-4 py-2 rounded-xl font-black text-xs flex items-center gap-1 shadow-md">
            TIME: {timer}s
          </div>
        </div>
      </div>

      <div className="flex-1 relative flex items-center justify-center bg-gray-50 dark:bg-slate-900 rounded-[2rem] border-4 border-dashed border-gray-200 dark:border-slate-700 overflow-hidden">
        {gameState === 'IDLE' && (
          <div className="text-center">
            <p className="text-sm font-bold opacity-50 mb-6 uppercase tracking-widest">Are you ready, citizen?</p>
            <button onClick={start} className="kahoot-button-green px-12 py-4 text-white rounded-2xl font-black text-xl uppercase shadow-xl transition-all">
              GO!
            </button>
          </div>
        )}

        {gameState === 'PLAYING' && (
          <>
            {gameId === 'g1' && <CoinClickerGame onScore={() => setScore(s => s + 1)} />}
            {gameId === 'g2' && <VibeHunterGame onScore={() => setScore(s => s + 1)} />}
            {gameId === 'g3' && <MathBlitzGame onScore={() => setScore(s => s + 1)} />}
          </>
        )}

        {gameState === 'FINISHED' && (
          <div className="text-center animate-bounce-in">
            <h4 className="text-4xl font-black text-green-500 italic uppercase mb-2">TIME UP!</h4>
            <p className="text-xl font-bold mb-6">You earned <span className="text-yellow-500">{Math.floor(score * (GAMES.find(g => g.id === gameId)?.rewardPerUnit || 0))}</span> Mood Coins!</p>
            <button onClick={handleFinish} className="kahoot-button-blue px-10 py-4 text-white rounded-2xl font-black text-sm uppercase shadow-xl">
              CLAIM REWARDS
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

/* --- INDIVIDUAL GAME LOGIC --- */

const CoinClickerGame = ({ onScore }: { onScore: () => void }) => {
  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={onScore}
      className="w-40 h-40 bg-yellow-400 rounded-full flex items-center justify-center border-b-8 border-yellow-600 shadow-2xl relative"
    >
      <Coins size={64} className="text-white" />
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 border-4 border-dashed border-white/30 rounded-full"
      />
    </motion.button>
  );
};

const VibeHunterGame = ({ onScore }: { onScore: () => void }) => {
  const [pos, setPos] = useState({ x: 50, y: 50 });
  
  const move = () => {
    onScore();
    setPos({
      x: Math.random() * 80 + 10,
      y: Math.random() * 80 + 10
    });
  };

  return (
    <motion.button
      animate={{ x: `${pos.x}%`, y: `${pos.y}%` }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onClick={move}
      className="absolute w-16 h-16 bg-blue-500 rounded-2xl border-b-4 border-blue-700 flex items-center justify-center text-white shadow-lg"
      style={{ left: 0, top: 0, transform: 'translate(-50%, -50%)' }}
    >
      <Target size={32} />
    </motion.button>
  );
};

const MathBlitzGame = ({ onScore }: { onScore: () => void }) => {
  const [problem, setProblem] = useState({ q: '', a: 0 });
  const [input, setInput] = useState('');

  const generate = () => {
    const a = Math.floor(Math.random() * 20) + 1;
    const b = Math.floor(Math.random() * 20) + 1;
    const op = Math.random() > 0.5 ? '+' : '-';
    setProblem({
      q: `${a} ${op} ${b}`,
      a: op === '+' ? a + b : a - b
    });
  };

  useEffect(generate, []);

  const check = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInput(val);
    if (parseInt(val) === problem.a) {
      onScore();
      setInput('');
      generate();
    }
  };

  return (
    <div className="text-center w-full max-w-xs">
      <h5 className="text-6xl font-black mb-8 italic tracking-tighter text-purple-500">
        {problem.q} = ?
      </h5>
      <input
        autoFocus
        type="number"
        value={input}
        onChange={check}
        placeholder="Type answer..."
        className="w-full p-6 rounded-2xl bg-white dark:bg-slate-800 border-4 border-purple-500 text-center text-3xl font-black outline-none shadow-xl"
      />
    </div>
  );
};

export default MoodPetSection;

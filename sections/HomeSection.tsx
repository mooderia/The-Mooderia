
import React, { useMemo } from 'react';
import { User, Post } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Flame, Award, TrendingUp, ShieldCheck, Sparkles, RefreshCw } from 'lucide-react';
import { STREAK_BADGES, DAILY_WISDOM } from '../constants';

interface HomeSectionProps {
  user: User;
  posts: Post[];
  isDarkMode: boolean;
  onTriggerMood?: () => void;
}

const HomeSection: React.FC<HomeSectionProps> = ({ user, posts, isDarkMode, onTriggerMood }) => {
  const currentMood = user.moodHistory?.[user.moodHistory.length - 1]?.mood || 'Not set';
  const earnedBadges = STREAK_BADGES.filter(b => user.moodStreak >= b.threshold);
  
  const todayWisdom = useMemo(() => {
    const today = new Date();
    const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
    return DAILY_WISDOM[seed % DAILY_WISDOM.length];
  }, []);

  const chartData = useMemo(() => {
    if (!user.moodHistory || user.moodHistory.length === 0) return [{ name: 'New', score: 0 }];
    return user.moodHistory.slice(-7).map((entry, idx) => ({ name: `T${idx + 1}`, score: entry.score }));
  }, [user.moodHistory]);

  const happiness = useMemo(() => {
    if (!user.moodHistory || user.moodHistory.length === 0) return 0;
    const recent = user.moodHistory.slice(-5);
    return Math.round(recent.reduce((acc, curr) => acc + curr.score, 0) / recent.length);
  }, [user.moodHistory]);

  return (
    <div className="space-y-6 md:space-y-8 pb-10 flex flex-col h-full min-h-0">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 shrink-0">
        <div className="text-center md:text-left w-full md:w-auto">
          <h2 className={`text-4xl md:text-5xl font-black italic tracking-tighter uppercase ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Welcome, {user.displayName}!</h2>
          <div className="flex items-center gap-3 mt-2 justify-center md:justify-start">
             <p className="opacity-40 font-black uppercase tracking-[0.2em] text-[10px] md:text-xs">Tier: {user.title}</p>
             <button onClick={onTriggerMood} className="bg-custom/10 text-custom px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-custom/20 hover:bg-custom hover:text-white transition-all flex items-center gap-1">
               <RefreshCw size={10} /> Re-Sync Mood
             </button>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-3 w-full md:w-auto justify-center md:justify-end">
          <div className="flex items-center gap-2 px-6 py-4 rounded-2xl bg-[#ffa602] text-white font-black shadow-xl streak-glow">
            <Flame className="animate-pulse" size={24} />
            <span className="uppercase text-lg">{user.moodStreak || 0} Day Streak</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 shrink-0">
        <div className={`p-6 md:p-8 rounded-[3rem] ${isDarkMode ? 'bg-[#111111]' : 'bg-white'} shadow-2xl border-b-[8px] border-blue-500/10`}>
          <p className="text-[10px] font-black opacity-30 uppercase tracking-[0.4em] mb-4">Circles</p>
          <p className="text-4xl md:text-5xl font-black text-[#1368ce] italic">{user.following.length}</p>
        </div>
        <div className={`p-6 md:p-8 rounded-[3rem] ${isDarkMode ? 'bg-[#111111]' : 'bg-white'} shadow-2xl border-b-[8px] border-green-500/10`}>
          <p className="text-[10px] font-black opacity-30 uppercase tracking-[0.4em] mb-4">Citizens</p>
          <p className="text-4xl md:text-5xl font-black text-[#26890c] italic">{user.followers.length}</p>
        </div>
        <div className={`col-span-2 md:col-span-1 p-6 md:p-8 rounded-[3rem] ${isDarkMode ? 'bg-[#111111]' : 'bg-white'} shadow-2xl border-b-[8px] border-red-500/10`}>
          <p className="text-[10px] font-black opacity-30 uppercase tracking-[0.4em] mb-4">Harmony</p>
          <div className="flex items-center gap-3"><p className="text-4xl md:text-5xl font-black text-[#e21b3c] italic">{happiness}%</p></div>
        </div>
      </div>

      <div className={`flex-1 min-h-[350px] p-6 md:p-8 rounded-[3rem] md:rounded-[4rem] ${isDarkMode ? 'bg-[#111111]' : 'bg-white'} shadow-2xl overflow-hidden border-4 border-black/5 flex flex-col`}>
        <div className="flex justify-between items-center mb-6 px-2 shrink-0">
          <h3 className="text-xl md:text-2xl font-black uppercase italic flex items-center gap-3"><TrendingUp className="text-custom" size={24} /> Sync History</h3>
          <div className="bg-custom/10 px-4 py-1.5 rounded-full border-2 border-custom/20 hidden sm:block"><span className="text-custom font-black text-[10px] uppercase tracking-widest">Active Resonance</span></div>
        </div>
        <div className="flex-1 w-full min-h-0">
          <ResponsiveContainer width="100%" height="100%" minHeight={200}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="6 6" vertical={false} stroke={isDarkMode ? "#222" : "#eee"} />
              <XAxis dataKey="name" hide />
              <YAxis domain={[0, 100]} hide />
              <Tooltip contentStyle={{ backgroundColor: isDarkMode ? '#111' : '#fff', borderRadius: '16px', border: '2px solid rgba(0,0,0,0.05)', fontWeight: '900', fontSize: '11px' }} />
              <Area type="monotone" dataKey="score" stroke="var(--theme-color)" fill="var(--theme-color)" fillOpacity={0.1} strokeWidth={6} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className={`p-8 md:p-10 rounded-[3rem] border-l-[12px] border-[#ffa602] ${isDarkMode ? 'bg-[#111111]' : 'bg-white'} shadow-2xl relative overflow-hidden group shrink-0`}>
        <h4 className="font-black text-xl mb-4 uppercase italic tracking-tighter opacity-30">Metropolis Insight</h4>
        <p className="italic font-bold text-xl md:text-3xl leading-snug opacity-90 relative z-10">"{todayWisdom}"</p>
      </div>
    </div>
  );
};

export default HomeSection;

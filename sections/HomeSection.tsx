
import React from 'react';
import { User, Post } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Flame, Award, TrendingUp, ShieldCheck } from 'lucide-react';
import { STREAK_BADGES } from '../constants';

interface HomeSectionProps {
  user: User;
  posts: Post[];
  isDarkMode: boolean;
}

const HomeSection: React.FC<HomeSectionProps> = ({ user, posts, isDarkMode }) => {
  const currentMood = user.moodHistory[user.moodHistory.length - 1]?.mood || 'Not set';
  const earnedBadges = STREAK_BADGES.filter(b => user.moodStreak >= b.threshold);
  
  // Chart data
  const chartData = [
    { name: 'M', score: 4000 },
    { name: 'T', score: 3000 },
    { name: 'W', score: 2000 },
    { name: 'T', score: 2780 },
    { name: 'F', score: 1890 },
    { name: 'S', score: 2390 },
    { name: 'S', score: 3490 },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="text-center md:text-left w-full md:w-auto">
          <h2 className={`text-3xl md:text-4xl font-black italic tracking-tighter uppercase ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            Welcome, {user.displayName}!
          </h2>
          <p className={`opacity-40 font-black uppercase tracking-[0.2em] text-[10px] md:text-xs mt-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            Mooderia Citizen Status: {user.title || 'Elite'}
          </p>
        </div>
        
        <div className="flex flex-wrap gap-3 w-full md:w-auto justify-center md:justify-end">
          <div className={`flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#ffa602] text-white font-black shadow-lg streak-glow text-xs md:text-sm`}>
            <Flame className="animate-pulse" size={18} />
            <span className="uppercase">{user.moodStreak || 0} Day Streak</span>
          </div>
          <div className={`flex items-center gap-2 px-5 py-3 rounded-2xl border-2 font-black text-xs md:text-sm ${isDarkMode ? 'border-purple-400 text-purple-400' : 'border-[#46178f] text-[#46178f]'}`}>
            <span className="opacity-50 uppercase mr-1">Mood:</span>
            <span className="uppercase italic">{currentMood}</span>
          </div>
        </div>
      </div>

      {/* Rewards Row */}
      {earnedBadges.length > 0 && (
        <div className={`p-4 md:p-6 rounded-[2rem] ${isDarkMode ? 'bg-slate-800' : 'bg-white'} shadow-lg border-2 border-green-400/30 overflow-x-auto no-scrollbar`}>
           <div className="flex items-center gap-4">
              <ShieldCheck className="text-green-500 shrink-0" size={28} />
              <div className="flex gap-4 min-w-max">
                 {earnedBadges.map(badge => (
                   <div key={badge.id} className="flex flex-col items-center justify-center bg-green-500/10 p-3 rounded-2xl border border-green-500/20 w-20">
                      <span className="text-2xl mb-1">{badge.icon}</span>
                      <span className={`text-[8px] font-black uppercase tracking-tighter text-center leading-none ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{badge.name}</span>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        <div className={`p-5 md:p-6 rounded-[2rem] ${isDarkMode ? 'bg-slate-800' : 'bg-white'} shadow-xl border-b-4 border-blue-500/20 group`}>
          <div className="flex justify-between items-start mb-2">
            <p className="text-[10px] font-black opacity-30 uppercase tracking-widest">Followers</p>
            <Award className="text-yellow-500 opacity-20" size={16} />
          </div>
          <p className="text-3xl md:text-4xl font-black text-[#1368ce] italic">{user.followers.length}</p>
        </div>
        <div className={`p-5 md:p-6 rounded-[2rem] ${isDarkMode ? 'bg-slate-800' : 'bg-white'} shadow-xl border-b-4 border-green-500/20 group`}>
          <div className="flex justify-between items-start mb-2">
            <p className="text-[10px] font-black opacity-30 uppercase tracking-widest">Following</p>
            <TrendingUp className="text-blue-500 opacity-20" size={16} />
          </div>
          <p className="text-3xl md:text-4xl font-black text-[#26890c] italic">{user.following.length}</p>
        </div>
        <div className={`col-span-2 md:col-span-1 p-5 md:p-6 rounded-[2rem] ${isDarkMode ? 'bg-slate-800' : 'bg-white'} shadow-xl border-b-4 border-red-500/20 group`}>
           <div className="flex justify-between items-start mb-2">
            <p className="text-[10px] font-black opacity-30 uppercase tracking-widest">Consistency</p>
            <Flame className="text-red-500 opacity-20" size={16} />
          </div>
          <p className="text-3xl md:text-4xl font-black text-[#e21b3c] italic">{user.moodStreak > 0 ? '98%' : '0%'}</p>
        </div>
      </div>

      <div className={`p-6 md:p-8 rounded-[2.5rem] ${isDarkMode ? 'bg-slate-800 text-white' : 'bg-white text-slate-900'} shadow-2xl overflow-hidden`}>
        <h3 className="text-lg md:text-xl font-black mb-6 uppercase italic flex items-center gap-2">
          <TrendingUp className="text-[#46178f]" />
          Emotional Harmony
        </h3>
        <div className="h-48 md:h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? "#334155" : "#e2e8f0"} />
              <XAxis dataKey="name" stroke={isDarkMode ? "#94a3b8" : "#64748b"} fontSize={10} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: isDarkMode ? '#1e293b' : '#fff', 
                  borderRadius: '16px',
                  border: 'none',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  fontWeight: '900',
                  fontSize: '12px'
                }} 
              />
              <Area type="monotone" dataKey="score" stroke="#46178f" fill="#46178f" fillOpacity={0.15} strokeWidth={4} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className={`p-6 rounded-[2rem] border-l-8 border-[#ffa602] ${isDarkMode ? 'bg-slate-800' : 'bg-white'} shadow-lg`}>
          <h4 className={`font-black text-lg mb-3 uppercase italic ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Daily Wisdom</h4>
          <p className={`italic font-bold text-sm md:text-base opacity-70 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>"Consistency isn't about being perfect; it's about being present. Your streak matters!"</p>
        </div>
        <div className={`p-6 rounded-[2rem] border-l-8 border-[#1368ce] ${isDarkMode ? 'bg-slate-800' : 'bg-white'} shadow-lg`}>
          <h4 className={`font-black text-lg mb-3 uppercase italic ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Status Report</h4>
          <p className={`font-bold text-sm md:text-base opacity-70 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>You have contributed {user.moodHistory.length} emotional updates to the city's collective vibe.</p>
        </div>
      </div>
    </div>
  );
};

export default HomeSection;

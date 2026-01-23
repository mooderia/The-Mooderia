
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Home, Smile, Moon, Building2, User, Settings, Bell, LucideProps, Clock as ClockIcon, ChevronRight } from 'lucide-react';
import { Section, User as UserType } from '../types';

interface SidebarProps {
  activeSection: Section;
  onNavigate: (section: Section) => void;
  isDarkMode: boolean;
  user: UserType;
  unreadMessages?: number;
  unreadNotifications?: number;
}

const Sidebar: React.FC<SidebarProps> = ({ activeSection, onNavigate, isDarkMode, user, unreadMessages = 0, unreadNotifications = 0 }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const items: { id: Section, icon: React.ReactElement<LucideProps>, color: string, label: string, mobileLabel: string }[] = [
    { id: 'Home', icon: <Home />, color: 'kahoot-button-purple', label: 'Dashboard', mobileLabel: 'Home' },
    { id: 'Mood', icon: <Smile />, color: 'kahoot-button-blue', label: 'Mood Labs', mobileLabel: 'Labs' },
    { id: 'Zodiac', icon: <Moon />, color: 'kahoot-button-green', label: 'Zodiac Hub', mobileLabel: 'Stars' },
    { id: 'CityHall', icon: <Building2 />, color: 'kahoot-button-red', label: 'Citizen Hub', mobileLabel: 'City' },
    { id: 'Notifications', icon: <Bell />, color: 'kahoot-button-yellow', label: 'Alerts', mobileLabel: 'Alerts' },
  ];

  const formattedTime = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

  return (
    <>
      {/* Mobile Top Header */}
      <div className={`md:hidden fixed top-0 left-0 right-0 z-[60] px-6 py-4 flex justify-between items-center ${isDarkMode ? 'bg-slate-900/95 border-slate-800' : 'bg-white/95 border-gray-100'} backdrop-blur-xl border-b shadow-sm`}>
        <div className="flex flex-col">
          <h1 className="text-2xl font-black italic tracking-tighter text-[#46178f] uppercase leading-none select-none">
            Mooderia
          </h1>
          <div className="flex items-center gap-1 opacity-30 mt-1">
            <span className="text-[9px] font-black uppercase tracking-widest tabular-nums">{formattedTime}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
           <button 
             onClick={() => onNavigate('Settings')} 
             className={`p-2.5 rounded-2xl transition-all shadow-sm active:scale-95 ${activeSection === 'Settings' ? 'bg-[#46178f] text-white' : 'text-gray-400 bg-black/5 dark:bg-white/5'}`}
           >
            <Settings size={22} />
          </button>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className={`md:hidden fixed bottom-0 left-0 right-0 z-[60] ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'} border-t px-1 pb-safe shadow-[0_-10px_30px_rgba(0,0,0,0.1)]`}>
        <div className="flex justify-around items-center h-20">
          {items.map(item => (
            <button 
              key={item.id} 
              onClick={() => onNavigate(item.id)} 
              className={`relative flex flex-col items-center justify-center transition-all flex-1 py-3 rounded-2xl active:scale-90 ${activeSection === item.id ? 'text-[#46178f]' : 'text-gray-400 opacity-60'}`}
            >
              <div className="relative">
                {React.cloneElement(item.icon, { size: 24 })}
                {item.id === 'CityHall' && unreadMessages > 0 && <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#e21b3c] text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-white shadow-sm">{unreadMessages}</span>}
                {item.id === 'Notifications' && unreadNotifications > 0 && <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#ffa602] text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-white shadow-sm">{unreadNotifications}</span>}
              </div>
              <span className="text-[9px] font-black uppercase mt-1.5 tracking-tight">{item.mobileLabel}</span>
              {activeSection === item.id && <motion.div layoutId="mobile-indicator" className="absolute -bottom-1 w-1.5 h-1.5 bg-[#46178f] rounded-full" />}
            </button>
          ))}
          <button 
            onClick={() => onNavigate('Profile')} 
            className={`relative flex flex-col items-center justify-center flex-1 py-3 active:scale-90 ${activeSection === 'Profile' ? 'text-indigo-600' : 'text-gray-400 opacity-60'}`}
          >
             <User size={24} />
             <span className="text-[9px] font-black uppercase mt-1.5 tracking-tight">Profile</span>
             {activeSection === 'Profile' && <motion.div layoutId="mobile-indicator" className="absolute -bottom-1 w-1.5 h-1.5 bg-indigo-600 rounded-full" />}
          </button>
        </div>
      </nav>

      {/* Desktop Sidebar */}
      <aside className={`hidden md:flex flex-col w-64 lg:w-68 p-5 lg:p-6 h-screen sticky top-0 ${isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-gray-100 text-slate-900'} border-r shadow-2xl z-50`}>
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-black italic tracking-tighter text-[#46178f] uppercase leading-none select-none drop-shadow-sm">
            Mooderia
          </h1>
          <div className="flex items-center gap-2 mt-3 opacity-30 px-1">
            <ClockIcon size={14} /> 
            <span className="text-[10px] font-black uppercase tracking-[0.25em] tabular-nums">{formattedTime}</span>
          </div>
        </div>

        <nav className="flex-1 space-y-2.5">
          {items.map(item => (
            <button 
              key={item.id} 
              onClick={() => onNavigate(item.id)} 
              className={`w-full group relative flex items-center gap-3.5 p-3 rounded-2xl font-black text-[13px] uppercase tracking-tight transition-all border-b-4 active:translate-y-0.5 active:border-b-2 ${activeSection === item.id ? item.color + ' text-white translate-x-1 shadow-md' : 'hover:bg-black/5 opacity-70 hover:opacity-100'}`}
            >
              <span className="shrink-0">{React.cloneElement(item.icon, { size: 20 })}</span>
              <span className="flex-1 text-left">{item.label}</span>
              {item.id === 'CityHall' && unreadMessages > 0 && <span className="bg-red-500 text-white text-[9px] px-2 py-0.5 rounded-full border-2 border-white shadow-lg leading-none">{unreadMessages}</span>}
              <ChevronRight size={16} className={`opacity-0 group-hover:opacity-100 transition-all ${activeSection === item.id ? 'opacity-100 translate-x-1' : ''}`} />
            </button>
          ))}
          <div className="h-px bg-black/5 dark:bg-white/5 my-4 mx-2" />
          <button 
            onClick={() => onNavigate('Profile')} 
            className={`w-full flex items-center gap-3.5 p-3 rounded-2xl font-black text-[13px] uppercase tracking-tight transition-all border-b-4 active:translate-y-0.5 active:border-b-2 ${activeSection === 'Profile' ? 'bg-indigo-600 border-indigo-800 text-white translate-x-1 shadow-md' : 'hover:bg-black/5 opacity-70 hover:opacity-100'}`}
          >
            <User size={20} /> Profile ID
          </button>
          <button 
            onClick={() => onNavigate('Settings')} 
            className={`w-full flex items-center gap-3.5 p-3 rounded-2xl font-black text-[13px] uppercase tracking-tight transition-all border-b-4 active:translate-y-0.5 active:border-b-2 ${activeSection === 'Settings' ? 'bg-gray-700 border-gray-900 text-white translate-x-1 shadow-md' : 'hover:bg-black/5 opacity-70 hover:opacity-100'}`}
          >
            <Settings size={20} /> Operations
          </button>
        </nav>

        <div 
          className="mt-6 bg-black/5 dark:bg-white/5 p-3 rounded-3xl border border-black/5 flex items-center gap-3 transition-all hover:scale-[1.02] hover:bg-black/[0.08] dark:hover:bg-white/[0.08] cursor-pointer active:scale-95 shadow-sm" 
          onClick={() => onNavigate('Profile')}
        >
           <div className="w-10 h-10 rounded-xl bg-indigo-500 shadow-lg flex items-center justify-center text-white font-black overflow-hidden shrink-0 border-2 border-white/20">
             {user.profilePic ? <img src={user.profilePic} className="w-full h-full object-cover" alt="" /> : user.displayName[0]}
           </div>
           <div className="flex-1 min-w-0">
             <p className="font-black text-[11px] truncate leading-none mb-1">{user.displayName}</p>
             <p className="text-[8px] font-black uppercase opacity-40 tracking-[0.2em] truncate">{user.title}</p>
           </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

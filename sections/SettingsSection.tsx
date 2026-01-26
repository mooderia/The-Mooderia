
import React from 'react';
import { LogOut, Moon, Sun, UserMinus, ShieldAlert, Globe, ShieldCheck, DoorOpen } from 'lucide-react';
import { User } from '../types';

interface SettingsSectionProps {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onLogout: () => void;
  user: User;
  onUnblock: (username: string) => void;
}

const SettingsSection: React.FC<SettingsSectionProps> = ({ 
  isDarkMode, 
  onToggleDarkMode, 
  onLogout, 
  user,
  onUnblock
}) => {
  const isGuest = user.email === 'guest@mooderia.local';

  return (
    <div className="space-y-6 pb-20 h-full overflow-y-auto fading-scrollbar pr-2">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
        <div>
          <h2 className={`text-4xl font-black italic uppercase tracking-tighter ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>City Settings</h2>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40 mt-1">Metropolis System Interface</p>
        </div>
        <div className="flex items-center gap-2 mt-4 md:mt-0">
          <div className={`w-2 h-2 ${isGuest ? 'bg-yellow-500' : 'bg-green-500'} rounded-full animate-pulse`} />
          <p className="text-[9px] font-black uppercase tracking-widest opacity-60">
            {isGuest ? 'Guest Instance Active' : 'Global Cloud Active'}
          </p>
        </div>
      </div>

      <div className={`p-8 rounded-[3rem] ${isDarkMode ? 'bg-slate-900 border-white/5' : 'bg-white border-black/5'} border-4 space-y-8 shadow-2xl`}>
        
        {/* Dark Mode Toggle */}
        <div className={`flex items-center justify-between p-6 ${isDarkMode ? 'bg-white/5' : 'bg-gray-50'} rounded-3xl border-2 border-black/5`}>
          <div className="flex items-center gap-4 text-slate-900 dark:text-white">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl text-purple-600">
              {isDarkMode ? <Moon size={24}/> : <Sun size={24}/>}
            </div>
            <div>
              <p className="font-black italic uppercase text-sm">City Lighting</p>
              <p className="text-[10px] opacity-40 font-black uppercase tracking-widest">Interface Luminosity</p>
            </div>
          </div>
          <button 
            onClick={onToggleDarkMode}
            className={`w-14 h-8 rounded-full p-1 transition-all ${isDarkMode ? 'bg-green-500' : 'bg-gray-300'}`}
          >
            <div className={`w-6 h-6 bg-white rounded-full shadow-md transition-transform ${isDarkMode ? 'translate-x-6' : 'translate-x-0'}`}></div>
          </button>
        </div>

        {/* Global Identity Card */}
        {!isGuest ? (
          <div className="p-8 bg-blue-600/5 dark:bg-blue-600/10 rounded-[3rem] border-4 border-dashed border-blue-600/20">
            <div className="flex items-center gap-3 mb-6 text-blue-600">
              <Globe size={28} />
              <div>
                <h3 className="font-black italic uppercase text-xl leading-none">Worldwide Sync</h3>
                <p className="text-[9px] font-black uppercase opacity-40 tracking-widest mt-1">Real-Time Identity Profile</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-white dark:bg-slate-800 rounded-2xl border-2 border-black/5">
              <ShieldCheck size={20} className="text-green-500 shrink-0 mt-1" />
              <p className="text-[11px] font-bold opacity-60 uppercase tracking-tight leading-relaxed">
                Your identity is anchored to the <span className="text-blue-600 font-black">MOODERIA CLOUD</span>. Log in on any device worldwide to instantly resume your progress.
              </p>
            </div>
          </div>
        ) : (
          <div className="p-8 bg-yellow-600/5 dark:bg-yellow-600/10 rounded-[3rem] border-4 border-dashed border-yellow-600/20">
            <div className="flex items-center gap-3 mb-6 text-yellow-600">
              <ShieldAlert size={28} />
              <div>
                <h3 className="font-black italic uppercase text-xl leading-none">Local Guest Mode</h3>
                <p className="text-[9px] font-black uppercase opacity-40 tracking-widest mt-1">Unregistered Citizen Instance</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-white dark:bg-slate-800 rounded-2xl border-2 border-black/5">
              <ShieldAlert size={20} className="text-yellow-500 shrink-0 mt-1" />
              <p className="text-[11px] font-bold opacity-60 uppercase tracking-tight leading-relaxed">
                You are currently a <span className="text-yellow-600 font-black">GUEST</span>. Your progress is only saved on this device. Sign up to unlock full city features and cloud sync!
              </p>
            </div>
          </div>
        )}

        <div className="pt-8 border-t border-black/5 space-y-4">
          <button 
            onClick={onLogout}
            className={`w-full p-6 rounded-[2rem] ${isGuest ? 'bg-slate-700 hover:bg-slate-800 border-slate-900' : 'bg-[#e21b3c] hover:bg-[#b31530] border-red-900'} text-white font-black flex items-center justify-center gap-4 shadow-2xl transition-transform active:scale-95 uppercase text-lg italic tracking-tighter border-b-8`}
          >
            {isGuest ? <DoorOpen size={28} /> : <LogOut size={28} />}
            {isGuest ? 'Exit Guest Mode' : 'Terminate Cloud Link'}
          </button>
        </div>

      </div>

      <div className="text-center opacity-20 font-black italic tracking-widest text-[10px] py-12">
        METROPOLIS WORLDWIDE SYNC v6.0.0
      </div>
    </div>
  );
};

export default SettingsSection;


import React from 'react';
import { LogOut, Moon, Sun, UserMinus, ShieldAlert, Globe, ShieldCheck, DoorOpen, Download, Smartphone, Monitor, Server } from 'lucide-react';
import { User } from '../types';

interface SettingsSectionProps {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onLogout: () => void;
  user: User;
  onUnblock: (username: string) => void;
  isElectron?: boolean;
  isCapacitor?: boolean;
}

const SettingsSection: React.FC<SettingsSectionProps> = ({ 
  isDarkMode, 
  onToggleDarkMode, 
  onLogout, 
  user,
  onUnblock,
  isElectron = false,
  isCapacitor = false
}) => {
  const isGuest = user.email === 'guest@mooderia.local';

  const handleDownloadAPK = () => {
    window.open('/downloads/The-Mooderia.apk', '_blank');
  };

  const handleDownloadEXE = () => {
    window.open('/downloads/The-Mooderia-Setup.exe', '_blank');
  };

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

        {/* Worldwide Infrastructure Info */}
        <div className={`p-8 rounded-[3rem] ${isDarkMode ? 'bg-indigo-900/20' : 'bg-indigo-50'} border-4 border-indigo-500/10`}>
          <div className="flex items-center gap-4 mb-4 text-indigo-600 dark:text-indigo-400">
            <Server size={32} />
            <div>
              <h3 className="font-black italic uppercase text-xl leading-none">Global Infrastructure</h3>
              <p className="text-[9px] font-black uppercase opacity-60 tracking-widest mt-1">Non-Local Worldwide Grid</p>
            </div>
          </div>
          <p className="text-[11px] font-bold opacity-70 uppercase tracking-tight leading-relaxed mb-4">
            Mooderia operates on a distributed worldwide server network. Your data is never stored purely locally, ensuring real-time synchronization across all your devices, whether on the web, desktop, or mobile.
          </p>
          <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 text-green-500 rounded-xl w-fit">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
            <span className="text-[10px] font-black uppercase tracking-widest">Live Worldwide Connection</span>
          </div>
        </div>

        {/* Metropolis for Desktop & Mobile Section */}
        <div className={`p-8 rounded-[3rem] ${isDarkMode ? 'bg-black/20' : 'bg-gray-50/50'} border-4 border-black/5 space-y-6`}>
          <div className="flex items-center gap-3 text-custom">
            <Download size={28} />
            <h3 className="font-black italic uppercase text-xl leading-none">Metropolis Portability</h3>
          </div>
          <p className="text-[10px] font-bold opacity-60 uppercase tracking-widest">
            Take the metropolis with you. Download the official Mooderia apps for all your devices.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Windows EXE */}
            <button 
              onClick={handleDownloadEXE}
              className="p-6 bg-white dark:bg-slate-800 rounded-[2rem] border-4 border-black/5 flex flex-col items-center justify-center gap-3 shadow-xl active:scale-95 transition-transform group"
            >
              <Monitor size={32} className="group-hover:scale-110 transition-transform text-blue-500" />
              <div className="text-center">
                <span className="block font-black uppercase text-sm italic">Windows .EXE</span>
                <span className="text-[9px] font-black opacity-40 uppercase tracking-widest">Desktop Uplink</span>
              </div>
            </button>

            {/* Android APK Teaser */}
            <div 
              className="relative p-6 bg-white/50 dark:bg-slate-900/50 rounded-[2rem] border-4 border-dashed border-black/10 flex flex-col items-center justify-center gap-3 overflow-hidden group cursor-help"
            >
              <div className="absolute top-3 right-3 bg-indigo-600 text-white text-[8px] font-black uppercase px-2 py-1 rounded-full animate-pulse tracking-widest">
                Coming Soon
              </div>
              <Smartphone size={32} className="opacity-20 grayscale" />
              <div className="text-center opacity-30">
                <span className="block font-black uppercase text-sm italic">Mobile App</span>
                <span className="text-[9px] font-black uppercase tracking-widest">Neural Link Pending</span>
              </div>
              
              {/* Teaser Overlay on Hover */}
              <div className="absolute inset-0 bg-indigo-600 opacity-0 group-hover:opacity-95 transition-opacity flex flex-col items-center justify-center p-4 text-center">
                <p className="text-white text-[10px] font-black uppercase tracking-tighter leading-tight">
                  The Metropolis is expanding to your pocket. Mobile Resonance synchronization is currently at 85%.
                </p>
                <div className="mt-3 w-full h-1 bg-white/20 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: '85%' }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="h-full bg-white"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-yellow-500/10 border-2 border-yellow-500/20 rounded-2xl flex items-start gap-3">
            <ShieldAlert size={20} className="text-yellow-600 shrink-0" />
            <p className="text-[10px] font-bold text-yellow-700 dark:text-yellow-500 uppercase tracking-tight leading-tight">
              SYSTEM NOTE: In standalone app mode (.EXE/.APK), Citizen Hub and Express lock automatically when the connection is lost to protect worldwide sync.
            </p>
          </div>
        </div>

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

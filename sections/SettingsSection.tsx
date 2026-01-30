
import React, { useState } from 'react';
import { LogOut, Moon, Sun, Globe, ShieldCheck, DoorOpen, Download, Smartphone, Package, Monitor, Terminal, Info, ChevronRight, Github } from 'lucide-react';
import { User } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

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
  user
}) => {
  const [showBuildGuide, setShowBuildGuide] = useState<'APK' | 'EXE' | null>(null);
  const isGuest = user.email === 'guest@mooderia.local';

  const handleDownload = (platform: 'APK' | 'EXE') => {
    // DEVELOPER NOTE: Once you build your APK or EXE, 
    // place the file in the project root and update these links.
    // Example: APK: '/mooderia-v1.apk'
    const links = {
      APK: '#', 
      EXE: '#'  
    };

    if (links[platform] === '#') {
      setShowBuildGuide(platform);
    } else {
      window.open(links[platform], '_blank');
    }
  };

  return (
    <div className="space-y-6 pb-20 h-full overflow-y-auto fading-scrollbar pr-2">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
        <div>
          <h2 className={`text-4xl font-black italic uppercase tracking-tighter ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>City Settings</h2>
          <p className="text-[10px] font-black opacity-40 uppercase tracking-[0.4em] mt-1">Metropolis System Interface</p>
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

        {/* Metropolis Portability - Prominent Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-2">
             <Smartphone className="text-custom" size={20} />
             <h3 className="text-xl font-black uppercase italic tracking-tighter">Portability Hub</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Android APK Card */}
            <div className={`p-6 rounded-[2.5rem] border-4 ${isDarkMode ? 'bg-indigo-950/20 border-indigo-500/20' : 'bg-indigo-50/50 border-indigo-100'} shadow-inner group relative overflow-hidden`}>
              <div className="flex items-center gap-3 mb-6 relative z-10">
                <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-lg">
                  <Smartphone size={24} />
                </div>
                <div>
                  <h4 className="font-black italic uppercase text-lg leading-none tracking-tighter">Android Portal</h4>
                  <p className="text-[8px] font-black uppercase opacity-40 tracking-widest mt-1">Official .APK Bundle</p>
                </div>
              </div>
              <button 
                onClick={() => handleDownload('APK')}
                className="w-full p-4 bg-white dark:bg-slate-800 rounded-2xl border-b-6 border-black/10 flex items-center justify-center gap-3 shadow-xl active:translate-y-1 active:border-b-2 transition-all"
              >
                <Download size={18} className="text-indigo-600" />
                <span className="font-black uppercase text-[10px] italic text-indigo-600">Download APK</span>
              </button>
              <button onClick={() => setShowBuildGuide('APK')} className="w-full mt-3 text-[8px] font-black uppercase opacity-30 hover:opacity-100 transition-all flex items-center justify-center gap-1">
                <Info size={10} /> How to build in GitHub Codespace
              </button>
            </div>

            {/* Windows EXE Card */}
            <div className={`p-6 rounded-[2.5rem] border-4 ${isDarkMode ? 'bg-blue-950/20 border-blue-500/20' : 'bg-blue-50/50 border-blue-100'} shadow-inner group relative overflow-hidden`}>
              <div className="flex items-center gap-3 mb-6 relative z-10">
                <div className="p-3 bg-blue-600 rounded-2xl text-white shadow-lg">
                  <Monitor size={24} />
                </div>
                <div>
                  <h4 className="font-black italic uppercase text-lg leading-none tracking-tighter">Windows Core</h4>
                  <p className="text-[8px] font-black uppercase opacity-40 tracking-widest mt-1">Desktop .EXE Binary</p>
                </div>
              </div>
              <button 
                onClick={() => handleDownload('EXE')}
                className="w-full p-4 bg-white dark:bg-slate-800 rounded-2xl border-b-6 border-black/10 flex items-center justify-center gap-3 shadow-xl active:translate-y-1 active:border-b-2 transition-all"
              >
                <Package size={18} className="text-blue-600" />
                <span className="font-black uppercase text-[10px] italic text-blue-600">Download EXE</span>
              </button>
              <button onClick={() => setShowBuildGuide('EXE')} className="w-full mt-3 text-[8px] font-black uppercase opacity-30 hover:opacity-100 transition-all flex items-center justify-center gap-1">
                <Info size={10} /> How to build in GitHub Codespace
              </button>
            </div>
          </div>
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
                Your identity is anchored to the <span className="text-blue-600 font-black">MOODERIA CLOUD</span>. Progress syncs across APK, EXE, and Web.
              </p>
            </div>
          </div>
        ) : (
          <div className="p-8 bg-yellow-600/5 dark:bg-yellow-600/10 rounded-[3rem] border-4 border-dashed border-yellow-600/20">
            <div className="flex items-center gap-3 mb-6 text-yellow-600">
              <Terminal size={28} />
              <div>
                <h3 className="font-black italic uppercase text-xl leading-none">Local Mode</h3>
                <p className="text-[9px] font-black uppercase opacity-40 tracking-widest mt-1">Guest Instance</p>
              </div>
            </div>
            <p className="text-[11px] font-bold opacity-60 uppercase tracking-tight leading-relaxed">
              Sign up to enable cross-platform sync between your phone and computer!
            </p>
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

      {/* Build Guide Modal */}
      <AnimatePresence>
        {showBuildGuide && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              className={`${isDarkMode ? 'bg-slate-900 border-white/10' : 'bg-white border-black/5'} w-full max-w-lg rounded-[3rem] p-8 border-4 shadow-2xl relative flex flex-col max-h-[85vh]`}
            >
               <button onClick={() => setShowBuildGuide(null)} className="absolute top-6 right-6 opacity-40 hover:opacity-100 transition-all text-custom"><Package size={32}/></button>
               
               <div className="mb-6">
                 <h3 className="text-2xl font-black italic uppercase tracking-tighter leading-none flex items-center gap-2">
                   {showBuildGuide === 'APK' ? <Smartphone size={24}/> : <Monitor size={24}/>} 
                   Build Metropolis Binary
                 </h3>
                 <p className="text-[9px] font-black uppercase opacity-40 tracking-widest mt-2">GitHub Codespace Terminal Instructions</p>
               </div>

               <div className="space-y-6 overflow-y-auto fading-scrollbar pr-2">
                 <div className="bg-black/10 dark:bg-white/5 p-4 rounded-2xl border-2 border-black/5 space-y-3">
                   <div className="flex items-center gap-2 text-custom">
                     <Github size={16} />
                     <p className="text-[10px] font-black uppercase">Step 1: Install Dependencies</p>
                   </div>
                   <div className="bg-black dark:bg-slate-950 p-3 rounded-lg font-mono text-[10px] text-green-400 overflow-x-auto whitespace-nowrap">
                     {showBuildGuide === 'APK' 
                        ? 'npm install @capacitor/core @capacitor/cli @capacitor/android' 
                        : 'npm install electron electron-builder --save-dev'}
                   </div>
                 </div>

                 <div className="bg-black/10 dark:bg-white/5 p-4 rounded-2xl border-2 border-black/5 space-y-3">
                   <div className="flex items-center gap-2 text-custom">
                     <Terminal size={16} />
                     <p className="text-[10px] font-black uppercase">Step 2: Generate Bundle</p>
                   </div>
                   <div className="bg-black dark:bg-slate-950 p-3 rounded-lg font-mono text-[10px] text-green-400 overflow-x-auto">
                     {showBuildGuide === 'APK' 
                        ? 'npx cap add android && npx cap copy' 
                        : 'npx electron-builder --win'}
                   </div>
                 </div>

                 <div className="p-4 bg-orange-500/10 border-2 border-orange-500/20 rounded-2xl flex items-start gap-3">
                    <Info size={16} className="text-orange-500 mt-1 shrink-0" />
                    <p className="text-[10px] font-bold opacity-70 leading-relaxed italic">
                      Since I am an AI, I cannot deliver the binary file directly. You must run these commands in your <b>GitHub Codespace terminal</b> to create the file. Once finished, upload it to your repository and update the download link in <code>SettingsSection.tsx</code>!
                    </p>
                 </div>

                 <button onClick={() => setShowBuildGuide(null)} className="kahoot-button-custom w-full py-4 rounded-2xl text-white font-black uppercase text-xs shadow-lg active:scale-95 transition-all">
                   I UNDERSTAND
                 </button>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="text-center opacity-20 font-black italic tracking-widest text-[10px] py-12">
        METROPOLIS MULTI-PLATFORM v6.2.0
      </div>
    </div>
  );
};

export default SettingsSection;

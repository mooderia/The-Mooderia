
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User } from '../types';
import LoadingScreen from '../components/LoadingScreen';
import { Cloud, Key, UserPlus, LogIn, ShieldCheck, Globe, UserCheck, AlertTriangle, WifiOff } from 'lucide-react';
import { supabase, isCloudEnabled, syncProfile } from '../services/supabaseService';

interface AuthScreenProps {
  onLogin: (user: User) => void;
  isOffline?: boolean;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin, isOffline = false }) => {
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (isOffline) {
       setError("Neural connection lost. Metropolis registration requires a live link.");
       return;
    }

    setIsAuthenticating(true);

    if (isCloudEnabled && supabase) {
      try {
        if (authMode === 'signup') {
          const { data, error: signUpError } = await supabase.auth.signUp({ email, password });
          if (signUpError) throw signUpError;
          
          if (data.user) {
            const newUser: User = {
              displayName, username, email,
              followers: [], following: [], friends: [], blockedUsers: [], posts: [], reposts: [],
              moodHistory: [], moodStreak: 0, title: 'Citizen', likesReceived: 0,
              petName: 'Guardian', moodCoins: 100, petEmoji: '🐱', petHunger: 100, petThirst: 100, petRest: 100,
              petLevel: 1, petExp: 0, petHasBeenChosen: false, petLastUpdate: Date.now(), petSleepUntil: null,
              gameCooldowns: {}, warnings: 0, isBanned: false
            };
            await syncProfile({ ...newUser, id: data.user.id });
            onLogin(newUser);
          }
        } else {
          const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
          if (signInError) throw signInError;
          
          const { data: profile } = await supabase.from('profiles').select('*').eq('id', data.user.id).single();
          if (profile) onLogin(profile.metadata);
          else throw new Error("Profile not found in cloud grid.");
        }
      } catch (err: any) {
        setError(err.message + ". (Email limits may apply)");
        setIsAuthenticating(false);
      }
    } else {
      handleGuestAccess();
    }
  };

  const handleGuestAccess = () => {
    setIsAuthenticating(true);
    setTimeout(() => {
      onLogin({ 
        displayName: displayName || 'Citizen', 
        username: username || 'guest_' + Math.random().toString(36).substr(2, 5), 
        email: email || 'guest@mooderia.local', 
        moodStreak: 0,
        followers: [], following: [], friends: [], blockedUsers: [], posts: [], reposts: [],
        moodHistory: [], title: 'Guest', likesReceived: 0,
        petName: 'Guardian', moodCoins: 100, petEmoji: '🐱', petHunger: 100, petThirst: 100, petRest: 100,
        petLevel: 1, petExp: 0, petHasBeenChosen: false, petLastUpdate: Date.now(), petSleepUntil: null,
        gameCooldowns: {}, warnings: 0, isBanned: false
      } as any);
    }, 1000);
  };

  if (isAuthenticating) return <LoadingScreen />;

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#46178f] p-4 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden">
        {Array.from({ length: 15 }).map((_, i) => (
          <div key={i} className="absolute text-white font-black opacity-20 rotate-12 text-6xl" style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%` }}>MOODERIA</div>
        ))}
      </div>
      
      <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="w-full max-w-md bg-slate-900 border-4 border-white/10 rounded-[2.5rem] shadow-2xl p-8 z-10 text-white">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-black italic text-white tracking-tighter mb-2 uppercase">Mooderia</h1>
          <div className="flex items-center justify-center gap-2">
            {isOffline ? <WifiOff size={14} className="text-red-500" /> : <Globe size={14} className="text-blue-400" />}
            <p className={`${isOffline ? 'text-red-500' : 'text-blue-400'} font-bold uppercase tracking-widest text-[10px]`}>
               {isOffline ? 'Metropolis Offline' : 'Worldwide Sync Grid'}
            </p>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <AnimatePresence mode="wait">
            {authMode === 'signup' && (
              <motion.div key="signup" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="space-y-4 overflow-hidden">
                {/* Email Rate Limit Warning Banner */}
                <div className="bg-[#ffa602] text-black p-4 rounded-2xl flex items-start gap-3 shadow-lg mb-2">
                   <AlertTriangle className="shrink-0 mt-1" size={20} />
                   <div>
                     <p className="text-[10px] font-black uppercase tracking-tight leading-tight">Metropolis Notice</p>
                     <p className="text-[9px] font-bold leading-tight opacity-80 mt-1">
                       The sync grid limits citizens to <span className="font-black">3 verification emails per hour</span>. Use the "Guest" option below if the system times out!
                     </p>
                   </div>
                </div>

                <input type="text" placeholder="Identity Name" required value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="w-full p-4 rounded-xl bg-slate-800 text-white border-2 border-slate-700 focus:border-blue-500 outline-none font-bold text-sm" />
                <input type="text" placeholder="ID Handle (Username)" required value={username} onChange={(e) => setUsername(e.target.value)} className="w-full p-4 rounded-xl bg-slate-800 text-white border-2 border-slate-700 focus:border-blue-500 outline-none font-bold text-sm" />
              </motion.div>
            )}
          </AnimatePresence>

          <input type="email" placeholder="Neural Link (Email)" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-4 rounded-xl bg-slate-800 text-white border-2 border-slate-700 focus:border-blue-500 outline-none font-bold text-sm" />
          <input type="password" placeholder="Access Phrase (Password)" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-4 rounded-xl bg-slate-800 text-white border-2 border-slate-700 focus:border-blue-500 outline-none font-bold text-sm" />

          {error && <p className="text-[#e21b3c] text-xs font-black text-center bg-red-500/10 p-3 rounded-xl border border-red-500/20">{error}</p>}
          
          <button type="submit" disabled={isOffline} className={`kahoot-button-blue w-full p-5 rounded-2xl text-white font-black text-lg mt-4 shadow-lg active:scale-95 uppercase flex items-center justify-center gap-3 ${isOffline ? 'opacity-50 grayscale cursor-not-allowed' : ''}`}>
            {authMode === 'signup' ? <UserPlus size={20}/> : <LogIn size={20}/>}
            {authMode === 'signup' ? 'Authorize ID' : 'Synchronize'}
          </button>
        </form>
        
        <div className="mt-8 flex flex-col gap-4">
          {!isOffline && (
            <button onClick={() => { setAuthMode(authMode === 'login' ? 'signup' : 'login'); setError(''); }} className="text-xs font-bold text-blue-400 hover:text-white transition-colors hover:underline text-center uppercase tracking-widest">
              {authMode === 'signup' ? 'Back to Neural Login' : "New entity? Apply for Citizenship"}
            </button>
          )}
          
          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-white/10"></div>
            <span className="flex-shrink mx-4 text-[8px] font-black uppercase opacity-20 tracking-widest text-white">OR BYPASS LIMITS</span>
            <div className="flex-grow border-t border-white/10"></div>
          </div>

          <button onClick={handleGuestAccess} className="w-full py-4 rounded-2xl bg-white/5 border-2 border-white/10 text-white font-black text-[10px] uppercase flex items-center justify-center gap-2 hover:bg-white/10 transition-all active:scale-95">
            <UserCheck size={16} /> Proceed as Metropolis Guest
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthScreen;

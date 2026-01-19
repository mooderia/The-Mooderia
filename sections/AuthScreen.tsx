
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User } from '../types';
import LoadingScreen from '../components/LoadingScreen';

interface AuthScreenProps {
  onLogin: (user: User) => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [pendingUser, setPendingUser] = useState<User | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const allUsersStr = localStorage.getItem('mooderia_all_users') || '[]';
    const allUsers: User[] = JSON.parse(allUsersStr);

    if (isSignUp) {
      const userExists = allUsers.some(u => u.email === email || u.username === username);
      if (userExists) {
        setError('This citizen identifier already exists in Mooderia.');
        return;
      }

      const newUser: User = {
        displayName: displayName,
        username: username,
        email: email,
        password: password,
        followers: [],
        following: [],
        friends: [],
        blockedUsers: [],
        posts: [],
        reposts: [],
        moodHistory: [],
        moodStreak: 0,
        title: 'Citizen',
        // Mood Pet Init
        moodCoins: 50, // Starting bonus
        petEmoji: '🐱',
        petHunger: 80,
        petThirst: 80,
        petRest: 100,
        petLastUpdate: Date.now(),
        petSleepUntil: null
      };

      allUsers.push(newUser);
      localStorage.setItem('mooderia_all_users', JSON.stringify(allUsers));
      
      setIsAuthenticating(true);
      setPendingUser(newUser);
      setTimeout(() => {
        onLogin(newUser);
      }, 3000);
    } else {
      const existingUser = allUsers.find(u => u.email === email && u.password === password);
      
      if (existingUser) {
        setIsAuthenticating(true);
        setPendingUser(existingUser);
        setTimeout(() => {
          onLogin(existingUser);
        }, 3000);
      } else {
        setError('Citizenship credentials invalid. Please check your email and password.');
      }
    }
  };

  if (isAuthenticating) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#46178f] p-4 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#1368ce] rounded-full blur-[100px] opacity-30"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#e21b3c] rounded-full blur-[100px] opacity-30"></div>
      
      <motion.div 
        initial={{ y: 50, opacity: 0 }} 
        animate={{ y: 0, opacity: 1 }} 
        className="w-full max-w-md bg-slate-800 border-4 border-white/10 rounded-[2.5rem] shadow-2xl p-8 z-10 text-white"
      >
        <div className="text-center mb-8">
          <h1 className="text-5xl font-black italic text-white tracking-tighter mb-2 uppercase">Mooderia</h1>
          <p className="text-blue-400 font-bold uppercase tracking-widest text-xs">The Vibrant Metropolis</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <AnimatePresence mode="wait">
            {isSignUp && (
              <motion.div 
                key="signup-fields" 
                initial={{ height: 0, opacity: 0 }} 
                animate={{ height: 'auto', opacity: 1 }} 
                exit={{ height: 0, opacity: 0 }} 
                className="space-y-4 overflow-hidden"
              >
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Display Name" 
                    required 
                    value={displayName} 
                    onChange={(e) => setDisplayName(e.target.value)} 
                    maxLength={30}
                    className="w-full p-4 rounded-xl border-2 border-slate-700 bg-slate-700 text-white focus:border-white outline-none font-bold placeholder-slate-400" 
                  />
                  <span className="absolute right-3 bottom-1 text-[8px] font-bold opacity-30">{displayName.length}/30</span>
                </div>
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Username (e.g. mood_king)" 
                    required 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} 
                    maxLength={20}
                    className="w-full p-4 rounded-xl border-2 border-slate-700 bg-slate-700 text-white focus:border-white outline-none font-bold placeholder-slate-400" 
                  />
                  <span className="absolute right-3 bottom-1 text-[8px] font-bold opacity-30">{username.length}/20</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <input 
            type="email" 
            placeholder="Email Address" 
            required 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            className="w-full p-4 rounded-xl border-2 border-slate-700 bg-slate-700 text-white focus:border-white outline-none font-bold placeholder-slate-400" 
          />
          <input 
            type="password" 
            placeholder="Password" 
            required 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            className="w-full p-4 rounded-xl border-2 border-slate-700 bg-slate-700 text-white focus:border-white outline-none font-bold placeholder-slate-400" 
          />
          
          {error && (
            <p className="text-[#e21b3c] text-sm font-bold text-center bg-red-500/10 p-2 rounded-lg">{error}</p>
          )}

          <button 
            type="submit" 
            className="kahoot-button w-full p-5 rounded-2xl bg-[#1368ce] text-white font-black text-xl mt-4 shadow-lg transition-transform active:scale-95 uppercase"
          >
            {isSignUp ? 'Apply for Citizenship' : 'Enter the City'}
          </button>
        </form>
        
        <div className="mt-8 text-center">
          <button 
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError('');
            }} 
            className="text-sm font-bold text-blue-400 hover:text-white transition-colors hover:underline"
          >
            {isSignUp ? 'Already a citizen? Sign In' : "New to Mooderia? Register!"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthScreen;

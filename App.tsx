
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mood, Section, Post, Comment, Message, Notification, Group } from './types';
import Sidebar from './components/Sidebar';
import HomeSection from './sections/HomeSection';
import MoodSection from './sections/MoodSection';
import ZodiacSection from './sections/ZodiacSection';
import CityHallSection from './sections/CityHallSection';
import ProfileSection from './sections/ProfileSection';
import SettingsSection from './sections/SettingsSection';
import NotificationsSection from './sections/NotificationsSection';
import AuthScreen from './sections/AuthScreen';
import LoadingScreen from './components/LoadingScreen';
import MoodCheckIn from './components/MoodCheckIn';
import { Lock, UserPlus } from 'lucide-react';
import { MOOD_SCORES, getExpNeeded } from './constants';
import { supabase, isCloudEnabled, fetchGlobalFeed, syncProfile, fetchProfiles } from './services/supabaseService';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [activeSection, setActiveSection] = useState<Section>('Home');
  const [viewingUsername, setViewingUsername] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false); 
  const [isAppStarting, setIsAppStarting] = useState(true);
  const [showMoodCheckIn, setShowMoodCheckIn] = useState(false);
  
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [allMessages, setAllMessages] = useState<Message[]>([]);
  const [allGroups, setAllGroups] = useState<Group[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const isGuest = useMemo(() => currentUser?.email === 'guest@mooderia.local', [currentUser]);

  const migrateUserData = (user: User): User => {
    return {
      ...user,
      blockedUsers: user.blockedUsers || [],
      moodHistory: user.moodHistory || [],
      following: user.following || [],
      followers: user.followers || [],
      moodStreak: user.moodStreak || 0,
      petLevel: user.petLevel || 1,
      moodCoins: user.moodCoins ?? 100,
      gameCooldowns: user.gameCooldowns || {},
      petHasBeenChosen: !!user.petHasBeenChosen,
      warnings: 0, 
      isBanned: false 
    };
  };

  useEffect(() => {
    const init = async () => {
      const savedTheme = localStorage.getItem('mooderia_theme');
      if (savedTheme === 'dark') setIsDarkMode(true);

      let foundUser = false;

      // 1. Try Cloud
      if (isCloudEnabled && supabase) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session) {
            const { data: profile } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
            if (profile) {
              setCurrentUser(migrateUserData(profile.metadata));
              foundUser = true;
            }
          }
        } catch (e) { console.info("METROPOLIS: Remote session fetch failed."); }
      }

      // 2. Try Local (Includes Guest Persistence)
      if (!foundUser) {
        const savedUser = localStorage.getItem('mooderia_user');
        if (savedUser) {
          setCurrentUser(migrateUserData(JSON.parse(savedUser)));
        }
      }

      // 3. Global Assets
      try {
        const [feed, users] = await Promise.all([fetchGlobalFeed(), fetchProfiles()]);
        setAllPosts(feed as Post[]);
        setAllUsers(users);
      } catch (e) {}

      setIsLoaded(true);
      setTimeout(() => setIsAppStarting(false), 2000);
    };
    init();
  }, []);

  useEffect(() => {
    if (isLoaded && currentUser && !showMoodCheckIn) {
      const todayStr = new Date().toDateString();
      if (currentUser.lastMoodDate !== todayStr) {
        setShowMoodCheckIn(true);
      }
    }
  }, [currentUser?.username, isLoaded]);

  useEffect(() => {
    if (!isLoaded || !currentUser) return;
    localStorage.setItem('mooderia_user', JSON.stringify(currentUser));
    if (isCloudEnabled && !isGuest) syncProfile(currentUser);
  }, [currentUser, isLoaded, isGuest]);

  useEffect(() => {
    const handleAIResponse = (e: any) => {
      setAllMessages(prev => [...prev, e.detail]);
    };
    window.addEventListener('ai-response', handleAIResponse as EventListener);
    return () => window.removeEventListener('ai-response', handleAIResponse as EventListener);
  }, []);

  const handleLogout = useCallback(async () => {
    if (isCloudEnabled && supabase && !isGuest) {
      try {
        await supabase.auth.signOut();
      } catch (e) {}
    }
    localStorage.removeItem('mooderia_user');
    setCurrentUser(null);
  }, [isGuest]);

  const handleUpdatePet = useCallback((
    hunger: number, 
    thirst: number, 
    rest: number, 
    coins: number, 
    exp: number = 0, 
    sleepUntil: number | null = null, 
    newEmoji?: string, 
    markChosen?: boolean, 
    newName?: string, 
    gameCooldownId?: string
  ) => {
    setCurrentUser(prev => {
      if (!prev) return null;
      
      const nextHunger = Math.min(100, Math.max(0, (prev.petHunger || 0) + hunger));
      const nextThirst = Math.min(100, Math.max(0, (prev.petThirst || 0) + thirst));
      const nextRest = Math.min(100, Math.max(0, (prev.petRest || 0) + rest));
      const nextCoins = Math.max(0, (prev.moodCoins || 0) + coins);
      const nextExpTotal = (prev.petExp || 0) + exp;
      
      let currentLevel = prev.petLevel || 1;
      let currentExp = nextExpTotal;
      while (currentExp >= getExpNeeded(currentLevel)) {
        currentExp -= getExpNeeded(currentLevel);
        currentLevel++;
      }

      const nextCooldowns = { ...prev.gameCooldowns };
      if (gameCooldownId) {
        nextCooldowns[gameCooldownId] = Date.now() + 60000; 
      }

      return {
        ...prev,
        petHunger: nextHunger,
        petThirst: nextThirst,
        petRest: nextRest,
        moodCoins: nextCoins,
        petExp: currentExp,
        petLevel: currentLevel,
        petSleepUntil: sleepUntil === null ? prev.petSleepUntil : sleepUntil,
        petEmoji: newEmoji || prev.petEmoji,
        petHasBeenChosen: markChosen !== undefined ? markChosen : prev.petHasBeenChosen,
        petName: newName || prev.petName,
        gameCooldowns: nextCooldowns,
        petLastUpdate: Date.now()
      };
    });
  }, []);

  const handleMoodSubmit = (mood: Mood) => {
    if (!currentUser) return;
    const today = new Date();
    const todayStr = today.toDateString();
    
    let newStreak = 1;
    if (currentUser.lastMoodDate) {
      const lastDate = new Date(currentUser.lastMoodDate);
      const diffTime = Math.abs(today.getTime() - lastDate.getTime());
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        newStreak = (currentUser.moodStreak || 0) + 1;
      } else if (diffDays === 0) {
        newStreak = currentUser.moodStreak || 1;
      } else {
        newStreak = 1; 
      }
    }

    const moodScore = mood ? MOOD_SCORES[mood] : 50;
    const newHistory = [...(currentUser.moodHistory || []), { date: todayStr, mood, score: moodScore }];
    
    setCurrentUser({
      ...currentUser,
      moodHistory: newHistory,
      moodStreak: newStreak,
      lastMoodDate: todayStr,
      moodCoins: (currentUser.moodCoins || 0) + 25, 
      petExp: (currentUser.petExp || 0) + 50
    });

    setShowMoodCheckIn(false);
  };

  const handleSendMessage = async (recipient: string, text: string, options?: any) => {
    if (!currentUser || isGuest) return;
    const newMessageData: any = {
      sender: currentUser.username,
      recipient,
      text,
      is_group: options?.isGroup || false,
    };
    if (isCloudEnabled && supabase) {
      try { await supabase.from('messages').insert(newMessageData); } catch (e) {}
    } else {
      setAllMessages(prev => [...prev, { ...newMessageData, id: Math.random().toString(), timestamp: Date.now(), read: false }]);
    }
  };

  const handlePost = async (content: string, visibility: 'global' | 'circle') => {
    if (!currentUser || isGuest) return;
    const newPostData: any = { author_username: currentUser.username, content, visibility, likes: [] };
    if (isCloudEnabled && supabase) {
      try { await supabase.from('posts').insert(newPostData); } catch (e) {}
    } else {
      setAllPosts(prev => [{ ...newPostData, id: Math.random().toString(), timestamp: Date.now(), author: currentUser.username, likes: [], comments: [] } as any, ...prev]);
    }
  };

  const handleHeart = (postId: string) => {
    if (!currentUser || isGuest) return;
    setAllPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const isLiked = p.likes?.includes(currentUser.username);
        const nextLikes = isLiked ? p.likes.filter(u => u !== currentUser.username) : [...(p.likes || []), currentUser.username];
        return { ...p, likes: nextLikes };
      }
      return p;
    }));
  };

  if (isAppStarting) return <LoadingScreen />;
  if (!currentUser) return <AuthScreen onLogin={(u) => { setCurrentUser(u); setViewingUsername(u.username); }} />;

  const isFixedSection = activeSection === 'CityHall' || activeSection === 'Mood';
  const isLockedForGuest = isGuest && (activeSection === 'CityHall' || activeSection === 'Notifications' || activeSection === 'Profile');

  return (
    <div style={{'--theme-color': currentUser.profileColor || '#e21b3c'} as React.CSSProperties} className={`h-screen max-h-screen overflow-hidden flex flex-col md:flex-row ${isDarkMode ? 'bg-[#0f0f0f] text-white' : 'bg-[#f7f8fa] text-slate-900'} transition-colors duration-300`}>
      <style>{`
        :root { --theme-color: ${currentUser.profileColor || '#e21b3c'}; }
        .kahoot-shadow { box-shadow: 0 4px 0 0 rgba(0,0,0,0.2); }
        .bg-custom { background-color: var(--theme-color); }
        .text-custom { color: var(--theme-color); }
      `}</style>

      <AnimatePresence>
        {showMoodCheckIn && <MoodCheckIn isDarkMode={isDarkMode} onSubmit={handleMoodSubmit} />}
      </AnimatePresence>

      <Sidebar 
        activeSection={activeSection} 
        onNavigate={(s) => { setActiveSection(s); if(s === 'Profile') setViewingUsername(currentUser!.username); }} 
        isDarkMode={isDarkMode} 
        user={currentUser!} 
        isGuest={isGuest}
        unreadMessages={allMessages.filter(m => m.recipient === currentUser!.username && !m.read).length} 
        unreadNotifications={notifications.filter(n => n.recipient === currentUser!.username && !n.read).length} 
      />
      
      <main className="flex-1 flex flex-col min-h-0 relative pt-14 pb-16 md:pt-0 md:pb-0 h-full overflow-hidden">
        <div className={`flex-1 flex flex-col min-h-0 ${isFixedSection ? 'overflow-hidden' : 'overflow-y-auto fading-scrollbar'} p-4 md:p-8`}>
          <motion.div 
            key={activeSection + (activeSection === 'Profile' ? viewingUsername : '')} 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="max-w-6xl mx-auto w-full flex-1 flex flex-col min-h-0 h-full relative"
          >
            {isLockedForGuest ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-12">
                <motion.div 
                  initial={{ scale: 0.8 }} 
                  animate={{ scale: 1 }} 
                  className="bg-red-500 text-white p-8 rounded-[3rem] shadow-2xl border-b-8 border-red-800"
                >
                  <Lock size={80} className="mx-auto mb-6" />
                  <h2 className="text-3xl font-black uppercase italic tracking-tighter mb-4">Metropolis Lockdown</h2>
                  <p className="text-sm font-bold opacity-90 leading-relaxed uppercase tracking-widest max-w-sm mx-auto">
                    You must register an email account to be a permanent mooderia citizen.
                  </p>
                  <button onClick={() => handleLogout()} className="mt-8 px-10 py-5 bg-white text-red-600 rounded-2xl font-black uppercase text-sm shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3 mx-auto">
                    <UserPlus size={20} /> SIGN UP
                  </button>
                </motion.div>
              </div>
            ) : (
              <>
                {activeSection === 'Home' && (
                  <HomeSection 
                    user={currentUser!} 
                    posts={allPosts} 
                    isDarkMode={isDarkMode} 
                    onTriggerMood={() => setShowMoodCheckIn(true)} 
                  />
                )}
                {activeSection === 'CityHall' && (
                  <CityHallSection 
                    isDarkMode={isDarkMode} currentUser={currentUser!} allUsers={allUsers}
                    messages={allMessages} groups={allGroups} onSendMessage={handleSendMessage} 
                    onGroupUpdate={(g) => setAllGroups(prev => prev.map(old => old.id === g.id ? g : old))}
                    onGroupCreate={(g) => setAllGroups(prev => [...prev, g])}
                    onReadMessages={(u) => setAllMessages(prev => prev.map(m => (m.recipient === currentUser!.username && m.sender === u) ? {...m, read: true} : m))} 
                    onNavigateToProfile={(u) => {setViewingUsername(u); setActiveSection('Profile');}} 
                    onReactToMessage={() => {}} 
                    onViolation={() => {}}
                  />
                )}
                {activeSection === 'Mood' && (
                  <MoodSection 
                    isGuest={isGuest} 
                    user={currentUser!} 
                    posts={allPosts} 
                    onPost={handlePost} 
                    onHeart={handleHeart} 
                    onDeletePost={() => {}} 
                    onEditPost={() => {}} 
                    onComment={() => {}} 
                    onCommentInteraction={() => {}} 
                    onRepost={() => {}} 
                    onFollow={() => {}} 
                    onBlock={() => {}} 
                    isDarkMode={isDarkMode} 
                    onNavigateToProfile={() => {}} 
                    onUpdatePet={handleUpdatePet} 
                    onViolation={() => {}} 
                  />
                )}
                {activeSection === 'Zodiac' && <ZodiacSection isDarkMode={isDarkMode} />}
                {activeSection === 'Notifications' && <NotificationsSection notifications={notifications.filter(n => n.recipient === currentUser!.username)} isDarkMode={isDarkMode} onMarkRead={() => {}} />}
                {activeSection === 'Profile' && currentUser && <ProfileSection user={allUsers.find(u => u.username === viewingUsername) || currentUser} allPosts={allPosts} isDarkMode={isDarkMode} currentUser={currentUser} onEditProfile={(dn, un, pp, ti, bp, pc, bi) => { setCurrentUser({...currentUser!, displayName: dn, username: un, profilePic: pp, title: ti, profileColor: pc, bio: bi}); }} />}
                {activeSection === 'Settings' && <SettingsSection isDarkMode={isDarkMode} onToggleDarkMode={() => setIsDarkMode(!isDarkMode)} onLogout={handleLogout} user={currentUser!} onUnblock={() => {}} />}
              </>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default App;

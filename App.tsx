
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mood, Section, Post, Comment, Message, Notification } from './types';
import Sidebar from './components/Sidebar';
import MoodCheckIn from './components/MoodCheckIn';
import HomeSection from './sections/HomeSection';
import MoodSection from './sections/MoodSection';
import ZodiacSection from './sections/ZodiacSection';
import CityHallSection from './sections/CityHallSection';
import ProfileSection from './sections/ProfileSection';
import SettingsSection from './sections/SettingsSection';
import NotificationsSection from './sections/NotificationsSection';
import AuthScreen from './sections/AuthScreen';
import LoadingScreen from './components/LoadingScreen';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeSection, setActiveSection] = useState<Section>('Home');
  const [viewingUsername, setViewingUsername] = useState<string | null>(null);
  const [isMoodModalOpen, setIsMoodModalOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isAppStarting, setIsAppStarting] = useState(true);
  
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [allMessages, setAllMessages] = useState<Message[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('mooderia_user');
    const savedPosts = localStorage.getItem('mooderia_posts') || '[]';
    const savedMessages = localStorage.getItem('mooderia_messages') || '[]';
    const savedNotifications = localStorage.getItem('mooderia_notifications') || '[]';
    const savedTheme = localStorage.getItem('mooderia_theme');
    
    if (savedUser) {
      let user: User = JSON.parse(savedUser);
      // Background Drain Logic for Pet
      const now = Date.now();
      if (user.petLastUpdate) {
        const secondsPassed = Math.floor((now - user.petLastUpdate) / 1000);
        const hungerDrain = Math.floor(secondsPassed / 3600); // 1 per hour
        const thirstDrain = Math.floor(secondsPassed / 1800); // 2 per hour
        const restDrain = Math.floor(secondsPassed / 7200);   // 0.5 per hour

        user.petHunger = Math.max(0, user.petHunger - hungerDrain);
        user.petThirst = Math.max(0, user.petThirst - thirstDrain);
        user.petRest = Math.max(0, user.petRest - restDrain);
      }
      user.petLastUpdate = now;
      setCurrentUser(user);
    }

    setAllPosts(JSON.parse(savedPosts));
    setAllMessages(JSON.parse(savedMessages));
    setNotifications(JSON.parse(savedNotifications));
    if (savedTheme === 'dark') setIsDarkMode(true);
    
    setIsLoaded(true);

    const timer = setTimeout(() => {
      setIsAppStarting(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;

    if (currentUser) {
      localStorage.setItem('mooderia_user', JSON.stringify(currentUser));
      const allUsers: User[] = JSON.parse(localStorage.getItem('mooderia_all_users') || '[]');
      const idx = allUsers.findIndex(u => u.username === currentUser.username);
      if (idx > -1) allUsers[idx] = currentUser;
      else allUsers.push(currentUser);
      localStorage.setItem('mooderia_all_users', JSON.stringify(allUsers));
    }

    localStorage.setItem('mooderia_posts', JSON.stringify(allPosts));
    localStorage.setItem('mooderia_messages', JSON.stringify(allMessages));
    localStorage.setItem('mooderia_notifications', JSON.stringify(notifications));
    localStorage.setItem('mooderia_theme', isDarkMode ? 'dark' : 'light');
  }, [currentUser, allPosts, allMessages, notifications, isDarkMode, isLoaded]);

  const unreadMessages = useMemo(() => 
    allMessages.filter(m => m.recipient === currentUser?.username && !m.read).length, 
    [allMessages, currentUser?.username]
  );

  const unreadNotifs = useMemo(() => 
    notifications.filter(n => !n.read).length, 
    [notifications]
  );

  const visiblePosts = useMemo(() => {
    if (!currentUser) return allPosts;
    return allPosts.filter(p => !currentUser.blockedUsers.includes(p.author));
  }, [allPosts, currentUser?.blockedUsers]);

  const profileToView = useMemo(() => {
    if (!isLoaded) return null;
    const target = viewingUsername || currentUser?.username;
    if (!target) return currentUser;
    
    const allUsers: User[] = JSON.parse(localStorage.getItem('mooderia_all_users') || '[]');
    return allUsers.find(u => u.username === target) || currentUser;
  }, [viewingUsername, currentUser, isLoaded]);

  const navigateToProfile = (username: string) => {
    setViewingUsername(username);
    setActiveSection('Profile');
  };

  const addPost = (content: string) => {
    if (!currentUser) return;
    const newPost: Post = {
      id: Math.random().toString(36).substr(2, 9),
      author: currentUser.username,
      content,
      hearts: 0,
      comments: [],
      timestamp: Date.now()
    };
    setAllPosts(prev => [newPost, ...prev]);
  };

  const toggleHeart = (postId: string) => {
    setAllPosts(prev => prev.map(p => {
      if (p.id === postId) return { ...p, hearts: p.hearts + 1 };
      return p;
    }));
  };

  const addComment = (postId: string, text: string) => {
    if (!currentUser) return;
    const newComment: Comment = {
      id: Math.random().toString(36).substr(2, 9),
      author: currentUser.username,
      text,
      replies: []
    };
    setAllPosts(prev => prev.map(p => {
      if (p.id === postId) return { ...p, comments: [...p.comments, newComment] };
      return p;
    }));
  };

  const handleFollow = (targetUsername: string) => {
    if (!currentUser || targetUsername === currentUser.username) return;
    const allUsers: User[] = JSON.parse(localStorage.getItem('mooderia_all_users') || '[]');
    const targetIdx = allUsers.findIndex(u => u.username === targetUsername);
    if (targetIdx === -1) return;

    const targetUser = allUsers[targetIdx];
    const isFollowing = currentUser.following.includes(targetUsername);

    let updatedCurrentUser: User;
    let updatedTargetUser: User;

    if (isFollowing) {
      updatedCurrentUser = { ...currentUser, following: currentUser.following.filter(u => u !== targetUsername) };
      updatedTargetUser = { ...targetUser, followers: (targetUser.followers || []).filter(u => u !== currentUser.username) };
    } else {
      updatedCurrentUser = { ...currentUser, following: [...currentUser.following, targetUsername] };
      updatedTargetUser = { ...targetUser, followers: [...(targetUser.followers || []), currentUser.username] };
    }

    setCurrentUser(updatedCurrentUser);
    allUsers[targetIdx] = updatedTargetUser;
    localStorage.setItem('mooderia_all_users', JSON.stringify(allUsers));
  };

  const handleBlockUser = (username: string) => {
    if (!currentUser) return;
    const updated = {
      ...currentUser,
      blockedUsers: [...new Set([...currentUser.blockedUsers, username])],
      following: currentUser.following.filter(u => u !== username)
    };
    setCurrentUser(updated);
    setActiveSection('Home');
  };

  const handleUnblockUser = (username: string) => {
    if (!currentUser) return;
    setCurrentUser({
      ...currentUser,
      blockedUsers: currentUser.blockedUsers.filter(u => u !== username)
    });
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('mooderia_user');
    setActiveSection('Home');
    setViewingUsername(null);
  };

  const submitMood = (mood: Mood) => {
    if (!currentUser) return;
    const today = new Date().toDateString();
    const updatedUser = {
      ...currentUser,
      moodStreak: (currentUser.moodStreak || 0) + 1,
      lastMoodDate: today,
      moodHistory: [...currentUser.moodHistory, { date: today, mood }]
    };
    setCurrentUser(updatedUser);
    setIsMoodModalOpen(false);
  };

  const sendMessage = (recipient: string, text: string) => {
    if (!currentUser) return;
    const newMessage: Message = {
      id: Math.random().toString(36).substr(2, 9),
      sender: currentUser.username,
      recipient,
      text,
      timestamp: Date.now(),
      read: false
    };
    setAllMessages(prev => [...prev, newMessage]);
  };

  const updatePetStats = (hunger: number, thirst: number, rest: number, coins: number, sleepUntil: number | null = null) => {
    if (!currentUser) return;
    setCurrentUser({
      ...currentUser,
      petHunger: Math.min(100, Math.max(0, currentUser.petHunger + hunger)),
      petThirst: Math.min(100, Math.max(0, currentUser.petThirst + thirst)),
      petRest: Math.min(100, Math.max(0, currentUser.petRest + rest)),
      moodCoins: currentUser.moodCoins + coins,
      petSleepUntil: sleepUntil,
      petLastUpdate: Date.now()
    });
  };

  if (isAppStarting) return <LoadingScreen />;

  if (!currentUser) {
    return <AuthScreen onLogin={(user) => { 
      setCurrentUser(user); 
      if (user.lastMoodDate !== new Date().toDateString()) setIsMoodModalOpen(true); 
    }} />;
  }

  return (
    <div className={`h-screen max-h-screen overflow-hidden flex flex-col md:flex-row ${isDarkMode ? 'bg-slate-900 text-white' : 'bg-gray-50 text-slate-900'} transition-colors duration-300`}>
      <AnimatePresence>
        {isMoodModalOpen && <MoodCheckIn onSubmit={submitMood} isDarkMode={isDarkMode} />}
      </AnimatePresence>

      <Sidebar 
        activeSection={activeSection} 
        onNavigate={(s) => { setActiveSection(s); if(s === 'Profile') setViewingUsername(currentUser.username); }} 
        isDarkMode={isDarkMode}
        user={currentUser}
        unreadMessages={unreadMessages}
        unreadNotifications={unreadNotifs}
      />

      <main className="flex-1 flex flex-col relative pt-16 pb-20 md:pt-0 md:pb-0 h-full overflow-hidden">
        <div className="flex-1 overflow-hidden p-4 md:p-8">
          <motion.div
            key={activeSection + (activeSection === 'Profile' ? viewingUsername : '')}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="h-full max-w-5xl mx-auto flex flex-col"
          >
            {activeSection === 'Home' && <div className="h-full overflow-y-auto custom-scrollbar pr-2"><HomeSection user={currentUser} posts={visiblePosts} isDarkMode={isDarkMode} /></div>}
            {activeSection === 'Mood' && (
              <MoodSection 
                user={currentUser} posts={visiblePosts} onPost={addPost} onHeart={toggleHeart} 
                onComment={addComment} onRepost={(p) => setAllPosts([ { ...p, id: Math.random().toString(36).substr(2, 9), author: currentUser.username, isRepost: true, originalAuthor: p.author, timestamp: Date.now() }, ...allPosts])} 
                onFollow={handleFollow} onBlock={handleBlockUser} isDarkMode={isDarkMode} 
                onNavigateToProfile={navigateToProfile}
                onUpdatePet={updatePetStats}
              />
            )}
            {activeSection === 'Zodiac' && <div className="h-full overflow-y-auto custom-scrollbar pr-2"><ZodiacSection isDarkMode={isDarkMode} /></div>}
            {activeSection === 'CityHall' && (
              <CityHallSection 
                isDarkMode={isDarkMode} currentUser={currentUser} messages={allMessages} 
                onSendMessage={sendMessage} onReadMessages={(u) => setAllMessages(allMessages.map(m => (m.recipient === currentUser.username && m.sender === u) ? {...m, read: true} : m))} 
                onNavigateToProfile={navigateToProfile} 
              />
            )}
            {activeSection === 'Notifications' && <div className="h-full overflow-y-auto custom-scrollbar pr-2"><NotificationsSection notifications={notifications} isDarkMode={isDarkMode} onMarkRead={() => setNotifications(notifications.map(n => ({...n, read: true})))} /></div>}
            {activeSection === 'Profile' && profileToView && (
              <ProfileSection 
                user={profileToView} allPosts={allPosts} isDarkMode={isDarkMode} 
                onEditProfile={(dn, un, pp, t, bp, pc) => setCurrentUser({...currentUser, displayName: dn, username: un, profilePic: pp, title: t, bannerPic: bp, profileColor: pc})} 
                onBlock={handleBlockUser} onFollow={handleFollow} currentUser={currentUser}
              />
            )}
            {activeSection === 'Settings' && <div className="h-full overflow-y-auto custom-scrollbar pr-2"><SettingsSection isDarkMode={isDarkMode} onToggleDarkMode={() => setIsDarkMode(!isDarkMode)} onLogout={handleLogout} user={currentUser} onUnblock={handleUnblockUser} /></div>}
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default App;

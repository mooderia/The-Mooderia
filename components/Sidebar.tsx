
import React from 'react';
import { Home, Smile, Moon, Building2, User, Settings, Bell, LucideProps } from 'lucide-react';
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
  const items: { id: Section, icon: React.ReactElement<LucideProps>, color: string, label: string }[] = [
    { id: 'Home', icon: <Home />, color: 'kahoot-button-purple', label: 'Home' },
    { id: 'Mood', icon: <Smile />, color: 'kahoot-button-blue', label: 'Mood' },
    { id: 'Zodiac', icon: <Moon />, color: 'kahoot-button-green', label: 'Zodiac' },
    { id: 'CityHall', icon: <Building2 />, color: 'kahoot-button-red', label: 'City' },
    { id: 'Notifications', icon: <Bell />, color: 'kahoot-button-yellow', label: 'Alerts' },
    { id: 'Profile', icon: <User />, color: 'bg-indigo-500', label: 'Profile' },
    { id: 'Settings', icon: <Settings />, color: 'bg-gray-400', label: 'Settings' },
  ];

  return (
    <>
      {/* Mobile Top Header */}
      <div className={`md:hidden fixed top-0 left-0 right-0 z-50 px-6 py-4 flex justify-between items-center ${isDarkMode ? 'bg-slate-900/80' : 'bg-white/80'} backdrop-blur-md border-b ${isDarkMode ? 'border-slate-800' : 'border-gray-100'}`}>
        <h1 className="text-xl font-black tracking-tighter text-[#46178f] italic">MOODERIA</h1>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-white text-[10px] font-black overflow-hidden shadow-sm">
            {user.profilePic ? <img src={user.profilePic} alt="Me" className="w-full h-full object-cover" /> : user.displayName[0]}
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className={`md:hidden fixed bottom-0 left-0 right-0 z-50 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'} border-t px-2 pb-safe-area-inset-bottom`}>
        <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
          {items.map(item => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`relative flex flex-col items-center justify-center gap-1 transition-all flex-1 py-1 rounded-xl ${activeSection === item.id ? 'text-[#46178f] scale-110' : 'text-gray-400 opacity-60'}`}
            >
              {React.cloneElement(item.icon, { size: activeSection === item.id ? 24 : 20 })}
              {item.id === 'CityHall' && unreadMessages > 0 && (
                <span className="absolute top-1 right-3 w-4 h-4 bg-[#e21b3c] text-white text-[10px] font-black rounded-full flex items-center justify-center ring-2 ring-white dark:ring-slate-900">{unreadMessages}</span>
              )}
              {item.id === 'Notifications' && unreadNotifications > 0 && (
                <span className="absolute top-1 right-3 w-4 h-4 bg-[#e21b3c] text-white text-[10px] font-black rounded-full flex items-center justify-center ring-2 ring-white dark:ring-slate-900">{unreadNotifications}</span>
              )}
              <span className="text-[10px] font-black uppercase tracking-tighter">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Desktop Sidebar */}
      <aside className={`hidden md:flex flex-col w-64 p-6 h-screen sticky top-0 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200 text-slate-900'} border-r`}>
        <div className="mb-10">
          <h1 className={`text-3xl font-black italic ${isDarkMode ? 'text-purple-400' : 'text-[#46178f]'}`}>MOODERIA</h1>
          <p className="text-xs font-semibold opacity-50 tracking-widest mt-1 uppercase">Vibrant Metropolis</p>
        </div>

        <nav className="flex-1 space-y-4">
          {items.map(item => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`kahoot-button w-full relative flex items-center gap-4 p-4 rounded-xl text-white font-bold transition-transform ${item.color} ${activeSection === item.id ? 'scale-105' : 'opacity-80 hover:opacity-100'}`}
            >
              {item.icon}
              {item.id === 'CityHall' && unreadMessages > 0 && (
                <span className="absolute -top-2 -right-2 w-6 h-6 bg-[#e21b3c] text-white text-xs font-black rounded-full flex items-center justify-center border-2 border-white dark:border-slate-800 shadow-md">{unreadMessages}</span>
              )}
              {item.id === 'Notifications' && unreadNotifications > 0 && (
                <span className="absolute -top-2 -right-2 w-6 h-6 bg-[#e21b3c] text-white text-xs font-black rounded-full flex items-center justify-center border-2 border-white dark:border-slate-800 shadow-md">{unreadNotifications}</span>
              )}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="mt-auto pt-6 border-t border-gray-100 dark:border-slate-700">
           <div className="flex items-center gap-3">
             <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 shadow-md flex items-center justify-center text-white font-black overflow-hidden">
               {user.profilePic ? <img src={user.profilePic} alt="Avatar" className="w-full h-full object-cover" /> : user.displayName[0]}
             </div>
             <div className={`${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
               <p className="font-bold text-sm truncate max-w-[120px]">{user.displayName}</p>
               <p className="text-[8px] opacity-60 font-black uppercase italic tracking-widest">{user.title || 'Citizen'}</p>
             </div>
           </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

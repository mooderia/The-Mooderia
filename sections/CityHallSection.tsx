
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Users, Search, MessageSquare, ArrowLeft, ShieldCheck, UserPlus } from 'lucide-react';
import { User, Message } from '../types';

interface CityHallSectionProps {
  isDarkMode: boolean;
  currentUser: User;
  messages: Message[];
  onSendMessage: (recipient: string, text: string) => void;
  onReadMessages: (withUsername: string) => void;
  onNavigateToProfile: (username: string) => void;
}

const CityHallSection: React.FC<CityHallSectionProps> = ({ isDarkMode, currentUser, messages, onSendMessage, onReadMessages, onNavigateToProfile }) => {
  const [input, setInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCitizen, setSelectedCitizen] = useState<User | null>(null);

  const allUsers: User[] = useMemo(() => JSON.parse(localStorage.getItem('mooderia_all_users') || '[]'), []);

  const filteredCitizens = useMemo(() => {
    if (!searchTerm.trim()) return [];
    return allUsers.filter(u => 
      u.username !== currentUser.username && 
      !currentUser.blockedUsers.includes(u.username) &&
      (u.displayName.toLowerCase().includes(searchTerm.toLowerCase()) || 
       u.username.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [searchTerm, allUsers, currentUser.username, currentUser.blockedUsers]);

  const conversationUsers = useMemo(() => {
    const userNames = new Set<string>();
    messages.forEach(m => {
      if (m.sender === currentUser.username) userNames.add(m.recipient);
      if (m.recipient === currentUser.username) userNames.add(m.sender);
    });
    return allUsers.filter(u => userNames.has(u.username) && !currentUser.blockedUsers.includes(u.username));
  }, [messages, allUsers, currentUser.username, currentUser.blockedUsers]);

  const chatMessages = useMemo(() => {
    if (!selectedCitizen) return [];
    return messages.filter(m => 
      (m.sender === currentUser.username && m.recipient === selectedCitizen.username) ||
      (m.sender === selectedCitizen.username && m.recipient === currentUser.username)
    ).sort((a, b) => a.timestamp - b.timestamp);
  }, [messages, selectedCitizen, currentUser.username]);

  const unreadPerUser = useMemo(() => {
    const counts: Record<string, number> = {};
    messages.forEach(m => {
      if (m.recipient === currentUser.username && !m.read) {
        counts[m.sender] = (counts[m.sender] || 0) + 1;
      }
    });
    return counts;
  }, [messages, currentUser.username]);

  useEffect(() => {
    if (selectedCitizen) onReadMessages(selectedCitizen.username);
  }, [selectedCitizen, messages.length]);

  return (
    <div className="flex flex-col h-full overflow-hidden gap-4">
      <div className="flex justify-between items-center px-2 shrink-0">
        <h2 className={`text-2xl md:text-3xl font-black italic uppercase tracking-tighter ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Citizen Hub</h2>
      </div>

      <div className={`flex-1 flex flex-col md:flex-row rounded-[2.5rem] ${isDarkMode ? 'bg-slate-800' : 'bg-white'} shadow-2xl overflow-hidden border-4 border-gray-100 dark:border-slate-700 min-h-0`}>
        <div className={`w-full md:w-72 lg:w-80 border-r ${isDarkMode ? 'border-slate-700' : 'border-gray-100'} flex flex-col ${selectedCitizen ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-4 border-b border-gray-100 dark:border-slate-700 shrink-0">
            <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search Citizens..." className={`w-full px-4 py-3 rounded-xl text-xs font-bold border-2 outline-none focus:border-blue-500 ${isDarkMode ? 'bg-slate-700 border-slate-600' : 'bg-gray-50 border-gray-200'}`} />
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
            {(searchTerm.trim() ? filteredCitizens : conversationUsers).map(u => (
              <button key={u.username} onClick={() => setSelectedCitizen(u)} className={`w-full p-3 rounded-xl flex items-center gap-3 transition-all ${selectedCitizen?.username === u.username ? 'bg-blue-600 text-white shadow-lg' : 'hover:bg-gray-50 dark:hover:bg-slate-700'}`}>
                <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-slate-600 flex items-center justify-center font-black overflow-hidden shadow-sm shrink-0">{u.profilePic ? <img src={u.profilePic} className="w-full h-full object-cover" /> : u.displayName[0].toUpperCase()}</div>
                <div className="text-left truncate flex-1"><p className="font-black text-xs truncate">{u.displayName}</p><p className={`text-[9px] font-bold ${selectedCitizen?.username === u.username ? 'text-white/60' : 'opacity-40'}`}>@{u.username}</p></div>
                {unreadPerUser[u.username] > 0 && selectedCitizen?.username !== u.username && <span className="w-5 h-5 bg-red-500 rounded-full text-[9px] flex items-center justify-center text-white font-black border-2 border-white">{unreadPerUser[u.username]}</span>}
              </button>
            ))}
          </div>
        </div>

        <div className={`flex-1 flex flex-col min-h-0 ${!selectedCitizen ? 'hidden md:flex' : 'flex'}`}>
          <div className={`p-4 border-b ${isDarkMode ? 'bg-slate-700/50 border-slate-700' : 'bg-gray-50 border-gray-100'} flex items-center justify-between shrink-0`}>
             {selectedCitizen && (
               <div className="flex items-center gap-4">
                 <button onClick={() => setSelectedCitizen(null)} className="md:hidden p-2 rounded-xl hover:bg-gray-200"><ArrowLeft size={20} /></button>
                 <button onClick={() => onNavigateToProfile(selectedCitizen.username)} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                    <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center text-white font-black overflow-hidden">{selectedCitizen.profilePic ? <img src={selectedCitizen.profilePic} className="w-full h-full object-cover" /> : selectedCitizen.displayName[0]}</div>
                    <div className="text-left"><h3 className="font-black uppercase text-xs">@{selectedCitizen.username}</h3><p className="text-[8px] font-black text-blue-500 uppercase">View ID</p></div>
                 </button>
               </div>
             )}
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
            {chatMessages.length > 0 ? chatMessages.map(msg => (
              <div key={msg.id} className={`flex ${msg.sender === currentUser.username ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3.5 rounded-[1.2rem] text-xs font-bold shadow-sm ${msg.sender === currentUser.username ? 'bg-[#1368ce] text-white rounded-tr-none' : 'bg-gray-100 dark:bg-slate-700 text-slate-800 dark:text-white rounded-tl-none'}`}>
                  {msg.text}
                </div>
              </div>
            )) : <div className="h-full flex items-center justify-center opacity-20 italic font-black text-xs uppercase">No transmissions found</div>}
          </div>
          {selectedCitizen && (
            <div className={`p-4 border-t ${isDarkMode ? 'border-slate-700 bg-slate-800' : 'border-gray-100 bg-white'} shrink-0`}>
              <div className="flex gap-2">
                <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (onSendMessage(selectedCitizen.username, input), setInput(''))} placeholder="Type a message..." className={`flex-1 p-3 rounded-xl border-2 outline-none text-xs font-bold ${isDarkMode ? 'bg-slate-700 border-slate-600' : 'bg-gray-50 border-gray-100'}`} />
                <button onClick={() => { onSendMessage(selectedCitizen.username, input); setInput(''); }} className="p-3 rounded-xl bg-blue-600 text-white shadow-lg shrink-0"><Send size={18} /></button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CityHallSection;

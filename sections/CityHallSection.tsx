
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Users, Search, MessageSquare, ArrowLeft, ShieldCheck, Check, CheckCheck, Clock, Smile, Plus, X, Reply, Radio, Rocket, MessageCircle, Star, Ghost, Zap, Coffee, Music, Palette, WifiOff, Lock } from 'lucide-react';
import { User, Message, MessageReaction, Group } from '../types';

interface CityHallSectionProps {
  isDarkMode: boolean;
  currentUser: User;
  allUsers: User[];
  messages: Message[];
  groups: Group[];
  onSendMessage: (recipient: string, text: string, options?: { isGroup?: boolean, recipients?: string[], groupName?: string, replyToId?: string, replyToText?: string, replyToSender?: string, isSystem?: boolean, liaisonData?: any }) => void;
  onReadMessages: (withUsername: string) => void;
  onGroupUpdate: (group: Group) => void;
  onGroupCreate: (group: Group) => void;
  onNavigateToProfile: (username: string) => void;
  onReactToMessage: (msgId: string, emoji: string) => void;
  onViolation: (reason: string) => void;
  isOffline?: boolean;
}

const GROUP_ICONS = ['🚀', '💬', '✨', '👻', '⚡', '☕', '🎵', '🎨', '🔥', '🌈', '🛸', '🛡️'];

const CityHallSection: React.FC<CityHallSectionProps> = ({ isDarkMode, currentUser, allUsers, messages, groups, onSendMessage, onReadMessages, onGroupUpdate, onGroupCreate, onNavigateToProfile, onReactToMessage, onViolation, isOffline = false }) => {
  const [input, setInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCitizen, setSelectedCitizen] = useState<{ username: string, isGroup?: boolean } | null>(null);
  const [isSending, setIsSending] = useState(false);
  
  // Group creation state
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [selectedGroupIcon, setSelectedGroupIcon] = useState('🚀');
  const [selectedForGroup, setSelectedForGroup] = useState<string[]>([]);
  const [userSearchTerm, setUserSearchTerm] = useState('');
  
  const chatScrollRef = useRef<HTMLDivElement>(null);

  const getUserByUsername = (username: string) => allUsers.find(u => u.username === username);
  const getGroupById = (id: string) => groups.find(g => g.id === id);

  const chats = useMemo(() => {
    const list: any[] = [];
    const processedDms = new Set<string>();

    groups.forEach(g => {
      if (g.members.includes(currentUser.username)) {
        list.push({ username: g.id, displayName: g.name, isGroup: true, profilePic: g.photo || '🚀' });
      }
    });

    messages.forEach(m => {
      if (!m.isGroup) {
        const other = m.sender === currentUser.username ? m.recipient : m.sender;
        if (!processedDms.has(other)) {
          processedDms.add(other);
          const userObj = getUserByUsername(other);
          if (userObj) {
            list.push({ username: other, displayName: userObj.displayName, profilePic: userObj.profilePic, isGroup: false });
          }
        }
      }
    });
    return list;
  }, [messages, allUsers, currentUser.username, groups]);

  const activeChatInfo = useMemo(() => {
    if (!selectedCitizen) return null;
    if (selectedCitizen.isGroup) {
      const g = getGroupById(selectedCitizen.username);
      return { username: selectedCitizen.username, displayName: g?.name || 'Group', profilePic: g?.photo || '🚀', isGroup: true, recipients: g?.members };
    } else {
      const u = getUserByUsername(selectedCitizen.username);
      return { username: selectedCitizen.username, displayName: u?.displayName || selectedCitizen.username, profilePic: u?.profilePic, isGroup: false };
    }
  }, [selectedCitizen, allUsers, groups]);

  const chatMessages = useMemo(() => {
    if (!selectedCitizen) return [];
    if (selectedCitizen.isGroup) return messages.filter(m => m.isGroup && m.recipient === selectedCitizen.username).sort((a, b) => a.timestamp - b.timestamp);
    return messages.filter(m => !m.isGroup && ((m.sender === currentUser.username && m.recipient === selectedCitizen.username) || (m.sender === selectedCitizen.username && m.recipient === currentUser.username))).sort((a, b) => a.timestamp - b.timestamp);
  }, [messages, selectedCitizen, currentUser.username]);

  useEffect(() => {
    if (selectedCitizen && !selectedCitizen.isGroup) onReadMessages(selectedCitizen.username);
    setTimeout(() => { chatScrollRef.current?.scrollTo({ top: chatScrollRef.current.scrollHeight, behavior: 'smooth' }); }, 100);
  }, [selectedCitizen?.username]);

  const handleSend = async () => {
    if (!input.trim() || !activeChatInfo || isSending || isOffline) return;
    setIsSending(true);
    onSendMessage(activeChatInfo.username, input, { isGroup: activeChatInfo.isGroup, recipients: activeChatInfo.recipients, groupName: activeChatInfo.displayName });
    setInput('');
    setIsSending(false);
  };

  const handleCreateGroup = () => {
    if (!groupName.trim() || selectedForGroup.length < 2 || isOffline) return;
    const groupId = 'group_' + Math.random().toString(36).substr(2, 9);
    const members = [...selectedForGroup, currentUser.username];
    const newGroup: Group = { id: groupId, name: groupName, owner: currentUser.username, members: members, nicknames: {}, createdAt: Date.now(), photo: selectedGroupIcon };
    onGroupCreate(newGroup);
    onSendMessage(groupId, `SYSTEM: Citizen network online. Members: ${members.join(', ')}.`, { isGroup: true, recipients: members, groupName, isSystem: true });
    setSelectedCitizen({ username: groupId, isGroup: true });
    setIsCreatingGroup(false);
    setGroupName('');
    setSelectedForGroup([]);
  };

  const filteredUsers = allUsers.filter(u => u.username !== currentUser.username && (u.username.toLowerCase().includes(userSearchTerm.toLowerCase()) || u.displayName.toLowerCase().includes(userSearchTerm.toLowerCase())));

  const isReadyToCreate = groupName.trim().length > 0 && selectedForGroup.length >= 2;

  return (
    <div className="flex flex-col h-full min-h-0 w-full relative">
      <div className="flex justify-between items-center mb-6 shrink-0 px-2">
        <h2 className={`text-3xl md:text-4xl font-black italic uppercase tracking-tighter ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Citizen Hub</h2>
        <button disabled={isOffline} onClick={() => setIsCreatingGroup(true)} className="kahoot-button-blue px-6 py-3 rounded-2xl text-white font-black flex items-center gap-2 shadow-lg active:scale-95 text-xs disabled:opacity-50 disabled:grayscale">
          <Plus size={18} /> <span>NEW GROUP</span>
        </button>
      </div>

      <div className={`flex-1 flex flex-col md:flex-row rounded-[3rem] ${isDarkMode ? 'bg-slate-900' : 'bg-white'} shadow-2xl overflow-hidden border-4 border-black/5 relative min-h-0 h-full`}>
        {isOffline && (
           <div className="absolute inset-0 z-[80] bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center text-center p-12">
              <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="bg-red-500 text-white p-8 rounded-[3rem] shadow-2xl border-b-8 border-red-800">
                <WifiOff size={60} className="mx-auto mb-4" />
                <h3 className="text-2xl font-black uppercase italic tracking-tighter mb-2">Neural Connection Lost</h3>
                <p className="text-[10px] font-bold opacity-80 uppercase tracking-widest max-w-xs mx-auto">
                   Real-time communication requires an active Metropolis uplink.
                </p>
              </motion.div>
           </div>
        )}

        {/* Sidebar */}
        <div className={`w-full md:w-64 lg:w-80 border-r ${isDarkMode ? 'border-slate-800' : 'border-gray-100'} flex flex-col ${selectedCitizen ? 'hidden md:flex' : 'flex'} min-h-0 h-full`}>
          <div className="p-4 border-b border-gray-100 dark:border-slate-800 shrink-0">
            <div className="relative">
              <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search real citizens..." className={`w-full pl-10 pr-4 py-3 rounded-2xl text-[12px] font-black border-2 outline-none focus:border-blue-500 transition-all ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-gray-50 border-gray-200'}`} />
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 opacity-30" size={16} />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto fading-scrollbar p-3 space-y-2 min-h-0 h-full">
            {chats.filter(c => c.displayName.toLowerCase().includes(searchTerm.toLowerCase())).map(chat => (
              <button key={chat.username} onClick={() => setSelectedCitizen({ username: chat.username, isGroup: chat.isGroup })} className={`w-full p-4 rounded-[1.5rem] flex items-center gap-3 transition-all border-b-4 active:translate-y-0.5 active:border-b-2 ${selectedCitizen?.username === chat.username ? 'bg-blue-600 border-blue-800 text-white shadow-md' : 'hover:bg-black/5'}`}>
                <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-slate-700 flex items-center justify-center font-black overflow-hidden shadow-sm shrink-0">
                  {chat.isGroup ? <span className="text-xl">{chat.profilePic}</span> : (chat.profilePic ? <img src={chat.profilePic} className="w-full h-full object-cover" /> : chat.displayName[0])}
                </div>
                <div className="text-left flex-1 min-w-0">
                  <p className="font-black text-[12px] truncate uppercase tracking-tight">{chat.displayName}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Message Window Area */}
        <div className={`flex-1 flex flex-col min-h-0 h-full ${!selectedCitizen ? 'hidden md:flex' : 'flex'}`}>
          {activeChatInfo ? (
            <>
              <div className={`p-4 border-b ${isDarkMode ? 'bg-slate-800/50 border-slate-800' : 'bg-gray-50/50 border-gray-100'} flex items-center justify-between shrink-0`}>
                <div className="flex items-center gap-4">
                  <button onClick={() => setSelectedCitizen(null)} className="md:hidden p-2 text-custom"><ArrowLeft size={24} /></button>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black shadow-lg overflow-hidden border-2 border-white/20">
                      {activeChatInfo.isGroup ? <span className="text-xl">{activeChatInfo.profilePic}</span> : (activeChatInfo.profilePic ? <img src={activeChatInfo.profilePic} className="w-full h-full object-cover" /> : activeChatInfo.displayName[0])}
                    </div>
                    <div>
                      <p className="font-black text-sm uppercase italic tracking-tighter">{activeChatInfo.displayName}</p>
                      <p className="text-[10px] font-black uppercase tracking-widest opacity-30">@{activeChatInfo.username}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div ref={chatScrollRef} className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 fading-scrollbar min-h-0 h-full">
                {chatMessages.map(m => {
                  const isMe = m.sender === currentUser.username;
                  return (
                    <div key={m.id} className={`flex ${isMe ? 'flex-row-reverse' : 'flex-row'} items-end gap-3`}>
                      <div className={`max-w-[80%] flex flex-col ${isMe ? 'items-end' : 'items-start'} gap-1`}>
                        <div className={`px-5 py-3 rounded-[1.5rem] font-bold text-sm border-b-4 ${isMe ? 'bg-blue-600 border-blue-800 text-white rounded-tr-none' : 'bg-white border-gray-200 rounded-tl-none'}`}>
                          <p className="break-words max-w-md whitespace-pre-wrap">{m.text}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="p-4 md:p-6 shrink-0">
                <div className={`flex items-center gap-3 p-2 rounded-[2rem] border-4 transition-all ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-gray-50 border-gray-200'} focus-within:border-blue-500 shadow-inner`}>
                  <input disabled={isOffline} type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSend()} placeholder={isOffline ? "Uplink Lost..." : "Transmit message..."} className="flex-1 bg-transparent px-5 py-3 font-black text-sm outline-none disabled:opacity-50" />
                  <button onClick={handleSend} disabled={isSending || !input.trim() || isOffline} className="kahoot-button-blue p-4 rounded-2xl text-white shadow-xl active:scale-95 disabled:opacity-50"><Send size={20} /></button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center opacity-20 h-full">
              <Radio size={80} className="mb-6 animate-pulse" />
              <p className="text-xs font-black uppercase tracking-widest">Select a channel to communicate</p>
            </div>
          )}
        </div>
      </div>

      {/* NEW GROUP MODAL */}
      <AnimatePresence>
        {isCreatingGroup && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-black/90 backdrop-blur-md">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className={`${isDarkMode ? 'bg-slate-900 border-white/10' : 'bg-white border-black/5'} w-full max-w-xl rounded-[3rem] p-6 md:p-10 border-4 shadow-2xl flex flex-col max-h-[90vh]`}>
              <div className="flex justify-between items-center mb-6"><h3 className="text-2xl font-black uppercase italic">Setup Neural Network</h3><button onClick={() => setIsCreatingGroup(false)} className="opacity-40"><X size={28}/></button></div>
              
              <div className="space-y-6 overflow-y-auto fading-scrollbar pr-2">
                 <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-2">1. Network Alias (Name)</p>
                    <input type="text" value={groupName} onChange={e => setGroupName(e.target.value)} placeholder="Designation..." className="w-full p-4 rounded-2xl border-2 bg-black/5 font-black text-lg outline-none focus:border-custom" />
                 </div>

                 <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-2">2. Visual ID (Icon)</p>
                    <div className="grid grid-cols-6 gap-2 p-3 bg-black/5 rounded-2xl">
                       {GROUP_ICONS.map(icon => (
                         <button key={icon} onClick={() => setSelectedGroupIcon(icon)} className={`text-2xl p-2 rounded-xl border-2 transition-all ${selectedGroupIcon === icon ? 'bg-custom/10 border-custom scale-110 shadow-sm' : 'border-transparent opacity-40'}`}>{icon}</button>
                       ))}
                    </div>
                 </div>

                 <div className="space-y-2">
                    <div className="flex justify-between items-center px-2">
                      <p className="text-[10px] font-black uppercase tracking-widest opacity-40">3. Search & Add Citizens (Min. 2)</p>
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${selectedForGroup.length >= 2 ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>{selectedForGroup.length} Selected</span>
                    </div>
                    <div className="relative">
                      <input type="text" value={userSearchTerm} onChange={e => setUserSearchTerm(e.target.value)} placeholder="Search ID..." className="w-full pl-10 pr-4 py-3 rounded-xl border-2 bg-black/5 text-sm font-bold outline-none focus:border-custom" />
                      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 opacity-30" size={16} />
                    </div>
                    <div className="max-h-40 overflow-y-auto fading-scrollbar p-2 space-y-2 bg-black/5 rounded-2xl">
                        {filteredUsers.map(u => (
                          <button key={u.username} onClick={() => setSelectedForGroup(prev => prev.includes(u.username) ? prev.filter(x => x !== u.username) : [...prev, u.username])} className={`w-full p-3 rounded-xl flex items-center gap-3 transition-all ${selectedForGroup.includes(u.username) ? 'bg-blue-600 text-white' : 'hover:bg-black/5'}`}>
                            <div className="w-8 h-8 rounded-lg bg-custom text-white font-black flex items-center justify-center italic text-xs shrink-0 overflow-hidden">{u.profilePic ? <img src={u.profilePic} className="w-full h-full object-cover" /> : u.displayName[0]}</div>
                            <p className="text-[12px] font-black flex-1 text-left uppercase tracking-tight truncate">{u.displayName}</p>
                            {selectedForGroup.includes(u.username) && <Check size={16}/>}
                          </button>
                        ))}
                        {filteredUsers.length === 0 && <p className="text-[10px] uppercase font-black opacity-20 text-center py-4">No citizens found</p>}
                    </div>
                 </div>

                 <button onClick={handleCreateGroup} disabled={!isReadyToCreate || isOffline} className="kahoot-button-blue w-full py-5 rounded-2xl text-white font-black uppercase text-sm shadow-xl active:scale-95 disabled:opacity-40 mt-4 transition-all">
                   {isOffline ? "UPLINK REQUIRED" : (!groupName.trim() ? "NAME REQUIRED" : (selectedForGroup.length < 2 ? `ADD ${2 - selectedForGroup.length} MORE USERS` : "ESTABLISH LINK"))}
                 </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CityHallSection;

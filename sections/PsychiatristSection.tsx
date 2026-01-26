
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Stethoscope, Sparkles, Brain, Clock, ShieldCheck, Info } from 'lucide-react';
import { User, Message } from '../types';
import { getPsychiatristResponse } from '../services/geminiService';

interface PsychiatristSectionProps {
  currentUser: User;
  isDarkMode: boolean;
  messages: Message[];
  onSendMessage: (text: string) => void;
}

const PsychiatristSection: React.FC<PsychiatristSectionProps> = ({ currentUser, isDarkMode, messages, onSendMessage }) => {
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const sessionMessages = messages.filter(m => 
    (m.sender === currentUser.username && m.recipient === 'DrPinel') ||
    (m.sender === 'DrPinel' && m.recipient === currentUser.username)
  ).sort((a, b) => a.timestamp - b.timestamp);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [sessionMessages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;
    const text = input.trim();
    setInput('');
    onSendMessage(text);
    setIsTyping(true);
    
    // Simulate thinking delay then call API
    const response = await getPsychiatristResponse(text);
    
    // Send back to the main App state
    const aiMessage: Message = {
      id: Math.random().toString(36).substr(2, 9),
      sender: 'DrPinel',
      recipient: currentUser.username,
      text: response.text,
      timestamp: Date.now(),
      read: false
    };
    
    // We dispatch this via a custom event or let the App handle it. 
    // In this simplified model, we'll manually trigger it in the parent.
    window.dispatchEvent(new CustomEvent('ai-response', { detail: aiMessage }));
    setIsTyping(false);
  };

  const formatTime = (ts: number) => new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="flex flex-col h-full min-h-0 w-full">
      <div className="flex items-center justify-between mb-6 px-2 shrink-0">
        <div className="flex flex-col">
          <h2 className={`text-3xl md:text-4xl font-black italic uppercase tracking-tighter ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Neural Therapy</h2>
          <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Session with Dr. Philippe Pinel</p>
        </div>
        <div className="bg-blue-500/10 text-blue-500 px-4 py-2 rounded-2xl border-2 border-blue-500/20 flex items-center gap-2">
          <ShieldCheck size={18} />
          <span className="text-[10px] font-black uppercase">Secure Link</span>
        </div>
      </div>

      <div className={`flex-1 flex flex-col rounded-[3rem] ${isDarkMode ? 'bg-slate-900' : 'bg-white'} border-4 border-black/5 shadow-2xl overflow-hidden min-h-0 h-full`}>
        {/* Header Information */}
        <div className="p-6 border-b border-black/5 flex items-center gap-4 shrink-0 bg-blue-50/50 dark:bg-slate-800/50">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg border-2 border-white/20">
            <Stethoscope size={24} />
          </div>
          <div className="flex-1">
            <p className="font-black text-sm uppercase italic">Chief Medical District</p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <p className="text-[10px] font-black opacity-40 uppercase tracking-widest">Always Online • Neural Synchrony Active</p>
            </div>
          </div>
        </div>

        {/* Scrollable Conversation */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 fading-scrollbar bg-slate-50/20 dark:bg-slate-900/10">
          {sessionMessages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-20 p-10">
              <Brain size={80} className="mb-4" />
              <h3 className="text-xl font-black uppercase italic">Neural Bridge Ready</h3>
              <p className="text-xs font-bold mt-2">"Welcome to the Medical District. How are your frequencies today?"</p>
            </div>
          ) : (
            sessionMessages.map(m => {
              const isMe = m.sender === currentUser.username;
              return (
                <div key={m.id} className={`flex ${isMe ? 'flex-row-reverse' : 'flex-row'} items-end gap-3`}>
                  <div className={`max-w-[85%] flex flex-col ${isMe ? 'items-end' : 'items-start'} gap-1`}>
                    <div className={`px-5 py-3 rounded-[1.5rem] font-bold text-sm border-b-4 ${isMe ? 'bg-blue-600 border-blue-800 text-white rounded-tr-none' : isDarkMode ? 'bg-slate-800 border-slate-900 text-white rounded-tl-none' : 'bg-white border-gray-200 text-slate-800 rounded-tl-none shadow-sm'}`}>
                      <p className="whitespace-pre-wrap leading-relaxed">{m.text}</p>
                    </div>
                    <p className="text-[9px] font-black uppercase opacity-20 tracking-tighter px-1">{formatTime(m.timestamp)}</p>
                  </div>
                </div>
              );
            })
          )}
          {isTyping && (
            <div className="flex items-center gap-2 opacity-40 px-2">
              <Sparkles size={16} className="animate-spin" />
              <p className="text-[10px] font-black uppercase tracking-widest animate-pulse">Analyzing Frequencies...</p>
            </div>
          )}
        </div>

        {/* Input Footer */}
        <div className="p-4 md:p-6 border-t border-black/5 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md shrink-0">
          <div className={`flex items-center gap-3 p-2 rounded-[2rem] border-4 transition-all ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-gray-50 border-gray-200'} focus-within:border-blue-500 shadow-inner`}>
            <input 
              type="text" 
              value={input} 
              onChange={e => setInput(e.target.value)} 
              onKeyPress={e => e.key === 'Enter' && handleSend()}
              placeholder="Express your neural state..." 
              className="flex-1 bg-transparent px-5 py-3 font-black text-sm outline-none" 
            />
            <button 
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className="kahoot-button-blue p-4 rounded-2xl text-white shadow-xl active:scale-95 transition-all disabled:opacity-50"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
      
      <div className="mt-4 flex items-center justify-center gap-2 opacity-30 text-center">
        <Info size={12} />
        <p className="text-[8px] font-black uppercase tracking-[0.2em]">Neural AI Psychiatrist is for supportive guidance, not emergency medical care.</p>
      </div>
    </div>
  );
};

export default PsychiatristSection;

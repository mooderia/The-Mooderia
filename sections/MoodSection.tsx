
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, Repeat, Send, Sparkles, Brain, Wind, ShoppingBag, Gamepad2, Bed, Lock, Coins, Ghost } from 'lucide-react';
import { User, Post, Mood, Comment } from '../types';
import MoodPetSection from './MoodPetSection';

interface MoodSectionProps {
  user: User;
  posts: Post[];
  onPost: (content: string) => void;
  onHeart: (postId: string) => void;
  onComment: (postId: string, text: string) => void;
  onRepost: (post: Post) => void;
  onFollow: (username: string) => void;
  onBlock: (username: string) => void;
  isDarkMode: boolean;
  onNavigateToProfile: (username: string) => void;
  onUpdatePet: (hunger: number, thirst: number, rest: number, coins: number, sleepUntil?: number | null) => void;
}

type MoodSubTab = 'Express' | 'Teller' | 'Quiz' | 'MoodPet';

const MoodSection: React.FC<MoodSectionProps> = ({ user, posts, onPost, onHeart, onComment, onRepost, onFollow, onBlock, isDarkMode, onNavigateToProfile, onUpdatePet }) => {
  const [subTab, setSubTab] = useState<MoodSubTab>('Express');
  const [postContent, setPostContent] = useState('');
  const [feedFilter, setFeedFilter] = useState<'All' | 'Following'>('All');
  const [expandedComments, setExpandedComments] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');

  const filteredPosts = feedFilter === 'All' 
    ? posts 
    : posts.filter(p => user.following.includes(p.author) || p.author === user.username);

  const handlePost = () => {
    if (!postContent.trim()) return;
    onPost(postContent);
    setPostContent('');
  };

  const submitComment = (postId: string) => {
    if (!newComment.trim()) return;
    onComment(postId, newComment);
    setNewComment('');
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Fixed Header */}
      <div className="flex items-center justify-between pb-4 shrink-0 overflow-x-auto no-scrollbar">
        <div className="flex gap-2">
          {['Express', 'Teller', 'Quiz', 'MoodPet'].map((tab) => (
            <button
              key={tab}
              onClick={() => setSubTab(tab as MoodSubTab)}
              className={`px-5 py-2.5 rounded-full font-black whitespace-nowrap transition-all text-xs md:text-sm ${subTab === tab ? 'bg-[#46178f] text-white scale-105 shadow-md' : 'bg-gray-200 dark:bg-slate-700 opacity-70 text-slate-800 dark:text-slate-300'}`}
            >
              {tab === 'MoodPet' ? 'MOOD PET 🐾' : tab.toUpperCase()}
            </button>
          ))}
        </div>
        
        {subTab === 'MoodPet' && (
          <div className="flex items-center gap-2 bg-yellow-400 px-4 py-2 rounded-2xl shadow-lg border-b-4 border-yellow-600 ml-4">
             <Coins className="text-white animate-bounce" size={20} />
             <span className="text-white font-black italic">{user.moodCoins}</span>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pr-1">
        {subTab === 'Express' && (
          <div className="space-y-6">
            <div className="flex gap-2 p-1.5 bg-gray-200 dark:bg-slate-800 rounded-2xl w-fit shrink-0">
              <button onClick={() => setFeedFilter('All')} className={`px-4 py-1.5 rounded-xl text-xs font-black transition-all ${feedFilter === 'All' ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' : 'opacity-50 text-slate-600 dark:text-slate-400'}`}>ALL MOODS</button>
              <button onClick={() => setFeedFilter('Following')} className={`px-4 py-1.5 rounded-xl text-xs font-black transition-all ${feedFilter === 'Following' ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' : 'opacity-50 text-slate-600 dark:text-slate-400'}`}>FOLLOWING</button>
            </div>
            
            <div className={`p-6 rounded-[2rem] ${isDarkMode ? 'bg-slate-800' : 'bg-white'} shadow-xl shrink-0`}>
              <textarea value={postContent} onChange={(e) => setPostContent(e.target.value)} placeholder="What's your emotional status today, citizen?" className={`w-full p-4 rounded-xl border-2 focus:border-[#46178f] outline-none transition-all text-sm md:text-base ${isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-gray-50 border-gray-100 text-slate-900'}`} rows={2} />
              <div className="flex justify-end mt-4">
                <button onClick={handlePost} className="kahoot-button-blue px-6 py-2.5 text-white rounded-xl font-black text-xs md:text-sm flex items-center gap-2 transition-transform active:scale-95"><Send size={16} /> EXPRESS IT</button>
              </div>
            </div>

            <div className="space-y-4 pb-10">
              {filteredPosts.map(post => (
                  <motion.div layout key={post.id} className={`p-6 rounded-[2.5rem] ${isDarkMode ? 'bg-slate-800 text-white' : 'bg-white text-slate-900'} shadow-md border-b-4 border-gray-200 dark:border-slate-700`}>
                    <div className="flex items-center justify-between mb-4">
                      <button onClick={() => onNavigateToProfile(post.author)} className="flex items-center gap-3 text-left hover:opacity-80 transition-opacity">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-400 to-purple-400 flex items-center justify-center text-white font-black overflow-hidden shadow-sm">
                          {post.author[0].toUpperCase()}
                        </div>
                        <div>
                          <h4 className="font-black text-sm">@{post.author}</h4>
                          {post.isRepost && <p className="text-[10px] font-bold opacity-50 flex items-center gap-1"><Repeat size={8}/> Reposted from @{post.originalAuthor}</p>}
                        </div>
                      </button>
                    </div>
                    <p className="text-base md:text-lg mb-6 leading-relaxed font-medium">{post.content}</p>
                    
                    <div className="flex items-center gap-6 pt-4 border-t border-gray-100 dark:border-slate-700">
                      <button onClick={() => onHeart(post.id)} className="flex items-center gap-1.5 text-red-500 font-black text-xs transition-transform active:scale-110 hover:opacity-80"><Heart size={18} fill={post.hearts > 0 ? "currentColor" : "none"} /> {post.hearts}</button>
                      <button onClick={() => setExpandedComments(expandedComments === post.id ? null : post.id)} className="flex items-center gap-1.5 text-blue-500 font-black text-xs hover:opacity-80"><MessageCircle size={18} /> {post.comments.length}</button>
                      <button onClick={() => onRepost(post)} className="flex items-center gap-1.5 text-green-500 font-black text-xs hover:opacity-80 transition-transform active:rotate-180"><Repeat size={18} /> REPOST</button>
                    </div>

                    <AnimatePresence>
                      {expandedComments === post.id && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="mt-6 pt-6 border-t border-gray-100 dark:border-slate-700 space-y-4 overflow-hidden">
                           <div className="flex gap-2">
                             <input type="text" value={newComment} onChange={(e) => setNewComment(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && submitComment(post.id)} placeholder="Add citizen feedback..." className={`flex-1 p-3 rounded-xl text-xs font-bold outline-none border-2 focus:border-blue-500 ${isDarkMode ? 'bg-slate-700 border-slate-600' : 'bg-gray-50 border-gray-200'}`} />
                             <button onClick={() => submitComment(post.id)} className="p-3 bg-blue-500 text-white rounded-xl shadow-md"><Send size={16} /></button>
                           </div>
                           <div className="space-y-3 max-h-40 overflow-y-auto custom-scrollbar">
                             {post.comments.map(c => (
                               <div key={c.id} className="flex gap-3 items-start">
                                 <button onClick={() => onNavigateToProfile(c.author)} className="w-8 h-8 rounded-lg bg-gray-200 dark:bg-slate-700 shrink-0 flex items-center justify-center font-black text-[10px] hover:opacity-80">{c.author[0]}</button>
                                 <div className="flex-1">
                                   <button onClick={() => onNavigateToProfile(c.author)} className="text-[10px] font-black italic hover:underline">@{c.author}</button>
                                   <p className="text-xs font-medium opacity-80">{c.text}</p>
                                 </div>
                               </div>
                             ))}
                           </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
              ))}
            </div>
          </div>
        )}
        
        {subTab === 'MoodPet' && (
          <MoodPetSection user={user} isDarkMode={isDarkMode} onUpdate={onUpdatePet} />
        )}

        {subTab === 'Teller' && <div className="p-8 text-center opacity-40 font-black uppercase tracking-widest italic py-20">The fortune teller is consulting the void...</div>}
        {subTab === 'Quiz' && <div className="p-8 text-center opacity-40 font-black uppercase tracking-widest italic py-20">Quiz engines warming up...</div>}
      </div>
    </div>
  );
};

export default MoodSection;

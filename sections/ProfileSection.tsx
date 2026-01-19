
import React, { useState, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import { User, Post } from '../types';
import { Edit, Heart, MessageCircle, Flame, ShieldCheck, UserPlus, UserMinus, MoreVertical, ShieldAlert, Camera, Palette, Image as ImageIcon, Repeat } from 'lucide-react';

interface ProfileSectionProps {
  user: User;
  allPosts: Post[];
  isDarkMode: boolean;
  currentUser: User;
  onEditProfile?: (displayName: string, username: string, profilePic?: string, title?: string, bannerPic?: string, profileColor?: string) => void;
  onBlock?: (username: string) => void;
  onFollow?: (username: string) => void;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({ user, allPosts, isDarkMode, currentUser, onEditProfile, onBlock, onFollow }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(user.displayName);
  const [username, setUsername] = useState(user.username);
  const [profilePic, setProfilePic] = useState(user.profilePic || '');
  const [bannerPic, setBannerPic] = useState(user.bannerPic || '');
  const [profileTitle, setProfileTitle] = useState(user.title || 'Citizen');
  const [profileColor, setProfileColor] = useState(user.profileColor || '#46178f');
  const [activeTab, setActiveTab] = useState<'Posts' | 'Reposts' | 'Stats'>('Posts');
  const [showBlockMenu, setShowBlockMenu] = useState(false);
  const profilePicInputRef = useRef<HTMLInputElement>(null);
  const bannerPicInputRef = useRef<HTMLInputElement>(null);

  const isOwnProfile = currentUser.username === user.username;
  const isFollowing = currentUser.following.includes(user.username);
  const myPosts = useMemo(() => allPosts.filter(p => p.author === user.username && !p.isRepost), [allPosts, user.username]);
  const myReposts = useMemo(() => allPosts.filter(p => p.author === user.username && p.isRepost), [allPosts, user.username]);

  const handleSave = () => {
    if (onEditProfile) onEditProfile(displayName, username, profilePic, profileTitle, bannerPic, profileColor);
    setIsEditing(false);
  };

  const accentColor = isEditing ? profileColor : (user.profileColor || '#46178f');

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header - Shrinkable but generally fits */}
      <div className={`relative p-6 rounded-[2.5rem] mb-4 shrink-0 ${isDarkMode ? 'bg-slate-800 text-white' : 'bg-white text-slate-900'} shadow-xl`}>
        <div className="h-32 md:h-40 w-full rounded-[1.5rem] absolute top-0 left-0 overflow-hidden" style={{ backgroundColor: accentColor, backgroundImage: bannerPic ? `url(${bannerPic})` : 'none', backgroundSize: 'cover' }}>
          {bannerPic && <div className="absolute inset-0 bg-black/20"></div>}
        </div>
        <div className="relative pt-16 md:pt-20 flex flex-col md:flex-row items-end gap-4">
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-[2rem] bg-white p-1 shadow-xl shrink-0 overflow-hidden">
             {profilePic ? <img src={profilePic} className="w-full h-full rounded-[1.8rem] object-cover" /> : <div className="w-full h-full rounded-[1.8rem] flex items-center justify-center text-white text-3xl font-black" style={{ backgroundColor: accentColor }}>{user.displayName[0]}</div>}
          </div>
          <div className="flex-1 min-w-0 pb-2">
             <h2 className="text-2xl md:text-3xl font-black italic uppercase truncate">{user.displayName}</h2>
             <p className="text-sm font-bold opacity-50 uppercase tracking-tighter">@{user.username}</p>
          </div>
          <div className="pb-2">
            {!isOwnProfile && (
              <button onClick={() => onFollow?.(user.username)} className={`px-6 py-3 text-white rounded-xl font-black text-xs shadow-lg uppercase transition-all ${isFollowing ? 'bg-red-500' : 'bg-green-500'}`}>
                {isFollowing ? 'UNFOLLOW' : 'FOLLOW'}
              </button>
            )}
            {isOwnProfile && !isEditing && <button onClick={() => setIsEditing(true)} className="px-6 py-3 text-white rounded-xl font-black text-xs uppercase" style={{ backgroundColor: accentColor }}>Edit ID</button>}
            {isEditing && <button onClick={handleSave} className="px-6 py-3 bg-green-500 text-white rounded-xl font-black text-xs uppercase">Save</button>}
          </div>
        </div>
        <div className="mt-4 flex gap-6 text-center border-t dark:border-slate-700 pt-4">
           <div><p className="text-lg font-black">{user.followers?.length || 0}</p><p className="text-[9px] uppercase font-black opacity-40 tracking-widest">Followers</p></div>
           <div><p className="text-lg font-black">{user.following?.length || 0}</p><p className="text-[9px] uppercase font-black opacity-40 tracking-widest">Following</p></div>
           <div><p className="text-lg font-black text-orange-500 italic">{user.moodStreak || 0}</p><p className="text-[9px] uppercase font-black opacity-40 tracking-widest">Streak</p></div>
        </div>
      </div>

      <div className="flex gap-2 mb-4 shrink-0">
         {(['Posts', 'Reposts', 'Stats'] as const).map(tab => (
           <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 p-3 rounded-2xl font-black text-xs uppercase transition-all ${activeTab === tab ? 'text-white' : 'bg-gray-200 dark:bg-slate-700 text-gray-400 opacity-60'}`} style={{ backgroundColor: activeTab === tab ? accentColor : '' }}>{tab}</button>
         ))}
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activeTab === 'Posts' && (
            myPosts.length > 0 ? myPosts.map(post => (
              <div key={post.id} className={`p-6 rounded-[2rem] ${isDarkMode ? 'bg-slate-800' : 'bg-white'} shadow-md`}>
                <p className="text-sm md:text-base font-medium mb-4">{post.content}</p>
                <div className="flex gap-4 opacity-40 text-[10px] font-black uppercase">
                  <span className="flex items-center gap-1"><Heart size={14} className="text-red-500" /> {post.hearts}</span>
                  <span className="flex items-center gap-1"><MessageCircle size={14} className="text-blue-500" /> {post.comments.length}</span>
                </div>
              </div>
            )) : <div className="col-span-2 text-center py-20 opacity-20 font-black uppercase">Empty district log</div>
          )}
          {activeTab === 'Reposts' && (
             myReposts.length > 0 ? myReposts.map(post => (
              <div key={post.id} className={`p-6 rounded-[2rem] ${isDarkMode ? 'bg-slate-800' : 'bg-white'} shadow-md`}>
                <p className="text-[9px] font-black text-green-500 mb-2 italic">Reposted from @{post.originalAuthor}</p>
                <p className="text-sm font-medium mb-4">{post.content}</p>
              </div>
            )) : <div className="col-span-2 text-center py-20 opacity-20 font-black uppercase">No echoes found</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;

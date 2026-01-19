
import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, Repeat, Bell, CheckCircle2, Inbox } from 'lucide-react';
import { Notification } from '../types';

interface NotificationsSectionProps {
  notifications: Notification[];
  isDarkMode: boolean;
  onMarkRead: () => void;
}

const NotificationsSection: React.FC<NotificationsSectionProps> = ({ notifications, isDarkMode, onMarkRead }) => {
  // Clear unread notifications when viewing this tab
  useEffect(() => {
    onMarkRead();
  }, [onMarkRead]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'heart': return <Heart className="text-red-500" size={24} fill="currentColor" />;
      case 'comment': return <MessageCircle className="text-blue-500" size={24} fill="currentColor" />;
      case 'repost': return <Repeat className="text-green-500" size={24} />;
      default: return <Bell size={24} />;
    }
  };

  const getMessageText = (notif: Notification) => {
    switch (notif.type) {
      case 'heart': return (
        <p className="text-sm md:text-base leading-snug">
          <span className="font-black">@{notif.fromUser}</span> liked your post
        </p>
      );
      case 'comment': return (
        <p className="text-sm md:text-base leading-snug">
          <span className="font-black">@{notif.fromUser}</span> commented on your post
        </p>
      );
      case 'repost': return (
        <p className="text-sm md:text-base leading-snug">
          <span className="font-black">@{notif.fromUser}</span> reposted your expression
        </p>
      );
      default: return <p>Activity from <b>@{notif.fromUser}</b></p>;
    }
  };

  const getColorTheme = (type: string) => {
    switch (type) {
      case 'heart': return 'border-red-500 bg-red-50/50 dark:bg-red-900/10';
      case 'comment': return 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/10';
      case 'repost': return 'border-green-500 bg-green-50/50 dark:bg-green-900/10';
      default: return 'border-gray-500 bg-gray-50 dark:bg-slate-700/50';
    }
  };

  return (
    <div className="space-y-8 min-h-[70vh]">
      <div className="flex justify-between items-center">
        <div>
          <h2 className={`text-4xl font-black italic uppercase tracking-tighter ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Alerts</h2>
          <p className="text-[10px] font-black opacity-40 uppercase tracking-widest mt-1">Live from the Mooderia Network</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-full font-black text-[10px] uppercase tracking-widest shadow-lg">
          <CheckCircle2 size={14} /> City Secured
        </div>
      </div>

      <div className="space-y-4">
        {notifications.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className={`py-24 text-center rounded-[3rem] border-4 border-dashed ${isDarkMode ? 'border-slate-800' : 'border-gray-200'} opacity-30`}
          >
            <Inbox size={64} className="mx-auto mb-4" />
            <p className="text-lg font-black uppercase italic">Quiet Streets Today</p>
            <p className="text-xs font-bold max-w-xs mx-auto mt-2">Express yourself in the Mood tab to start receiving citizen interactions!</p>
          </motion.div>
        ) : (
          <AnimatePresence>
            {notifications.map((notif, i) => (
              <motion.div
                key={notif.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`p-6 rounded-[2.5rem] border-l-8 shadow-xl flex items-center gap-6 transition-all hover:scale-[1.02] ${isDarkMode ? 'text-white' : 'text-slate-900'} ${getColorTheme(notif.type)}`}
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-inner bg-white dark:bg-slate-800`}>
                  {getIcon(notif.type)}
                </div>
                <div className="flex-1 min-w-0">
                  {getMessageText(notif)}
                  <div className="mt-3 p-3 bg-white/40 dark:bg-black/20 rounded-xl italic text-xs font-medium opacity-70 truncate">
                    "{notif.postContentSnippet}"
                  </div>
                  <p className="text-[9px] font-black uppercase tracking-widest opacity-40 mt-3 flex items-center gap-2">
                    <Bell size={10} /> {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • DISTRICT FEED
                  </p>
                </div>
                {!notif.read && (
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-ping shadow-lg"></div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      <div className="text-center py-10 opacity-10 font-black italic text-[10px] uppercase tracking-[0.5em]">
        --- END OF TRANSMISSION ---
      </div>
    </div>
  );
};

export default NotificationsSection;

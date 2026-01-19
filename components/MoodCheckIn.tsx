
import React from 'react';
import { motion } from 'framer-motion';
import { Mood } from '../types';

interface MoodCheckInProps {
  onSubmit: (mood: Mood) => void;
  isDarkMode: boolean;
}

const MoodCheckIn: React.FC<MoodCheckInProps> = ({ onSubmit, isDarkMode }) => {
  const moods: { label: Mood, emoji: string, color: string }[] = [
    { label: 'Happy', emoji: '😊', color: 'bg-yellow-400' },
    { label: 'Sad', emoji: '😢', color: 'bg-blue-400' },
    { label: 'Angry', emoji: '😡', color: 'bg-red-500' },
    { label: 'Tired', emoji: '😴', color: 'bg-purple-400' },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`w-full max-w-lg p-8 rounded-3xl text-center ${isDarkMode ? 'bg-slate-800' : 'bg-white'}`}
      >
        <h2 className="text-3xl font-black mb-2 italic uppercase">Welcome to Mooderia!</h2>
        <p className="mb-8 opacity-70">How are you feeling today, citizen?</p>

        <div className="grid grid-cols-2 gap-4">
          {moods.map(m => (
            <button
              key={m.label}
              onClick={() => onSubmit(m.label)}
              className={`kahoot-button group p-6 rounded-2xl flex flex-col items-center gap-2 border-b-4 ${m.color} text-white transition-transform hover:scale-105`}
            >
              <span className="text-5xl group-hover:animate-bounce">{m.emoji}</span>
              <span className="font-extrabold text-xl">{m.label}</span>
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default MoodCheckIn;

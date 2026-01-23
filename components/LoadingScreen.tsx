
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Building2, Smile, Moon, Heart } from 'lucide-react';

interface LoadingScreenProps {
  onComplete?: () => void;
  message?: string;
}

const MESSAGES = [
  "Building the skyscrapers...",
  "Tuning mood frequencies...",
  "Consulting the stars...",
  "Synchronizing citizen IDs...",
  "Polishing the city gates...",
  "Waking up the Mooderia vibes...",
  "Calibrating Dr. Pinel's sofa...",
  "Mixing the cosmic aura..."
];

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [msgIdx, setMsgIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIdx((prev) => (prev + 1) % MESSAGES.length);
    }, 800);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-[#46178f] flex flex-col items-center justify-center p-8 overflow-hidden"
    >
      {/* Background Floating Icons */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <motion.div 
          animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }} 
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute top-[10%] left-[15%] text-white"
        >
          <Building2 size={80} />
        </motion.div>
        <motion.div 
          animate={{ y: [0, 20, 0], rotate: [0, -10, 0] }} 
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute bottom-[20%] left-[10%] text-yellow-400"
        >
          <Moon size={100} />
        </motion.div>
        <motion.div 
          animate={{ scale: [1, 1.2, 1] }} 
          transition={{ duration: 2.5, repeat: Infinity }}
          className="absolute top-[20%] right-[15%] text-red-500"
        >
          <Heart size={90} />
        </motion.div>
        <motion.div 
          animate={{ x: [0, 30, 0], rotate: [0, 45, 0] }} 
          transition={{ duration: 5, repeat: Infinity }}
          className="absolute bottom-[15%] right-[20%] text-blue-400"
        >
          <Sparkles size={120} />
        </motion.div>
      </div>

      <div className="text-center z-10 flex flex-col items-center">
        {/* Animated Main Brand Name */}
        <motion.h1 
          animate={{ 
            scale: [1, 1.05, 1],
            rotate: [-1, 1, -1]
          }}
          transition={{ 
            duration: 2.5, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="text-6xl md:text-8xl font-black text-white italic tracking-tighter uppercase mb-10 drop-shadow-[0_10px_20px_rgba(0,0,0,0.3)]"
        >
          MOODERIA
        </motion.h1>
        
        <div className="h-12 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={msgIdx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-xl md:text-2xl font-black text-blue-300 uppercase italic tracking-widest"
            >
              {MESSAGES[msgIdx]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Bouncy Progress Bar */}
        <div className="w-64 md:w-80 h-6 bg-black/30 rounded-full mt-12 mx-auto overflow-hidden p-1.5 border-2 border-white/20">
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 3, ease: "easeInOut" }}
            className="h-full bg-gradient-to-r from-blue-400 via-purple-400 to-red-400 rounded-full"
          />
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
        className="absolute bottom-10 text-white/40 font-black text-xs tracking-[0.4em] uppercase"
      >
        Entering the Metropolis...
      </motion.div>
    </motion.div>
  );
};

export default LoadingScreen;

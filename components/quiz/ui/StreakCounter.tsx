import React from 'react';
import { motion } from 'framer-motion';

type StreakCounterProps = {
  streak: number;
};

const StreakCounter: React.FC<StreakCounterProps> = ({ streak }) => {
  if (streak === 0) return null;

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full shadow-lg font-bold"
    >
      <span className="text-lg sm:text-2xl">🔥</span>
      <span className="text-xs sm:text-base">{streak} Streak!</span>
    </motion.div>
  );
};

export default StreakCounter;

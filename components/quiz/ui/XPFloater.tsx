import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type XPFloaterProps = {
  xpGained: number;
  xp: number;
};

const XPFloater: React.FC<XPFloaterProps> = ({ xpGained, xp }) => {
  return (
    <div className="relative">
      {/* Total XP Display */}
      <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 bg-purple-500 text-white rounded-full shadow-md font-semibold">
        <span className="text-lg sm:text-xl">⭐</span>
        <span className="text-xs sm:text-base">{xp} XP</span>
      </div>

      {/* Floating +XP Animation */}
      <AnimatePresence>
        {xpGained > 0 && (
          <motion.div
            initial={{ opacity: 1, y: 0, scale: 1 }}
            animate={{ opacity: 0, y: -50, scale: 1.2 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute -top-6 sm:-top-8 left-1/2 -translate-x-1/2 text-xl sm:text-2xl font-bold text-yellow-400"
            style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}
          >
            +{xpGained}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default XPFloater;

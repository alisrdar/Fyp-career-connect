import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/app/quiz/types';

type BadgePopupProps = {
  badge: Badge | null;
};

const BadgePopup: React.FC<BadgePopupProps> = ({ badge }) => {
  return (
    <AnimatePresence>
      {badge && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
        >
          <div className="bg-gradient-to-br from-yellow-400 to-orange-500 text-white px-8 py-6 rounded-2xl shadow-2xl text-center">
            <div className="text-6xl mb-2">{badge.icon}</div>
            <div className="text-2xl font-bold">{badge.name}</div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BadgePopup;

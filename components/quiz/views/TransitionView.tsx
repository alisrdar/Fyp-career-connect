import React from 'react';
import { motion } from 'framer-motion';

type TransitionViewProps = {
  stage: {
    name: string;
    color: string;
    textColor: string;
    icon: string;
  };
};

const TransitionView: React.FC<TransitionViewProps> = ({ stage }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.2 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800"
    >
      <div className="text-center space-y-6">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="text-9xl"
        >
          {stage.icon}
        </motion.div>
        <h2 className={`text-5xl font-bold ${stage.textColor}`}>
          {stage.name}
        </h2>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          Great progress! Let's dive deeper...
        </p>
      </div>
    </motion.div>
  );
};

export default TransitionView;

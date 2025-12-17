import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Mascot from '../ui/Mascot';
import ProgressBar from '../ui/ProgressBar';
import StreakCounter from '../ui/StreakCounter';
import XPFloater from '../ui/XPFloater';
import QuestionCard from '../ui/QuestionCard';
import BadgePopup from '../ui/BadgePopup';
import { Question, Stage, Badge } from '@/app/quiz/types';
import type { MascotState } from '@/hooks/useMascotState';

type GameViewProps = {
  question: Question | null;
  onAnswer: (answerId: string) => void;
  progress: number;
  questionCount: number;
  maxQuestions: number;
  stage: Stage;
  streak: number;
  xp: number;
  xpGained: number;
  mascotState: MascotState;
  badge: Badge | null;
};

const GameView: React.FC<GameViewProps> = ({
  question,
  onAnswer,
  progress,
  questionCount,
  maxQuestions,
  stage,
  streak,
  xp,
  xpGained,
  mascotState,
  badge,
}) => {
  const router = useRouter();
  
  if (!question) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-6xl animate-spin">⚙️</div>
          <p className="text-xl text-gray-600 dark:text-gray-400">Loading next question...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-5xl mx-auto py-6 px-4 space-y-6">
        {/* Header with Logo and Exit */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <img src="/pegcLogo_black.png" alt="Logo" className="w-10 h-10 dark:hidden" />
            <img src="/pgec_logo_white_Svg.png" alt="Logo" className="w-10 h-10 hidden dark:block" />
            <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
              Career Quiz
            </span>
          </div>
          <button
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Exit
          </button>
        </div>
        
        {/* Progress Bar */}
        <ProgressBar progress={progress} stage={stage} />

        {/* Stats Row */}
        <div className="flex items-center justify-between gap-4">
          {/* Question Counter */}
          <div className="text-gray-600 dark:text-gray-400 font-medium">
            Question {questionCount + 1} / {maxQuestions}
          </div>

          {/* Gamification Stats */}
          <div className="flex items-center gap-4">
            <StreakCounter streak={streak} />
            <XPFloater xpGained={xpGained} xp={xp} />
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid md:grid-cols-[300px_1fr] gap-6">
          {/* Left: Mascot */}
          <div className="flex flex-col items-center space-y-4">
            <Mascot state={mascotState} size={200} />
          </div>

          {/* Right: Question Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={question.id}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <QuestionCard question={question} onAnswer={onAnswer} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Badge Popup Overlay */}
      <BadgePopup badge={badge} />
    </div>
  );
};

export default GameView;

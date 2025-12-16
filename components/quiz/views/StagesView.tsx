import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Stage } from '@/app/quiz/types';

type StagesViewProps = {
  currentStage: number;
  completedStages: number[];
  onBeginStage: (stageId: number) => void;
  loading?: boolean;
};

const STAGE_CONFIG = [
  {
    id: 1,
    name: "Warm Up",
    subtitle: "Introduction & Basics",
    icon: "🌱",
    color: "from-green-400 to-green-600",
    bgColor: "bg-green-50 dark:bg-green-900/10",
    borderColor: "border-green-500"
  },
  {
    id: 2,
    name: "Deep Dive",
    subtitle: "Core Concepts",
    icon: "🌊",
    color: "from-yellow-400 to-yellow-600",
    bgColor: "bg-yellow-50 dark:bg-yellow-900/10",
    borderColor: "border-yellow-500"
  },
  {
    id: 3,
    name: "Final Analysis",
    subtitle: "Advanced Topics",
    icon: "🏁",
    color: "from-red-400 to-red-600",
    bgColor: "bg-red-50 dark:bg-red-900/10",
    borderColor: "border-red-500"
  }
];

const StagesView: React.FC<StagesViewProps> = ({ 
  currentStage, 
  completedStages, 
  onBeginStage,
  loading = false 
}) => {
  const router = useRouter();
  
  const getStageStatus = (stageId: number): 'completed' | 'unlocked' | 'locked' => {
    if (completedStages.includes(stageId)) return 'completed';
    if (stageId === currentStage) return 'unlocked';
    return 'locked';
  };

  const nextStageToStart = completedStages.length > 0 
    ? Math.min(completedStages.length + 1, 3)
    : 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="max-w-2xl w-full bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-6 sm:p-8 md:p-12">
          {/* Header with Logo */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <img src="/pegcLogo_black.png" alt="Logo" className="w-10 h-10 dark:hidden" />
              <img src="/pgec_logo_white_Svg.png" alt="Logo" className="w-10 h-10 hidden dark:block" />
            </div>
            <button
              onClick={() => router.push('/dashboard')}
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Exit
            </button>
          </div>
          
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 dark:text-gray-100 mb-2">
              Your Journey
            </h1>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300">
              Complete each stage to unlock the next.
            </p>
          </div>

        {/* Stages List */}
        <div className="space-y-4 mb-8">
          {STAGE_CONFIG.map((stage) => {
            const status = getStageStatus(stage.id);
            const isLocked = status === 'locked';
            const isCompleted = status === 'completed';
            const isUnlocked = status === 'unlocked';

            return (
              <motion.div
                key={stage.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: stage.id * 0.1 }}
                className={`
                  relative p-5 rounded-2xl border-2 transition-all duration-300
                  ${isUnlocked 
                    ? `${stage.bgColor} ${stage.borderColor} shadow-lg scale-105` 
                    : isCompleted
                    ? 'bg-gray-50 dark:bg-gray-700/50 border-gray-300 dark:border-gray-600'
                    : 'bg-gray-100 dark:bg-gray-700/30 border-gray-200 dark:border-gray-700 opacity-60'
                  }
                `}
              >
                <div className="flex items-center gap-4">
                  {/* Icon */}
                  <div className={`
                    flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center text-3xl
                    ${isUnlocked ? `bg-gradient-to-br ${stage.color}` : 'bg-gray-200 dark:bg-gray-600'}
                  `}>
                    {isCompleted ? '✓' : isLocked ? '🔒' : stage.icon}
                  </div>

                  {/* Text */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {isCompleted ? '●' : '○'}
                      </span>
                      <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                        {stage.name}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {stage.subtitle}
                    </p>
                  </div>

                  {/* Status Badge */}
                  <div className="flex-shrink-0">
                    {isCompleted && (
                      <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-semibold rounded-full">
                        ✓ Completed
                      </span>
                    )}
                    {isUnlocked && (
                      <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-semibold rounded-full">
                        🔓 Unlocked
                      </span>
                    )}
                    {isLocked && (
                      <span className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs font-semibold rounded-full">
                        🔒 Locked
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Action Button */}
        <motion.button
          onClick={() => onBeginStage(nextStageToStart)}
          disabled={loading || completedStages.length === 3}
          className={`
            w-full py-4 rounded-xl font-bold text-lg transition-all duration-300
            ${completedStages.length === 3
              ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
              : `bg-gradient-to-r ${STAGE_CONFIG[nextStageToStart - 1].color} text-white shadow-lg 
                 hover:shadow-xl hover:scale-105 active:scale-95`
            }
          `}
          whileHover={completedStages.length < 3 ? { scale: 1.02 } : {}}
          whileTap={completedStages.length < 3 ? { scale: 0.98 } : {}}
        >
          {loading ? (
            <span>Loading...</span>
          ) : completedStages.length === 3 ? (
            'All Stages Complete! 🎉'
          ) : completedStages.length === 0 ? (
            `Begin ${STAGE_CONFIG[0].name}`
          ) : (
            `Continue to ${STAGE_CONFIG[nextStageToStart - 1].name}`
          )}
        </motion.button>

        {/* Progress Indicator */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Progress: {completedStages.length} / 3 stages completed
          </p>
          <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(completedStages.length / 3) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default StagesView;

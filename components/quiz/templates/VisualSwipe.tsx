import React, { useState } from 'react';
import { Question } from '@/app/quiz/types';

type VisualSwipeProps = {
  question: Question;
  onAnswer: (answerId: string) => void;
};

const VisualSwipe: React.FC<VisualSwipeProps> = ({ question, onAnswer }) => {
  const [direction, setDirection] = useState<string | null>(null);
  const leftOption = question.options?.find(opt => opt.id === 'left');
  const rightOption = question.options?.find(opt => opt.id === 'right');

  const handleSwipe = (optionId: string) => {
    setDirection(optionId);
    setTimeout(() => {
      onAnswer(optionId);
    }, 300);
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-center text-gray-800 dark:text-gray-200 px-2">
        {question.text}
      </h3>

      {/* Media Preview */}
      {question.media_url && (
        <div className="relative w-full max-w-md mx-auto h-48 sm:h-64 rounded-xl overflow-hidden shadow-lg">
          <img
            src={question.media_url}
            alt="Question visual"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-8 px-2">
        {/* Left Choice (No) */}
        <button
          onClick={() => handleSwipe('left')}
          disabled={direction !== null}
          className={`
            flex-1 max-w-full sm:max-w-xs p-6 sm:p-8 rounded-2xl
            border-4 transition-all duration-300
            ${
              direction === 'left'
                ? 'border-red-500 bg-red-50 dark:bg-red-900/20 scale-105 shadow-xl'
                : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-red-400 hover:scale-102'
            }
            ${direction !== null ? 'cursor-not-allowed opacity-75' : 'cursor-pointer'}
          `}
        >
          <div className="text-5xl sm:text-6xl mb-3 sm:mb-4 text-center">👎</div>
          <p className="text-lg sm:text-xl font-semibold text-center text-gray-800 dark:text-gray-200">
            {leftOption?.text || 'No'}
          </p>
        </button>

        {/* Right Choice (Yes) */}
        <button
          onClick={() => handleSwipe('right')}
          disabled={direction !== null}
          className={`
            flex-1 max-w-full sm:max-w-xs p-6 sm:p-8 rounded-2xl
            border-4 transition-all duration-300
            ${
              direction === 'right'
                ? 'border-green-500 bg-green-50 dark:bg-green-900/20 scale-105 shadow-xl'
                : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-green-400 hover:scale-102'
            }
            ${direction !== null ? 'cursor-not-allowed opacity-75' : 'cursor-pointer'}
          `}
        >
          <div className="text-5xl sm:text-6xl mb-3 sm:mb-4 text-center">👍</div>
          <p className="text-lg sm:text-xl font-semibold text-center text-gray-800 dark:text-gray-200">
            {rightOption?.text || 'Yes'}
          </p>
        </button>
      </div>
    </div>
  );
};

export default VisualSwipe;

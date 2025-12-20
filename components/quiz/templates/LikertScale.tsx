import React, { useState, useEffect } from 'react';
import { Question } from '@/app/quiz/types';

type LikertScaleProps = {
  question: Question;
  onAnswer: (answerId: string) => void;
  initialAnswer?: string; // Add prop for existing answer
};

const LikertScale: React.FC<LikertScaleProps> = ({ question, onAnswer, initialAnswer }) => {
  const [selected, setSelected] = useState<number | null>(null);

  const labels = ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'];
  const emojis = ['😞', '😕', '😐', '🙂', '😄'];

  // Initialize with existing answer or reset when question changes
  useEffect(() => {
    if (initialAnswer) {
      // Convert answer string to index (1-5)
      const index = parseInt(initialAnswer);
      if (!isNaN(index) && index >= 1 && index <= 5) {
        setSelected(index);
      } else {
        // If answer is a label string like "Agree", find its index
        const labelIndex = labels.indexOf(initialAnswer);
        if (labelIndex !== -1) {
          setSelected(labelIndex + 1);
        } else {
          setSelected(null);
        }
      }
    } else {
      setSelected(null);
    }
  }, [question.id, initialAnswer]);

  const handleSelect = (value: number) => {
    setSelected(value);
    // Auto-submit after selection
    setTimeout(() => {
      onAnswer(value.toString());
    }, 300);
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-center text-gray-800 dark:text-gray-200 px-2">
        {question.text}
      </h3>

      {/* Likert Scale */}
      <div className="flex flex-col sm:flex-row justify-center items-stretch sm:items-center gap-3 sm:gap-4 px-2">
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            key={value}
            onClick={() => handleSelect(value)}
            className={`
              flex sm:flex-col items-center justify-between sm:justify-center gap-3 sm:gap-2 p-4 rounded-xl
              transition-all duration-200 min-h-[60px] sm:min-h-0 cursor-pointer
              ${
                selected === value
                  ? 'bg-blue-500 text-white scale-105 sm:scale-110 shadow-lg ring-2 ring-blue-400'
                  : 'bg-gray-100 dark:bg-gray-700 hover:bg-blue-100 dark:hover:bg-gray-600 hover:scale-102'
              }
            `}
          >
            <span className="text-3xl sm:text-4xl">{emojis[value - 1]}</span>
            <span className="text-xs sm:text-xs font-medium text-left sm:text-center flex-1 sm:flex-none whitespace-normal sm:whitespace-nowrap">
              {labels[value - 1]}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default LikertScale;

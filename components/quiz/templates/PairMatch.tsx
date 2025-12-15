import React, { useState } from 'react';
import { Question } from '@/app/quiz/types';

type PairMatchProps = {
  question: Question;
  onAnswer: (answerId: string) => void;
};

const PairMatch: React.FC<PairMatchProps> = ({ question, onAnswer }) => {
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  // Separate left and right items based on ID prefix
  const leftItems = question.options?.filter(opt => opt.id.startsWith('L')) || [];
  const rightItems = question.options?.filter(opt => opt.id.startsWith('R')) || [];
  
  // Shuffle right items
  const [shuffledRight] = useState(() => 
    [...rightItems].sort(() => Math.random() - 0.5)
  );

  const handleLeftClick = (leftId: string) => {
    if (submitted) return;
    
    // If clicking already matched item, unselect it
    if (matches[leftId]) {
      const newMatches = { ...matches };
      delete newMatches[leftId];
      setMatches(newMatches);
      return;
    }
    
    // If clicking already selected, deselect it
    if (selectedLeft === leftId) {
      setSelectedLeft(null);
      return;
    }
    
    setSelectedLeft(leftId);
  };

  const handleRightClick = (rightId: string) => {
    if (submitted || !selectedLeft || Object.values(matches).includes(rightId)) return;
    setMatches(prev => ({ ...prev, [selectedLeft]: rightId }));
    setSelectedLeft(null);
  };

  const handleSubmit = () => {
    setSubmitted(true);
    onAnswer(JSON.stringify(matches));
  };

  const allMatched = Object.keys(matches).length === leftItems.length;

  return (
    <div className="space-y-4 sm:space-y-6 px-2">
      <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-center text-gray-800 dark:text-gray-200">
        {question.text}
      </h3>

      <p className="text-center text-sm sm:text-base text-gray-600 dark:text-gray-400 px-2">
        Click an item on the left, then click its match on the right. Click a matched item to unselect.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
        {/* Left Column */}
        <div className="space-y-2 sm:space-y-3">
          <h4 className="text-xs sm:text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Items</h4>
          {leftItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleLeftClick(item.id)}
              className={`w-full p-3 sm:p-4 text-left rounded-lg border-2 transition-all text-sm sm:text-base
                ${matches[item.id] 
                  ? 'bg-green-100 dark:bg-green-900/20 border-green-500' 
                  : selectedLeft === item.id
                  ? 'bg-blue-100 dark:bg-blue-900/20 border-blue-500 ring-2 ring-blue-300'
                  : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:border-blue-400'
                }`}
              disabled={submitted || !!matches[item.id]}
            >
              <div className="flex items-center justify-between">
                <span className="flex-1 pr-2">{item.text}</span>
                {matches[item.id] && <span className="text-green-500 text-lg">✓</span>}
              </div>
            </button>
          ))}
        </div>

        {/* Right Column */}
        <div className="space-y-2 sm:space-y-3">
          <h4 className="text-xs sm:text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Matches</h4>
          {shuffledRight.map((item) => (
            <button
              key={item.id}
              onClick={() => handleRightClick(item.id)}
              className={`w-full p-3 sm:p-4 text-left rounded-lg border-2 transition-all text-sm sm:text-base
                ${Object.values(matches).includes(item.id)
                  ? 'bg-green-100 dark:bg-green-900/20 border-green-500'
                  : selectedLeft
                  ? 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:border-green-400 cursor-pointer'
                  : 'bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 opacity-50'
                }`}
              disabled={submitted || !selectedLeft || Object.values(matches).includes(item.id)}
            >
              <div className="flex items-center justify-between">
                <span>{item.text}</span>
                {Object.values(matches).includes(item.id) && <span className="text-green-500">✓</span>}
              </div>
            </button>
          ))}
        </div>
      </div>

      {!submitted && allMatched && (
        <button
          onClick={handleSubmit}
          className="w-full py-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold 
                   rounded-lg transition-colors duration-200 shadow-lg"
        >
          Submit Matches
        </button>
      )}
    </div>
  );
};

export default PairMatch;

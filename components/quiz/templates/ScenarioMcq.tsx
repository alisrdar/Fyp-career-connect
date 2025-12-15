import React, { useState } from 'react';
import OptionButton from '../ui/OptionButton';
import { Question } from '@/app/quiz/types';

type ScenarioMcqProps = {
  question: Question;
  onAnswer: (answerId: string) => void;
};

const ScenarioMcq: React.FC<ScenarioMcqProps> = ({ question, onAnswer }) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleSelect = (optionId: string) => {
    setSelectedId(optionId);
    // Auto-submit after selection
    setTimeout(() => {
      onAnswer(optionId);
    }, 300);
  };

  return (
    <div className="space-y-4 sm:space-y-6 px-2">
      {/* Scenario Text */}
      {question.scenario && (
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 sm:p-6 rounded-lg border-l-4 border-blue-500">
          <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 italic leading-relaxed">{question.scenario}</p>
        </div>
      )}

      {/* Question */}
      <h3 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-200">
        {question.text}
      </h3>

      {/* Options */}
      <div className="space-y-2 sm:space-y-3">
        {question.options?.map((option) => (
          <OptionButton
            key={option.id}
            text={option.text}
            selected={selectedId === option.id}
            onClick={() => handleSelect(option.id)}
            disabled={selectedId !== null}
          />
        ))}
      </div>
    </div>
  );
};

export default ScenarioMcq;

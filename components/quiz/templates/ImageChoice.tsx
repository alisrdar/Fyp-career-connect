import React, { useState } from 'react';
import { Question } from '@/app/quiz/types';

type ImageChoiceProps = {
  question: Question;
  onAnswer: (answerId: string) => void;
};

const ImageChoice: React.FC<ImageChoiceProps> = ({ question, onAnswer }) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleSelect = (optionId: string) => {
    setSelectedId(optionId);
    setTimeout(() => {
      onAnswer(optionId);
    }, 300);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-center text-gray-800 dark:text-gray-200 px-2">
        {question.text}
      </h3>

      {question.media_url && (
        <div className="relative w-full max-w-2xl mx-auto h-48 sm:h-64 rounded-xl overflow-hidden shadow-lg">
          <img
            src={question.media_url}
            alt="Question context"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 px-2">
        {question.options?.map((option) => (
          <button
            key={option.id}
            onClick={() => handleSelect(option.id)}
            disabled={selectedId !== null}
            className={`
              relative overflow-hidden rounded-lg
              border-4 transition-all duration-200
              ${
                selectedId === option.id
                  ? 'border-blue-500 scale-105 shadow-xl'
                  : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 hover:scale-102'
              }
              ${selectedId !== null ? 'cursor-not-allowed opacity-75' : 'cursor-pointer'}
            `}
          >
            {(option.media_url || option.image) ? (
              <div className="relative w-full h-40 sm:h-48">
                <img
                  src={option.media_url || option.image || ''}
                  alt={option.text}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-full h-40 sm:h-48 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                <span className="text-5xl sm:text-6xl">{option.text.charAt(0)}</span>
              </div>
            )}
            <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-2 sm:p-3 text-center font-medium text-sm sm:text-base">
              {option.text}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ImageChoice;

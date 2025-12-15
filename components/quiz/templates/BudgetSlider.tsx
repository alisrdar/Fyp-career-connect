import React, { useState, useEffect } from 'react';
import { Question } from '@/app/quiz/types';

type BudgetSliderProps = {
  question: Question;
  onAnswer: (answerId: string) => void;
};

const BudgetSlider: React.FC<BudgetSliderProps> = ({ question, onAnswer }) => {
  const options = question.options || [];
  const targetSum = 100;
  
  // Initialize with equal distribution
  const initialValues = options.reduce((acc, option) => {
    acc[option.id] = Math.floor(100 / options.length);
    return acc;
  }, {} as Record<string, number>);
  
  const [values, setValues] = useState<Record<string, number>>(initialValues);
  const [submitted, setSubmitted] = useState(false);

  const totalAllocated = Object.values(values).reduce((sum, val) => sum + val, 0);
  const remaining = targetSum - totalAllocated;

  const handleSliderChange = (optionId: string, newValue: number) => {
    setValues(prev => ({ ...prev, [optionId]: newValue }));
  };

  const handleSubmit = () => {
    if (totalAllocated === targetSum) {
      setSubmitted(true);
      onAnswer(JSON.stringify(values));
    }
  };

  const isValid = totalAllocated === targetSum;

  return (
    <div className="space-y-6 sm:space-y-8 px-2">
      <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-center text-gray-800 dark:text-gray-200">
        {question.text}
      </h3>

      <div className="max-w-2xl mx-auto space-y-4 sm:space-y-6">
        {/* Total Display */}
        <div className="text-center">
          <div className={`text-4xl sm:text-5xl md:text-6xl font-bold ${
            isValid ? 'text-green-500' : remaining < 0 ? 'text-red-500' : 'text-blue-500'
          }`}>
            {totalAllocated}%
          </div>
          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mt-2">
            {isValid ? '✓ Perfect allocation!' : `${Math.abs(remaining)}% ${remaining > 0 ? 'remaining' : 'over budget'}`}
          </p>
        </div>

        {/* Sliders */}
        <div className="space-y-4 sm:space-y-6">
          {options.map((option) => (
            <div key={option.id} className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="font-medium text-gray-700 dark:text-gray-300">
                  {option.text}
                </label>
                <span className="text-2xl font-bold text-blue-500">
                  {values[option.id]}%
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={values[option.id]}
                onChange={(e) => handleSliderChange(option.id, parseInt(e.target.value))}
                disabled={submitted}
                className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer 
                         dark:bg-gray-700 accent-blue-500"
              />
            </div>
          ))}
        </div>

        {/* Submit Button */}
        {!submitted && (
          <button
            onClick={handleSubmit}
            disabled={!isValid}
            className={`w-full py-4 text-white font-semibold rounded-lg transition-colors duration-200 shadow-lg ${
              isValid 
                ? 'bg-blue-500 hover:bg-blue-600 cursor-pointer' 
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            {isValid ? 'Submit Budget' : `Adjust to reach ${targetSum}%`}
          </button>
        )}
      </div>
    </div>
  );
};

export default BudgetSlider;

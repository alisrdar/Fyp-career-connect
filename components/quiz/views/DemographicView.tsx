import React, { useState } from 'react';
import { motion } from 'framer-motion';
import QuizTopBar from '@/components/dashboad/quiz/QuizTopbar';

type DemographicViewProps = {
  onSelectDemographic: (demographic: string) => void;
  loading?: boolean;
};

const DEMOGRAPHICS = [
  {
    id: 'middle_school',
    name: 'Middle School',
    subtitle: 'Ages 11-14',
    icon: '📚',
    questions: 20,
    color: 'from-blue-400 to-cyan-500',
    bgColor: 'bg-blue-50 dark:bg-blue-900/10'
  },
  {
    id: 'high_school',
    name: 'High School',
    subtitle: 'Ages 15-18',
    icon: '🎓',
    questions: 25,
    color: 'from-purple-400 to-pink-500',
    bgColor: 'bg-purple-50 dark:bg-purple-900/10'
  },
  {
    id: 'adult',
    name: 'Adult',
    subtitle: 'Ages 18+',
    icon: '💼',
    questions: 30,
    color: 'from-orange-400 to-red-500',
    bgColor: 'bg-orange-50 dark:bg-orange-900/10'
  }
];

const DemographicView: React.FC<DemographicViewProps> = ({ onSelectDemographic, loading = false }) => {
  const [selected, setSelected] = useState<string | null>(null);

  const handleSelect = (id: string) => {
    setSelected(id);
  };

  const handleContinue = () => {
    if (selected) {
      onSelectDemographic(selected);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <QuizTopBar exitText="Demographics" />
      
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)] p-4">
      <div className="max-w-3xl w-full bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 md:p-12">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-gray-100 mb-3">
            Welcome! 👋
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-2">
            Let's personalize your career discovery experience
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Choose your education level to get started
          </p>
        </div>

        {/* Demographic Cards */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {DEMOGRAPHICS.map((demo) => (
            <motion.button
              key={demo.id}
              onClick={() => handleSelect(demo.id)}
              className={`
                relative p-6 rounded-2xl border-2 transition-all duration-300 text-left
                ${selected === demo.id
                  ? `${demo.bgColor} border-blue-500 shadow-lg scale-105`
                  : 'bg-white dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 hover:border-blue-300'
                }
              `}
              whileHover={{ scale: selected === demo.id ? 1.05 : 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Selection Indicator */}
              {selected === demo.id && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-3 right-3 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center"
                >
                  <span className="text-white text-xs">✓</span>
                </motion.div>
              )}

              {/* Icon */}
              <div className="text-5xl mb-3 text-center">{demo.icon}</div>

              {/* Text */}
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-1">
                  {demo.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {demo.subtitle}
                </p>
                <div className={`
                  inline-block px-3 py-1 rounded-full text-xs font-semibold
                  bg-gradient-to-r ${demo.color} text-white
                `}>
                  {demo.questions} Questions
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Continue Button */}
        <motion.button
          onClick={handleContinue}
          disabled={!selected || loading}
          className={`
            w-full py-4 rounded-xl font-bold text-lg transition-all duration-300
            ${!selected || loading
              ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg hover:shadow-xl hover:scale-105'
            }
          `}
          whileHover={selected && !loading ? { scale: 1.02 } : {}}
          whileTap={selected && !loading ? { scale: 0.98 } : {}}
        >
          {loading ? 'Loading...' : !selected ? 'Select Your Level' : 'Continue to Journey'}
        </motion.button>

        {/* Info Footer */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            This helps us customize the difficulty and number of questions for you
          </p>
        </div>
      </div>
      </div>
    </div>
  );
};

export default DemographicView;

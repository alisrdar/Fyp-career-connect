import React from 'react';
import Mascot from '../ui/Mascot';
import QuizTopBar from '@/components/dashboad/quiz/QuizTopbar';

type WelcomeViewProps = {
  onStart: () => void;
  loading: boolean;
};

const WelcomeView: React.FC<WelcomeViewProps> = ({ onStart, loading }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <QuizTopBar exitText="Quiz" />
      
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)] p-4">
        <div className="max-w-2xl w-full bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 sm:p-12 text-center space-y-6 sm:space-y-8">
          {/* Mascot */}
          <div className="flex justify-center">
            <Mascot state="idle" size={250} />
          </div>

          {/* Welcome Text */}
          <div className="space-y-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 dark:text-gray-100">
              Career Discovery Quiz
            </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Hi! I'm <span className="font-semibold text-blue-500">Leah</span>, your career guide.
          </p>
          <p className="text-lg text-gray-500 dark:text-gray-400">
            I'll ask you fun questions to discover your perfect career path. 
            Ready to find your dream job?
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 py-6">
          <div className="p-4">
            <div className="text-4xl mb-2">🎯</div>
            <h3 className="font-semibold text-gray-800 dark:text-gray-200">Personalized</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">AI-powered recommendations</p>
          </div>
          <div className="p-4">
            <div className="text-4xl mb-2">🎮</div>
            <h3 className="font-semibold text-gray-800 dark:text-gray-200">Gamified</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Earn XP and badges</p>
          </div>
          <div className="p-4">
            <div className="text-4xl mb-2">⚡</div>
            <h3 className="font-semibold text-gray-800 dark:text-gray-200">Fast</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">20-30 questions only</p>
          </div>
        </div>

        {/* Start Button */}
        <button
          onClick={onStart}
          disabled={loading}
          className="w-full py-5 px-8 bg-gradient-to-r from-blue-500 to-purple-500 
                   hover:from-blue-600 hover:to-purple-600 text-white text-xl font-bold 
                   rounded-xl shadow-lg transition-all duration-300 
                   hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed
                   disabled:hover:scale-100"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-3">
              <span className="animate-spin">⚙️</span>
              Loading...
            </span>
          ) : (
            "Let's Get Started! 🚀"
          )}
        </button>

        <p className="text-sm text-gray-400 dark:text-gray-500">
          Takes about 10-15 minutes • Progress auto-saves
        </p>
      </div>
      </div>
    </div>
  );
};

export default WelcomeView;

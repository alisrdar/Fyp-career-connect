import React from 'react';
import { useRouter } from 'next/navigation';
import Mascot from '../ui/Mascot';
import { Recommendation } from '@/app/quiz/types';

type ResultsViewProps = {
  results: Recommendation[] | null;
  xp: number;
  streak: number;
  onRetake?: () => void;
};

const ResultsView: React.FC<ResultsViewProps> = ({ results, xp, streak, onRetake }) => {
  const router = useRouter();
  const [showRetakeModal, setShowRetakeModal] = React.useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-4xl w-full bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-12 text-center space-y-8">
        {/* Mascot */}
        <div className="flex justify-center">
          <Mascot state="celebrate" size={200} />
        </div>

        {/* Success Message */}
        <div className="space-y-4">
          <h1 className="text-5xl font-bold text-gray-800 dark:text-gray-100">
            Amazing Work!
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            You've completed the Career Discovery Quiz!
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 py-6">
          <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-xl">
            <div className="text-4xl mb-2">⭐</div>
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">{xp}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total XP</div>
          </div>
          <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-xl">
            <div className="text-4xl mb-2">🔥</div>
            <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">{streak}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Max Streak</div>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-xl">
            <div className="text-4xl mb-2">✅</div>
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">100%</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Completed</div>
          </div>
        </div>

        {/* Results Preview */}
        {results && results.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
              Your Top Career Matches
            </h2>
            <div className="space-y-3">
              {results.slice(0, 3).map((career, index) => (
                <div
                  key={career.id || `career-${index}`}
                  className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-left flex items-center gap-4"
                >
                  <div className="text-3xl font-bold text-blue-500">#{index + 1}</div>
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                      {career.title}
                    </h3>
                    {career.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {career.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-6">
          <button
            onClick={() => router.push('/results')}
            className="flex-1 py-4 px-8 bg-gradient-to-r from-green-500 to-emerald-500 
                     hover:from-green-600 hover:to-emerald-600 text-white text-lg font-bold 
                     rounded-xl shadow-lg transition-all duration-300 hover:scale-105"
          >
            View AI Results
          </button>
          <button
            onClick={() => router.push('/dashboard/recommendations')}
            className="flex-1 py-4 px-8 bg-gradient-to-r from-blue-500 to-purple-500 
                     hover:from-blue-600 hover:to-purple-600 text-white text-lg font-bold 
                     rounded-xl shadow-lg transition-all duration-300 hover:scale-105"
          >
            View Personality Report
          </button>
          <button
            onClick={() => router.push('/dashboard')}
            className="flex-1 py-4 px-8 bg-gray-200 dark:bg-gray-700 
                     hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 
                     text-lg font-bold rounded-xl shadow-lg transition-all duration-300 hover:scale-105"
          >
            Go to Dashboard
          </button>
        </div>

        {/* Retake Quiz Button */}
        {onRetake && (
          <button
            onClick={() => setShowRetakeModal(true)}
            className="mt-4 py-3 px-6 border-2 border-orange-500 dark:border-orange-400 
                     hover:bg-orange-50 dark:hover:bg-orange-900/20 text-orange-600 dark:text-orange-400 
                     font-semibold rounded-xl transition-all duration-300 hover:scale-105"
          >
            🔄 Retake Quiz
          </button>
        )}
      </div>

      {/* Retake Confirmation Modal */}
      {showRetakeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
              Retake Quiz?
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to retake the quiz? This will reset all your progress and you'll start from the beginning.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowRetakeModal(false)}
                className="flex-1 py-3 px-6 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 
                         dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold 
                         rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowRetakeModal(false);
                  if (onRetake) {
                    onRetake();
                    router.push('/quiz');
                  }
                }}
                className="flex-1 py-3 px-6 bg-gradient-to-r from-orange-500 to-red-500 
                         hover:from-orange-600 hover:to-red-600 text-white font-semibold 
                         rounded-xl transition-all"
              >
                Yes, Retake
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultsView;

'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MatchCard from './MatchCard';
import SkillRadar from './SkillRadar';
import { Sparkles, TrendingUp, Save, MapPin } from 'lucide-react';

interface CareerRecommendation {
  career_title: string;
  match_score: number;
  salary_range?: string;
  job_outlook?: string;
  description?: string;
  skills_matched?: string[];
  personality_alignment?: {
    analytical: number;
    creative: number;
    social: number;
    independent: number;
    structured: number;
    flexible: number;
  };
  reasoning?: string;
}

interface RecommendationData {
  top_recommendation: CareerRecommendation;
  alternative_careers: CareerRecommendation[];
  user_profile?: {
    dominant_traits?: string[];
    skill_strengths?: string[];
  };
}

interface ResultsViewProps {
  initialData: RecommendationData;
}

export default function ResultsView({ initialData }: ResultsViewProps) {
  const [showHero, setShowHero] = useState(false);
  const [showAlternatives, setShowAlternatives] = useState(false);
  const [selectedCareer, setSelectedCareer] = useState<CareerRecommendation | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    // Staggered reveal animation
    setTimeout(() => setShowHero(true), 500);
    setTimeout(() => setShowAlternatives(true), 1200);
  }, []);

  const handleSaveResults = async () => {
    try {
      // Save to database via API
      const response = await fetch('/api/results/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          recommendations: initialData,
          timestamp: new Date().toISOString()
        })
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        // Also save to localStorage as backup
        localStorage.setItem('career_results', JSON.stringify({
          timestamp: new Date().toISOString(),
          recommendations: initialData
        }));
        
        setIsSaved(true);
        
        // Reset after 3 seconds
        setTimeout(() => setIsSaved(false), 3000);
      } else {
        throw new Error(data.error || 'Failed to save results');
      }
    } catch (error) {
      console.error('Failed to save results:', error);
      
      // Fallback to localStorage only
      try {
        localStorage.setItem('career_results', JSON.stringify({
          timestamp: new Date().toISOString(),
          recommendations: initialData
        }));
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000);
      } catch (storageError) {
        alert('Failed to save results. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pb-32">
      {/* Header - The Hook */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="pt-12 pb-8 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="inline-block mb-4"
        >
          <div className="bg-gradient-to-r from-green-400 to-emerald-500 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            <span className="font-semibold">Analysis Complete!</span>
            <Sparkles className="w-5 h-5" />
          </div>
        </motion.div>
        
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-3">
          Your Career Matches
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-4">
          Based on your personality, skills, and preferences, we've found the perfect career paths for you!
        </p>
      </motion.div>

      {/* Hero Match - The Top Pick */}
      <AnimatePresence>
        {showHero && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, type: 'spring' }}
            className="container mx-auto px-4 mb-12"
          >
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-center mb-4"
              >
                <div className="inline-flex items-center gap-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 px-4 py-2 rounded-full">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm font-medium">Top Match</span>
                </div>
              </motion.div>

              <MatchCard
                career={initialData.top_recommendation}
                isHero={true}
                onClick={() => setSelectedCareer(initialData.top_recommendation)}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Skill Breakdown */}
      {showHero && initialData.top_recommendation.personality_alignment && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="container mx-auto px-4 mb-12"
        >
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              Why This Match?
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* Skill Chips */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Matching Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {initialData.top_recommendation.skills_matched?.map((skill, idx) => (
                    <motion.span
                      key={idx}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.9 + idx * 0.1 }}
                      className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full text-sm font-medium shadow-md"
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
                
                {initialData.top_recommendation.reasoning && (
                  <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">
                    {initialData.top_recommendation.reasoning}
                  </p>
                )}
              </div>

              {/* Personality Radar */}
              <SkillRadar 
                alignment={initialData.top_recommendation.personality_alignment} 
              />
            </div>
          </div>
        </motion.div>
      )}

      {/* Alternative Careers */}
      <AnimatePresence>
        {showAlternatives && initialData.alternative_careers.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="container mx-auto px-4 mb-16"
          >
            <div className="max-w-6xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                Other Great Matches
              </h2>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {initialData.alternative_careers.map((career, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.15 }}
                  >
                    <MatchCard
                      career={career}
                      isHero={false}
                      onClick={() => setSelectedCareer(career)}
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sticky Footer with Mascot */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ delay: 1.5, type: 'spring', stiffness: 100 }}
        className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-2xl z-50"
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between max-w-6xl mx-auto">
            {/* Mascot */}
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ 
                  rotate: [0, -10, 10, -10, 0],
                }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 2,
                  ease: "easeInOut" 
                }}
                className="w-16 h-16 bg-gradient-to-br from-purple-400 to-indigo-600 rounded-full flex items-center justify-center text-3xl shadow-lg"
              >
                🎓
              </motion.div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">
                  Great job completing the quiz!
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  - Micah, your career guide
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={handleSaveResults}
                disabled={isSaved}
                className={`px-6 py-3 ${
                  isSaved 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:shadow-xl hover:scale-105'
                } text-white rounded-lg font-medium shadow-lg transition-all duration-200 flex items-center gap-2`}
              >
                <Save className="w-5 h-5" />
                {isSaved ? 'Saved!' : 'Save Results'}
              </button>
              <button
                onClick={() => window.location.href = '/dashboard/recommendations'}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 flex items-center gap-2"
              >
                <MapPin className="w-5 h-5" />
                Full Report
              </button>
              <button
                onClick={() => window.location.href = '/dashboard'}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 flex items-center gap-2"
              >
                Dashboard
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Career Detail Modal */}
      <AnimatePresence>
        {selectedCareer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedCareer(null)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-8"
            >
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                {selectedCareer.career_title}
              </h2>
              
              {selectedCareer.description && (
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  {selectedCareer.description}
                </p>
              )}

              <div className="grid gap-4">
                {selectedCareer.salary_range && (
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Salary Range</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {selectedCareer.salary_range}
                    </p>
                  </div>
                )}

                {selectedCareer.job_outlook && (
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Job Outlook</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {selectedCareer.job_outlook}
                    </p>
                  </div>
                )}
              </div>

              <button
                onClick={() => setSelectedCareer(null)}
                className="mt-6 w-full px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

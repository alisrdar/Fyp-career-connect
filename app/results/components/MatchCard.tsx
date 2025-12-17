'use client';

import { motion } from 'framer-motion';
import { TrendingUp, DollarSign, Briefcase, ChevronRight } from 'lucide-react';
import { formatRIASECDescription } from '@/lib/riasecUtils';

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

interface MatchCardProps {
  career: CareerRecommendation;
  isHero: boolean;
  onClick: () => void;
}

// Career icon mapping
const getCareerIcon = (title: string): string => {
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes('data') || lowerTitle.includes('scientist')) return '📊';
  if (lowerTitle.includes('developer') || lowerTitle.includes('engineer')) return '💻';
  if (lowerTitle.includes('design')) return '🎨';
  if (lowerTitle.includes('marketing')) return '📱';
  if (lowerTitle.includes('business') || lowerTitle.includes('manager')) return '💼';
  if (lowerTitle.includes('teacher') || lowerTitle.includes('education')) return '👨‍🏫';
  if (lowerTitle.includes('health') || lowerTitle.includes('doctor')) return '⚕️';
  if (lowerTitle.includes('writer')) return '✍️';
  if (lowerTitle.includes('finance')) return '💰';
  return '🎯';
};

// Match score color
const getMatchColor = (score: number) => {
  if (score >= 90) return 'from-green-500 to-emerald-600';
  if (score >= 75) return 'from-blue-500 to-indigo-600';
  if (score >= 60) return 'from-yellow-500 to-orange-600';
  return 'from-gray-500 to-gray-600';
};

export default function MatchCard({ career, isHero, onClick }: MatchCardProps) {
  const matchScore = Math.round(career.match_score * 100);
  const gradientColor = getMatchColor(matchScore);

  if (isHero) {
    return (
      <motion.div
        whileHover={{ scale: 1.02, y: -5 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden cursor-pointer group"
      >
        {/* Holographic shine effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Glow effect */}
        <div className={`absolute -inset-1 bg-gradient-to-r ${gradientColor} opacity-20 blur-xl group-hover:opacity-40 transition-opacity duration-500`} />

        <div className="relative p-8 md:p-12">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
                className="text-6xl mb-4"
              >
                {getCareerIcon(career.career_title)}
              </motion.div>
              
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                {career.career_title}
              </h3>
              
              {career.description && (
                <p className="text-gray-600 dark:text-gray-300 text-lg line-clamp-2">
                  {formatRIASECDescription(career.description)}
                </p>
              )}
            </div>

            {/* Match Score Ring */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
              className="relative ml-6"
            >
              <svg className="w-32 h-32 transform -rotate-90">
                {/* Background circle */}
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-gray-200 dark:text-gray-700"
                />
                {/* Progress circle */}
                <motion.circle
                  cx="64"
                  cy="64"
                  r="56"
                  fill="none"
                  stroke="url(#gradient)"
                  strokeWidth="8"
                  strokeLinecap="round"
                  initial={{ strokeDasharray: '0 351.858' }}
                  animate={{ strokeDasharray: `${(matchScore / 100) * 351.858} 351.858` }}
                  transition={{ delay: 0.6, duration: 1, ease: 'easeOut' }}
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#10B981" />
                    <stop offset="100%" stopColor="#059669" />
                  </linearGradient>
                </defs>
              </svg>
              
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-gray-900 dark:text-white">
                  {matchScore}%
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">Match</span>
              </div>
            </motion.div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {career.salary_range && (
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-4">
                <div className="flex items-center gap-2 text-green-700 dark:text-green-400 mb-1">
                  <DollarSign className="w-4 h-4" />
                  <span className="text-sm font-medium">Salary Range</span>
                </div>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {career.salary_range}
                </p>
              </div>
            )}

            {career.job_outlook && (
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-4">
                <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400 mb-1">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm font-medium">Job Outlook</span>
                </div>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {career.job_outlook}
                </p>
              </div>
            )}
          </div>

          {/* Skills Preview */}
          {career.skills_matched && career.skills_matched.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {career.skills_matched.slice(0, 4).map((skill, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium"
                >
                  {formatRIASECDescription(skill)}
                </span>
              ))}
              {career.skills_matched.length > 4 && (
                <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-sm font-medium">
                  +{career.skills_matched.length - 4} more
                </span>
              )}
            </div>
          )}

          {/* Call to Action */}
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-medium group-hover:gap-4 transition-all">
            <span>View Career Details</span>
            <ChevronRight className="w-5 h-5" />
          </div>
        </div>
      </motion.div>
    );
  }

  // Alternative card (smaller version)
  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden cursor-pointer group hover:shadow-2xl transition-shadow duration-300"
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="text-4xl">
            {getCareerIcon(career.career_title)}
          </div>
          
          {/* Match Badge */}
          <div className={`px-3 py-1 bg-gradient-to-r ${gradientColor} text-white rounded-full text-sm font-bold shadow-md`}>
            {matchScore}%
          </div>
        </div>

        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-1">
          {career.career_title}
        </h3>

        {career.description && (
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
            {formatRIASECDescription(career.description)}
          </p>
        )}

        {/* Quick Info */}
        <div className="space-y-2 mb-4">
          {career.salary_range && (
            <div className="flex items-center gap-2 text-sm">
              <DollarSign className="w-4 h-4 text-green-600 dark:text-green-400" />
              <span className="text-gray-700 dark:text-gray-300">{career.salary_range}</span>
            </div>
          )}
          
          {career.job_outlook && (
            <div className="flex items-center gap-2 text-sm">
              <Briefcase className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-gray-700 dark:text-gray-300">{career.job_outlook}</span>
            </div>
          )}
        </div>

        {/* Skills */}
        {career.skills_matched && career.skills_matched.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {career.skills_matched.slice(0, 2).map((skill, idx) => (
              <span
                key={idx}
                className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded text-xs font-medium"
              >
                {formatRIASECDescription(skill)}
              </span>
            ))}
            {career.skills_matched.length > 2 && (
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded text-xs">
                +{career.skills_matched.length - 2}
              </span>
            )}
          </div>
        )}

        {/* Learn More */}
        <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400 text-sm font-medium group-hover:gap-2 transition-all">
          <span>Learn More</span>
          <ChevronRight className="w-4 h-4" />
        </div>
      </div>
    </motion.div>
  );
}

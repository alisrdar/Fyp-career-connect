'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getRecentActivities } from '@/helpers/activityLogger';
import { 
  Flame, 
  Trophy, 
  Star, 
  Zap, 
  FileText, 
  CheckCircle, 
  User, 
  PlayCircle,
  ArrowRight,
  Award,
  BookOpen,
  Map,
  X
} from 'lucide-react';

export default function PlayerHQ() {
  const { user } = useAuth();
  const router = useRouter();
  const [quizProgress, setQuizProgress] = useState(null);
  const [streak, setStreak] = useState(0);
  const [recentActivities, setRecentActivities] = useState([]);
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Load activities
  useEffect(() => {
    if (user) {
      const activities = getRecentActivities(user._id, 5);
      
      // Seed initial activities if empty (one-time only)
      if (activities.length === 0 && !localStorage.getItem('activitiesSeeded_' + user._id)) {
        const { logActivity, ActivityTypes } = require('@/helpers/activityLogger');
        logActivity(user._id, ActivityTypes.LOGIN);
        localStorage.setItem('activitiesSeeded_' + user._id, 'true');
        // Reload activities after seeding
        setRecentActivities(getRecentActivities(user._id, 5));
      } else {
        setRecentActivities(activities);
      }
    }
  }, [user]);

  useEffect(() => {
    // Load quiz progress from localStorage
    if (user) {
      const savedProgress = localStorage.getItem('quizProgress');
      if (savedProgress) {
        const progress = JSON.parse(savedProgress);
        if (progress.userId === user._id) {
          setQuizProgress(progress);
          setStreak(progress.streak || 0);
        }
      }
    }
  }, [user]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    show: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 12
      }
    }
  };

  // Mock data
  const assessmentScore = quizProgress?.questionCount 
    ? Math.min((quizProgress.questionCount / 30) * 100, 100) 
    : 0;
  const currentStage = quizProgress?.currentStageId || 1;
  const stageNames = { 1: 'Warm Up', 2: 'Deep Dive', 3: 'Final Analysis' };
  const stageName = stageNames[currentStage] || 'Not Started';
  const stageProgress = quizProgress?.questionCount 
    ? ((quizProgress.questionCount % 10) / 10) * 100 
    : 0;

  // Get icon and color for activity type
  const getActivityIconAndColor = (iconName) => {
    const iconMap = {
      CheckCircle: { icon: CheckCircle, color: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' },
      User: { icon: User, color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' },
      PlayCircle: { icon: PlayCircle, color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' },
      FileText: { icon: FileText, color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400' },
      BookOpen: { icon: BookOpen, color: 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400' },
      Trophy: { icon: Trophy, color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400' }
    };
    return iconMap[iconName] || iconMap.CheckCircle;
  };

  // Format timestamp
  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const then = new Date(timestamp);
    const diffMs = now - then;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return then.toLocaleDateString();
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-400">Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark p-3 sm:p-4 md:p-6 lg:p-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 auto-rows-auto"
      >
        {/* HERO WELCOME CARD - Mobile vs Desktop Conditional Rendering */}
        <motion.div
          variants={itemVariants}
          whileHover={{ scale: isMobile ? 1 : 1.02, y: isMobile ? 0 : -5 }}
          whileTap={{ scale: 0.98 }}
          className="md:col-span-2 bg-white dark:bg-surface rounded-xl sm:rounded-2xl shadow-xl dark:shadow-black/20 p-5 sm:p-6 md:p-8 cursor-pointer overflow-hidden relative border border-transparent dark:border-border"
        >
          {isMobile ? (
            // MOBILE LAYOUT
            <div className="space-y-4">
              {/* Header with Avatar */}
              <div className="flex items-center gap-3">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                >
                  {user?.avatarUrl ? (
                    <div className="w-16 h-16 rounded-full overflow-hidden ring-4 ring-primary/20 shadow-lg">
                      <img 
                        src={user.avatarUrl} 
                        alt={user?.name || 'User'} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-2xl ring-4 ring-primary/20 shadow-lg">
                      {user?.name?.charAt(0).toUpperCase() || '🤖'}
                    </div>
                  )}
                </motion.div>
                <div className="flex-1">
                  <motion.h1 
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-lg font-bold text-foreground-light dark:text-foreground-dark mb-0.5"
                    style={{ fontFamily: 'Poppins, sans-serif' }}
                  >
                    Welcome back,
                  </motion.h1>
                  <p className="text-xl font-extrabold text-primary dark:text-secondary" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    {user?.name?.split(' ')[0] || 'Explorer'}!
                  </p>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-600 dark:text-gray-400" style={{ fontFamily: 'Inter, sans-serif' }}>
                Ready to level up your career journey?
              </p>
              
              {/* Daily Streak */}
              {streak > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.5 }}
                  className="inline-flex items-center gap-2 bg-orange-100 dark:bg-orange-900/30 px-4 py-2 rounded-full"
                >
                  <motion.div
                    animate={{ 
                      scale: [1, 1.2, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      repeatType: 'reverse'
                    }}
                  >
                    <Flame className="w-5 h-5 text-orange-500" />
                  </motion.div>
                  <span className="text-base font-semibold text-orange-600 dark:text-orange-400" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    {streak} Day Streak!
                  </span>
                </motion.div>
              )}
            </div>
          ) : (
            // DESKTOP LAYOUT
            <div className="flex items-center justify-between gap-3">
              <div className="flex-1 min-w-0">
                <motion.h1 
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-2xl md:text-3xl font-bold text-foreground-light dark:text-foreground-dark mb-2 truncate"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  Welcome back, {user?.name?.split(' ')[0] || 'Explorer'}!
                </motion.h1>
                <p className="text-base text-gray-600 dark:text-gray-400 mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Ready to level up your career journey?
                </p>
                
                {/* Daily Streak */}
                {streak > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', delay: 0.5 }}
                    className="inline-flex items-center gap-2 bg-orange-100 dark:bg-orange-900/30 px-4 py-2 rounded-full"
                  >
                    <motion.div
                      animate={{ 
                        scale: [1, 1.2, 1],
                        rotate: [0, 5, -5, 0]
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        repeatType: 'reverse'
                      }}
                    >
                      <Flame className="w-5 h-5 text-orange-500" />
                    </motion.div>
                    <span className="font-semibold text-orange-600 dark:text-orange-400" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      {streak} Day Streak!
                    </span>
                  </motion.div>
                )}
              </div>

              {/* User Avatar */}
              <motion.div
                initial={{ rotate: -10, scale: 0.8 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.4 }}
              >
                {user?.avatarUrl ? (
                  <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-primary/20">
                    <img 
                      src={user.avatarUrl} 
                      alt={user?.name || 'User'} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-4xl ring-4 ring-primary/20">
                    {user?.name?.charAt(0).toUpperCase() || '🤖'}
                  </div>
                )}
              </motion.div>
            </div>
          )}
        </motion.div>

        {/* SURVEY CARD - Conditional Mobile/Desktop */}
        <motion.div
          variants={itemVariants}
          whileHover={{ scale: isMobile ? 1 : 1.02, y: isMobile ? 0 : -5 }}
          whileTap={{ scale: 0.98 }}
          className="md:col-span-2 bg-white dark:bg-surface rounded-xl sm:rounded-2xl shadow-xl dark:shadow-black/20 p-5 sm:p-6 cursor-pointer border border-transparent dark:border-border overflow-hidden relative"
          onClick={() => router.push('/survey')}
        >
          {isMobile ? (
            // MOBILE COMPACT LAYOUT
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-primary dark:text-secondary px-3 py-1 bg-primary/10 dark:bg-primary/20 rounded-full">
                  STEP 2
                </span>
                <div className="w-12 h-12 bg-accent dark:bg-primary/20 rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-primary dark:text-secondary" />
                </div>
              </div>
              <h3 className="text-base font-bold text-foreground-light dark:text-foreground-dark" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Career Personality Survey
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400" style={{ fontFamily: 'Inter, sans-serif' }}>
                Complete this survey to help us understand your personality.
              </p>
              <div className="flex items-center justify-end">
                <ArrowRight className="w-5 h-5 text-primary dark:text-secondary" />
              </div>
            </div>
          ) : (
            // DESKTOP LAYOUT
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-accent dark:bg-primary/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <FileText className="w-10 h-10 text-primary dark:text-secondary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold text-primary dark:text-secondary px-2 py-1 bg-primary/10 dark:bg-primary/20 rounded-full">
                    STEP 2
                  </span>
                </div>
                <h3 className="text-lg font-bold text-foreground-light dark:text-foreground-dark mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Career Personality Survey
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Complete this survey to help us understand your personality traits and preferences.
                </p>
              </div>
              <ArrowRight className="w-6 h-6 text-primary dark:text-secondary flex-shrink-0" />
            </div>
          )}
        </motion.div>

        {/* NEXT QUEST CARD - Spans 2 cols */}
        <motion.div
          variants={itemVariants}
          whileHover={{ scale: isMobile ? 1 : 1.02, y: isMobile ? 0 : -5 }}
          whileTap={{ scale: 0.98 }}
          className="md:col-span-2 bg-gradient-to-br from-primary to-secondary rounded-xl sm:rounded-2xl shadow-xl dark:shadow-black/30 p-6 sm:p-6 md:p-8 cursor-pointer relative overflow-hidden"
          onClick={() => router.push('/quiz')}
        >
          {/* Animated shimmer background */}
          <motion.div
            className="absolute inset-0 opacity-30"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
              backgroundSize: '200% 100%'
            }}
            animate={{
              backgroundPosition: ['200% 0', '-200% 0']
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'linear'
            }}
          />

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Next Quest
              </h2>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              >
                <Star className="w-5 h-5 sm:w-6 sm:h-6 text-white fill-white" />
              </motion.div>
            </div>

            <p className="text-white/90 text-base sm:text-lg mb-3 sm:mb-4 font-semibold">
              Continue: {stageName}
            </p>

            {/* Progress Bar */}
            <div className="mb-4 sm:mb-6">
              <div className="w-full h-2.5 sm:h-3 bg-white/30 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${stageProgress}%` }}
                  transition={{ duration: 1, ease: 'easeOut', delay: 0.5 }}
                  className="h-full bg-white rounded-full shadow-lg"
                />
              </div>
              <p className="text-white/80 text-xs sm:text-sm mt-1.5 sm:mt-2">
                {Math.round(stageProgress)}% Complete
              </p>
            </div>

            {/* CTA Button */}
            <motion.button
              onClick={() => router.push('/quiz')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full md:w-auto bg-white text-primary font-bold py-3 px-6 rounded-full shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center gap-2"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              {quizProgress ? 'Resume Quiz' : 'Start Quiz'}
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </div>
        </motion.div>

        {/* QUICK STATS ROW - 3 Cards */}
        
        {/* Card A: Assessment Score */}
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -5, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}
          whileTap={{ scale: 0.98 }}
          className="bg-white dark:bg-surface rounded-xl sm:rounded-2xl shadow-xl dark:shadow-black/20 p-4 sm:p-6 cursor-pointer border border-transparent dark:border-border"
        >
          <div className="flex flex-col items-center">
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 mb-2 sm:mb-3">
              {/* SVG Circular Progress */}
              <svg className="transform -rotate-90 w-20 h-20 sm:w-24 sm:h-24">
                <circle
                  cx="40"
                  cy="40"
                  r="34"
                  stroke="currentColor"
                  strokeWidth="6"
                  fill="transparent"
                  className="text-gray-200 dark:text-muted sm:hidden"
                />
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-gray-200 dark:text-muted hidden sm:block"
                />
                <motion.circle
                  cx="40"
                  cy="40"
                  r="34"
                  stroke="url(#gradient)"
                  strokeWidth="6"
                  fill="transparent"
                  strokeDasharray={`${2 * Math.PI * 34}`}
                  initial={{ strokeDashoffset: 2 * Math.PI * 34 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 34 * (1 - assessmentScore / 100) }}
                  transition={{ duration: 1.5, ease: 'easeOut', delay: 0.5 }}
                  strokeLinecap="round"
                  className="sm:hidden"
                />
                <motion.circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="url(#gradient)"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  initial={{ strokeDashoffset: 2 * Math.PI * 40 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 40 * (1 - assessmentScore / 100) }}
                  transition={{ duration: 1.5, ease: 'easeOut', delay: 0.5 }}
                  strokeLinecap="round"
                  className="hidden sm:block"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#146C94" />
                    <stop offset="100%" stopColor="#9bd7f1" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xl sm:text-2xl font-bold text-foreground-light dark:text-foreground-dark" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  {Math.round(assessmentScore)}%
                </span>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-semibold text-center" style={{ fontFamily: 'Inter, sans-serif' }}>
              Assessment Score
            </p>
          </div>
        </motion.div>

        {/* Card B: Badges */}
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -5, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}
          whileTap={{ scale: 0.98 }}
          className="bg-white dark:bg-surface rounded-xl sm:rounded-2xl shadow-xl dark:shadow-black/20 p-4 sm:p-6 cursor-pointer border border-transparent dark:border-border"
        >
          <div className="flex flex-col items-center">
            <div className="flex gap-2 sm:gap-3 mb-2 sm:mb-3">
              <motion.div
                whileHover={{ scale: 1.2, rotate: 10 }}
                className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg sm:rounded-xl flex items-center justify-center"
              >
                <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.2, rotate: -10 }}
                className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-primary to-secondary rounded-lg sm:rounded-xl flex items-center justify-center"
              >
                <Star className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.2, rotate: 10 }}
                className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg sm:rounded-xl flex items-center justify-center"
              >
                <Award className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </motion.div>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-semibold text-center" style={{ fontFamily: 'Inter, sans-serif' }}>
              Badges Earned
            </p>
          </div>
        </motion.div>

        {/* Card C: Career Resources Hub */}
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -5, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}
          whileTap={{ scale: 0.98 }}
          className="bg-gradient-to-br from-accent to-primary/40 dark:from-primary/20 dark:to-secondary/20 rounded-xl sm:rounded-2xl shadow-xl dark:shadow-black/20 p-4 sm:p-6 cursor-pointer border border-transparent dark:border-border"
          onClick={() => router.push('/resources')}
        >
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white dark:bg-surface rounded-xl sm:rounded-2xl flex items-center justify-center mb-2 sm:mb-3 shadow-lg">
              <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-primary dark:text-secondary" />
            </div>
            <p className="text-xs sm:text-sm font-bold text-foreground-light dark:text-foreground-dark mb-0.5 sm:mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Career Resources
            </p>
            <p className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400" style={{ fontFamily: 'Inter, sans-serif' }}>
              Articles, Videos & More
            </p>
          </div>
        </motion.div>

        {/* Activity Guide Card */}
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -5, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}
          whileTap={{ scale: 0.98 }}
          className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 dark:from-purple-600/20 dark:to-pink-600/20 rounded-xl sm:rounded-2xl shadow-xl dark:shadow-black/20 p-4 sm:p-6 cursor-pointer border border-purple-200 dark:border-purple-800/30"
          onClick={() => setShowGuideModal(true)}
        >
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl sm:rounded-2xl flex items-center justify-center mb-2 sm:mb-3 shadow-lg">
              <Map className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <p className="text-xs sm:text-sm font-bold text-foreground-light dark:text-foreground-dark mb-0.5 sm:mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Activity Guide
            </p>
            <p className="text-[10px] sm:text-xs text-purple-600 dark:text-purple-400" style={{ fontFamily: 'Inter, sans-serif' }}>
              See What's Tracked
            </p>
          </div>
        </motion.div>

        {/* RECENT ACTIVITY - Full width on mobile, 2 cols on larger */}
        <motion.div
          variants={itemVariants}
          className="md:col-span-3 lg:col-span-2 bg-white dark:bg-surface rounded-xl sm:rounded-2xl shadow-xl dark:shadow-black/20 p-4 sm:p-6 border border-transparent dark:border-border"
        >
          <h3 className="text-base sm:text-lg font-bold text-foreground-light dark:text-foreground-dark mb-3 sm:mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Recent Activity
          </h3>
          {recentActivities.length > 0 ? (
            <div className="space-y-3">
              {recentActivities.map((activity, index) => {
                const { icon: IconComponent, color } = getActivityIconAndColor(activity.icon);
                return (
                  <motion.div
                    key={activity.id}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-less-dark transition-colors"
                  >
                    <div className={`w-10 h-10 ${color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-foreground-light dark:text-foreground-dark" style={{ fontFamily: 'Inter, sans-serif' }}>
                        {activity.action}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {formatTimestamp(activity.timestamp)}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-400 dark:text-gray-500" style={{ fontFamily: 'Inter, sans-serif' }}>
                No recent activity yet. Start exploring!
              </p>
            </div>
          )}
        </motion.div>

        {/* XP CARD - Additional gamification */}
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -5, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}
          className="md:col-span-3 lg:col-span-2 bg-gradient-to-br from-primary via-darkblue to-secondary rounded-xl sm:rounded-2xl shadow-xl dark:shadow-black/30 p-5 sm:p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-xs sm:text-sm mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                Total Experience
              </p>
              <motion.p
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.7 }}
                className="text-3xl sm:text-4xl font-bold text-white"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                {quizProgress?.xp || 0} XP
              </motion.p>
            </div>
            <motion.div
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatType: 'reverse'
              }}
              className="text-5xl sm:text-6xl"
            >
              ⚡
            </motion.div>
          </div>
        </motion.div>
      </motion.div>

      {/* Activity Guide Modal */}
      <AnimatePresence>
        {showGuideModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowGuideModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-white dark:bg-surface rounded-3xl shadow-2xl dark:shadow-black/40 p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-transparent dark:border-border"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <Map className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-foreground-light dark:text-foreground-dark" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      Activity Guide
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400" style={{ fontFamily: 'Inter, sans-serif' }}>
                      Track your progress across the platform
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowGuideModal(false)}
                  className="w-10 h-10 rounded-xl hover:bg-gray-100 dark:hover:bg-less-dark flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </button>
              </div>

              {/* Activities List */}
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/30">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400 rounded-xl flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-foreground-light dark:text-foreground-dark mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>Complete Career Quiz</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400" style={{ fontFamily: 'Inter, sans-serif' }}>Finish all quiz stages to get career recommendations</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800/30">
                  <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400 rounded-xl flex items-center justify-center flex-shrink-0">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-foreground-light dark:text-foreground-dark mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>Take Personality Survey</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400" style={{ fontFamily: 'Inter, sans-serif' }}>Answer personality questions to refine your profile</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-cyan-50 dark:bg-cyan-900/20 border border-cyan-200 dark:border-cyan-800/30">
                  <div className="w-12 h-12 bg-cyan-100 dark:bg-cyan-900/40 text-cyan-600 dark:text-cyan-400 rounded-xl flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-foreground-light dark:text-foreground-dark mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>Explore Resources</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400" style={{ fontFamily: 'Inter, sans-serif' }}>Browse career articles, videos, and learning materials</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/30">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center flex-shrink-0">
                    <User className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-foreground-light dark:text-foreground-dark mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>Update Your Profile</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400" style={{ fontFamily: 'Inter, sans-serif' }}>Add profile picture, bio, and personal information</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800/30">
                  <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/40 text-yellow-600 dark:text-yellow-400 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Trophy className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-foreground-light dark:text-foreground-dark mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>Unlock Achievements</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400" style={{ fontFamily: 'Inter, sans-serif' }}>Earn badges and rewards for completing milestones</p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-6 p-4 bg-gradient-to-r from-primary/10 to-secondary/10 dark:from-primary/20 dark:to-secondary/20 rounded-xl border border-primary/20 dark:border-primary/30">
                <p className="text-sm text-center text-gray-700 dark:text-gray-300" style={{ fontFamily: 'Inter, sans-serif' }}>
                  💡 <strong>Tip:</strong> All these activities are automatically tracked and displayed in your Recent Activity feed!
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

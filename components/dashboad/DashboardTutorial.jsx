'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, ArrowLeft, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';

const tutorialSteps = [
  {
    id: 'welcome',
    title: 'Welcome to Your Career Dashboard! 🎉',
    description: 'Let me show you around and help you get started on your career journey. This quick tour will take less than a minute!',
    target: null,
    position: 'center',
    highlightCard: null
  },
  {
    id: 'quiz-card',
    title: 'Start Your Career Quiz',
    description: 'Begin here! Take our interactive career assessment quiz to discover your strengths, interests, and ideal career paths. Complete all 3 stages to unlock personalized recommendations.',
    target: 'next-quest-card',
    position: 'bottom',
    highlightCard: 'next-quest-card',
    icon: '🎯'
  },
  {
    id: 'survey-card',
    title: 'Personality Survey',
    description: 'Complete the personality survey to help us understand your traits, preferences, and work style. This refines your career recommendations.',
    target: 'survey-card',
    position: 'bottom',
    highlightCard: 'survey-card',
    icon: '📝'
  },
  {
    id: 'assessment-score',
    title: 'Track Your Progress',
    description: 'Monitor your completion percentage here. As you complete quizzes and surveys, your assessment score increases!',
    target: 'assessment-card',
    position: 'bottom',
    highlightCard: 'assessment-card',
    icon: '📊'
  },
  {
    id: 'badges',
    title: 'Earn Achievements',
    description: 'Unlock badges and rewards as you hit milestones. Collect trophies, stars, and special achievements throughout your journey!',
    target: 'badges-card',
    position: 'bottom',
    highlightCard: 'badges-card',
    icon: '🏆'
  },
  {
    id: 'resources',
    title: 'Explore Career Resources',
    description: 'Access a library of career articles, videos, guides, and learning materials. Browse by category or search for specific topics.',
    target: 'resources-card',
    position: 'bottom',
    highlightCard: 'resources-card',
    icon: '📚'
  },
  {
    id: 'activity',
    title: 'Your Recent Activity',
    description: 'See a timeline of your recent actions and progress. All your logins, quiz completions, and resource views are tracked here.',
    target: 'activity-card',
    position: 'top',
    highlightCard: 'activity-card',
    icon: '📋'
  },
  {
    id: 'guide',
    title: 'Need Help? Click Here!',
    description: 'You can always replay this tutorial by clicking the "Activity Guide" card. It shows all tracked activities and lets you restart the tour anytime.',
    target: 'guide-card',
    position: 'bottom',
    highlightCard: 'guide-card',
    icon: '🗺️'
  }
];

export default function DashboardTutorial({ onComplete, onSkip }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [cardPosition, setCardPosition] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  // Update card position when step changes
  useEffect(() => {
    const step = tutorialSteps[currentStep];
    if (step.target) {
      const updatePosition = () => {
        const element = document.getElementById(step.target);
        if (element) {
          const rect = element.getBoundingClientRect();
          setCardPosition({
            top: rect.top + window.scrollY,
            left: rect.left + window.scrollX,
            width: rect.width,
            height: rect.height
          });
          
          // Only scroll if card is not in viewport
          const isInViewport = rect.top >= 0 && rect.bottom <= window.innerHeight;
          if (!isInViewport) {
            element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
        }
      };

      setTimeout(updatePosition, 100);
      window.addEventListener('resize', updatePosition);
      
      return () => {
        window.removeEventListener('resize', updatePosition);
      };
    } else {
      setCardPosition(null);
    }
  }, [currentStep]);

  const step = tutorialSteps[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === tutorialSteps.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      handleComplete();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (!isFirstStep) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSkip = () => {
    setIsVisible(false);
    setTimeout(() => onSkip(), 300);
  };

  const handleComplete = () => {
    setIsVisible(false);
    setTimeout(() => onComplete(), 300);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/70 pointer-events-none"
          />

          {/* Highlight ring around target card */}
          {step.highlightCard && cardPosition && (
            <motion.div
              key={`highlight-${currentStep}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="fixed z-[101] pointer-events-none"
              style={{
                top: `${cardPosition.top - 8}px`,
                left: `${cardPosition.left - 8}px`,
                width: `${cardPosition.width + 16}px`,
                height: `${cardPosition.height + 16}px`,
                border: '3px solid #146C94',
                borderRadius: '1.5rem',
                boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.7), 0 0 30px rgba(20, 108, 148, 0.6)',
              }}
            >
              <motion.div
                animate={{
                  scale: [1, 1.05, 1],
                  opacity: [0.5, 0.8, 0.5]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
                className="absolute inset-0 border-4 border-primary rounded-[1.5rem]"
              />
            </motion.div>
          )}

          {/* Tutorial Card/Tooltip */}
          <motion.div
            key={`tooltip-${currentStep}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed z-[102] pointer-events-auto"
            style={
              step.position === 'center'
                ? {
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    maxWidth: '400px'
                  }
                : {
                    top: '50%',
                    right: '20px',
                    transform: 'translateY(-50%)',
                    maxWidth: '400px',
                    width: '400px'
                  }
            }
          >
            <div className="bg-white dark:bg-surface rounded-2xl shadow-2xl dark:shadow-black/40 p-6 border-2 border-primary dark:border-secondary max-w-md mx-4">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3 flex-1">
                  {step.icon && (
                    <div className="text-3xl">{step.icon}</div>
                  )}
                  {isFirstStep && (
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Sparkles className="w-6 h-6 text-primary" />
                    </motion.div>
                  )}
                  <h3 className="text-lg font-bold text-foreground-light dark:text-foreground-dark" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    {step.title}
                  </h3>
                </div>
                <button
                  onClick={handleSkip}
                  className="w-8 h-8 rounded-lg hover:bg-gray-100 dark:hover:bg-less-dark flex items-center justify-center transition-colors flex-shrink-0"
                  aria-label="Skip tutorial"
                >
                  <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </button>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
                {step.description}
              </p>

              {/* Progress Dots */}
              <div className="flex items-center justify-center gap-2 mb-6">
                {tutorialSteps.map((_, index) => (
                  <motion.div
                    key={index}
                    className={`h-2 rounded-full transition-all ${
                      index === currentStep 
                        ? 'w-8 bg-primary dark:bg-secondary' 
                        : index < currentStep
                        ? 'w-2 bg-primary/50 dark:bg-secondary/50'
                        : 'w-2 bg-gray-300 dark:bg-gray-600'
                    }`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                  />
                ))}
              </div>

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between gap-3">
                <button
                  onClick={handleSkip}
                  className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  Skip Tour
                </button>

                <div className="flex items-center gap-2">
                  {!isFirstStep && (
                    <button
                      onClick={handlePrevious}
                      className="px-4 py-2 bg-gray-100 dark:bg-less-dark hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors flex items-center gap-2"
                      style={{ fontFamily: 'Poppins, sans-serif' }}
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Back
                    </button>
                  )}
                  
                  <motion.button
                    onClick={handleNext}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-2 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white rounded-lg font-bold transition-all flex items-center gap-2 shadow-lg"
                    style={{ fontFamily: 'Poppins, sans-serif' }}
                  >
                    {isLastStep ? 'Get Started!' : 'Next'}
                    {!isLastStep && <ArrowRight className="w-4 h-4" />}
                  </motion.button>
                </div>
              </div>

              {/* Step counter */}
              <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-4" style={{ fontFamily: 'Inter, sans-serif' }}>
                Step {currentStep + 1} of {tutorialSteps.length}
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

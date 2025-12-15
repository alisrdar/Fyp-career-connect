'use client';

import React, { useState, useEffect } from 'react';
import { useQuizGame } from '@/hooks/useQuizGame';
import { QuizView } from './types';
import { logActivity, ActivityTypes } from '@/helpers/activityLogger';
import { useAuth } from '@/context/AuthContext';

// Views
import WelcomeView from '@/components/quiz/views/WelcomeView';
import DemographicView from '@/components/quiz/views/DemographicView';
import StagesView from '@/components/quiz/views/StagesView';
import TransitionView from '@/components/quiz/views/TransitionView';
import GameView from '@/components/quiz/views/GameView';
import ResultsView from '@/components/quiz/views/ResultsView';

const QuizPage = () => {
  const auth = useAuth() as any;
  const user = auth?.user;
  const [view, setView] = useState<QuizView>('demographic');
  const [previousStage, setPreviousStage] = useState<number>(1);
  const [hasLoggedStart, setHasLoggedStart] = useState(false);

  const {
    question,
    results,
    loading,
    isFinished,
    demographic,
    setDemographic,
    progress,
    questionCount,
    maxQuestions,
    stage,
    currentStageId,
    completedStages,
    streak,
    xp,
    xpGained,
    badge,
    mascotState,
    startSession,
    submitAnswer,
    loadProgress,
  } = useQuizGame();

  // Check for saved progress on mount and set initial view
  useEffect(() => {
    const savedProgress = loadProgress();
    if (savedProgress && savedProgress.completedStages?.length > 0) {
      // User has completed at least one stage - show stages view
      console.log('🔄 Resuming quiz - showing stages view');
      setView('stages');
    } else if (savedProgress && savedProgress.questionCount > 0) {
      // User has started but not completed a stage - show stages view
      console.log('🔄 Resuming quiz - showing stages view');
      setView('stages');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle demographic selection
  const handleDemographicSelect = (demo: string) => {
    setDemographic(demo);
    setView('stages');
  };

  // Handle start from stages view
  const handleBeginStage = async (stageId: number) => {
    await startSession(demographic);
    if (user && !hasLoggedStart) {
      logActivity(user._id, ActivityTypes.QUIZ_STARTED);
      setHasLoggedStart(true);
    }
    setView('game');
  };

  // Handle start
  const handleStart = async () => {
    await startSession();
    if (user && !hasLoggedStart) {
      logActivity(user._id, ActivityTypes.QUIZ_STARTED);
      setHasLoggedStart(true);
    }
    setView('game');
  };

  // Handle answer submission
  const handleAnswer = async (answerId: string) => {
    await submitAnswer(answerId);
  };

  // Watch for stage transitions
  useEffect(() => {
    const newStageId = currentStageId;
    
    if (newStageId > previousStage && view === 'game' && questionCount > 0) {
      // Show transition screen
      setView('transition');
      setPreviousStage(newStageId);
      
      // Return to game after 3 seconds
      setTimeout(() => {
        setView('game');
      }, 3000);
    }
  }, [currentStageId, previousStage, view, questionCount]);

  // Watch for quiz completion
  useEffect(() => {
    if (isFinished) {
      if (user) {
        logActivity(user._id, ActivityTypes.QUIZ_COMPLETED);
      }
      setView('results');
    }
  }, [isFinished, user]);

  // Render the appropriate view
  const renderView = () => {
    switch (view) {
      case 'welcome':
        return <WelcomeView onStart={() => setView('demographic')} loading={loading} />;
      
      case 'demographic':
        return <DemographicView onSelectDemographic={handleDemographicSelect} loading={loading} />;
      
      case 'stages':
        return (
          <StagesView 
            currentStage={currentStageId}
            completedStages={completedStages}
            onBeginStage={handleBeginStage}
            loading={loading}
          />
        );
      
      case 'transition':
        return <TransitionView stage={stage} />;
      
      case 'game':
        return (
          <GameView
            question={question}
            onAnswer={handleAnswer}
            progress={progress}
            questionCount={questionCount}
            maxQuestions={maxQuestions}
            stage={stage}
            streak={streak}
            xp={xp}
            xpGained={xpGained}
            mascotState={mascotState}
            badge={badge}
          />
        );
      
      case 'results':
        return <ResultsView results={results} xp={xp} streak={streak} />;
      
      default:
        return (
          <DemographicView onSelectDemographic={handleDemographicSelect} loading={loading} />
        );
    }
  };

  return <div className="min-h-screen">{renderView()}</div>;
};

export default QuizPage;

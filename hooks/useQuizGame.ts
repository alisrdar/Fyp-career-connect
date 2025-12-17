import { useState, useRef } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Question, Recommendation, Stage, Badge } from '@/app/quiz/types';
import useMascotState from './useMascotState';
import { log } from 'console';

// --- WORD REPLACEMENT DICTIONARY ---
const WORD_REPLACEMENTS: Record<string, string> = {
  'whodunnit': 'murder mystery',
  'parlance': 'language',
  'ameliorate': 'improve',
  'obfuscate': 'confuse',
  'cognizant': 'aware',
  'ubiquitous': 'everywhere',
  'ephemeral': 'temporary',
  'paradigm': 'model',
  'conundrum': 'puzzle',
  'esoteric': 'specialized',
  'quintessential': 'typical',
  'dichotomy': 'division',
  'juxtaposition': 'comparison',
  'serendipity': 'luck',
  'cacophony': 'noise',
};

// Helper: Replace difficult words in text
function simplifyText(text: string): string {
  let simplified = text;
  for (const [difficult, simple] of Object.entries(WORD_REPLACEMENTS)) {
    const regex = new RegExp(`\\b${difficult}\\b`, 'gi');
    simplified = simplified.replace(regex, simple);
  }
  return simplified;
}

// Helper: Shuffle array (Fisher-Yates)
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// --- CONFIGURATION ---
const STAGES: Record<number, Stage> = {
  1: { name: "Stage 1", color: "bg-green-500", textColor: "text-green-500", icon: "🌱" },
  2: { name: "Stage 2", color: "bg-yellow-500", textColor: "text-yellow-500", icon: "🌊" },
  3: { name: "Stage 3", color: "bg-red-500", textColor: "text-red-500", icon: "🏁" }
};

// Demographic Limits
const MAX_QUESTIONS_MAP: Record<string, number> = {
  "middle_school": 20,
  "high_school": 25,
  "adult": 30
};

export function useQuizGame() {
  const router = useRouter();
  const authContext = useAuth();
  
  if (!authContext) {
    throw new Error('useQuizGame must be used within an AuthProvider');
  }
  
  const { user, loading: userLoading } = authContext;
  
  // --- MASCOT STATE ENGINE ---
  const mascot = useMascotState();
  
  // --- CORE STATE ---
  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [results, setResults] = useState<Recommendation[] | null>(null);

  // --- PROGRESS STATE ---
  const [demographic, setDemographic] = useState<string>((user as any)?.demographic || 'adult');
  const [questionCount, setQuestionCount] = useState<number>(0);
  const [previousStageId, setPreviousStageId] = useState<number>(1);
  const [completedStages, setCompletedStages] = useState<number[]>([]);
  const maxQuestions = MAX_QUESTIONS_MAP[demographic as keyof typeof MAX_QUESTIONS_MAP] || 25;
  
  // Calculate stage-specific progress
  const questionsPerStage = Math.ceil(maxQuestions / 3);
  const currentStageId = Math.min(Math.ceil((questionCount + 1) / questionsPerStage), 3);
  const stageQuestionCount = questionCount % questionsPerStage;
  const progress = Math.min((stageQuestionCount / questionsPerStage) * 100, 100);

  // --- GAMIFICATION STATE ---
  const [streak, setStreak] = useState<number>(0);
  const [xp, setXp] = useState<number>(0);
  const [xpGained, setXpGained] = useState<number>(0); 
  const [badge, setBadge] = useState<Badge | null>(null);

  // Prevent double-fetching
  const sessionStarted = useRef(false);

  // Save progress to localStorage
  const saveProgress = () => {
    if (!user) return;
    const progress = {
      userId: (user as any)._id,
      demographic,
      questionCount,
      currentStageId,
      completedStages,
      streak,
      xp,
      isCompleted: isFinished,
      timestamp: Date.now()
    };
    localStorage.setItem('quizProgress', JSON.stringify(progress));
    console.log('💾 Progress saved:', progress);
  };

  // Load progress from localStorage
  const loadProgress = () => {
    if (!user) return null;
    try {
      const saved = localStorage.getItem('quizProgress');
      if (saved) {
        const progress = JSON.parse(saved);
        if (progress.userId === (user as any)._id) {
          setDemographic(progress.demographic);
          setQuestionCount(progress.questionCount || 0);
          setCompletedStages(progress.completedStages || []);
          setStreak(progress.streak || 0);
          setXp(progress.xp || 0);
          console.log('📂 Progress loaded:', progress);
          return progress;
        }
      }
    } catch (err) {
      console.error('Failed to load progress:', err);
    }
    return null;
  };

  // --- HELPER LOGIC ---
  // Helper to turn ANY input into a consistent String format
  const normalizeInput = (raw: any): string => {
    if (typeof raw === 'string') return raw;
    if (Array.isArray(raw)) return raw.join(','); // ["A", "B"] -> "A,B"
    if (typeof raw === 'object') return JSON.stringify(raw); // {A:B} -> '{"A":"B"}'
    return String(raw);
  };

  // Validate answer based on question type
  const validateAnswer = (answerId: any): boolean => {
    if (!question) return true;
    
    // Normalize FIRST so we know what we are dealing with
    const normalized = normalizeInput(answerId);

    // A. SEQUENCE ORDER 🔢
    if (question.type === 'sequence_order' && question.interaction_config?.correct_order) {
      const userOrder = normalized.split(',');
      const correctOrder = question.interaction_config.correct_order;
      
      if (userOrder.length !== correctOrder.length) return false;
      // Check every item matches index-for-index
      return userOrder.every((id: string, index: number) => id === correctOrder[index]);
    }
    
    // B. PAIR MATCH 🔗
    if (question.type === 'pair_match') {
      if (!question.interaction_config?.matches) {
        console.warn('⚠️ No interaction_config.matches found - cannot validate on frontend');
        return true; // Cannot validate without correct answer - backend will validate
      }
      
      try {
        // If it was already an object, normalizeInput made it a string. Now we parse safely.
        const userMatches = JSON.parse(normalized);
        const correctMatches = question.interaction_config.matches;
        
        console.log('🔍 Pair Match Validation:');
        console.log('  User answer:', userMatches);
        console.log('  Correct matches:', correctMatches);
        
        const userKeys = Object.keys(userMatches);
        const correctKeys = Object.keys(correctMatches);

        // Check count mismatch
        if (userKeys.length !== correctKeys.length) {
          console.log('  ❌ Count mismatch');
          return false;
        }

        // Check mappings - EVERY pair must match exactly
        for (const [leftId, rightId] of Object.entries(correctMatches)) {
          if (userMatches[leftId] !== rightId) {
            console.log(`  ❌ Wrong pair: ${leftId} → ${userMatches[leftId]} (should be ${rightId})`);
            return false;
          }
        }
        console.log('  ✅ All pairs correct');
        return true;
      } catch (e) {
        console.error("Pair Validation Error:", e);
        return false;
      }
    }
    
    // C. MCQ / IMAGES (Standard)
    if (question.type === 'scenario_mcq' || question.type === 'image_choice') {
      const selectedOption = question.options?.find(opt => opt.id === normalized);
      return selectedOption?.correct === true;
    }    
    if (question.type === 'budget_slider' && question.interaction_config?.target_sum) {
      try {
        const allocations = JSON.parse(normalized);
        const sum = Object.values(allocations).reduce((a: any, b: any) => a + b, 0);
        return sum === question.interaction_config.target_sum;
      } catch (e) {
        console.error("Budget slider parse error:", e);
        return false;
      }
    }
    
    // Survey questions have no right/wrong answer
    return true;
  };
  
  const checkBadges = (currentStreak: number): boolean => {
    let badgeEarned = false;
    if (currentStreak === 3 && streak < 3) {
        setBadge({ name: "On Fire!", icon: "🔥" });
        setTimeout(() => setBadge(null), 3000);
        badgeEarned = true;
    }
    if (currentStreak === 5 && streak < 5) {
        setBadge({ name: "Unstoppable!", icon: "🚀" });
        setTimeout(() => setBadge(null), 3000);
        badgeEarned = true;
    }
    return badgeEarned;
  };

  // --- 4. FINISH QUIZ ---
  const finishQuiz = async () => {
    setLoading(true);
    mascot.onStageComplete();
    
    try {
      const res = await axios.post('/api/proxy/recommend/results', { 
        user_id: (user as any)?._id,
        personality: {} 
      });
      
      setResults(res.data.recommendations);
      setIsFinished(true);
      
      // Mark all stages as completed
      setCompletedStages([1, 2, 3]);
      
      // Save completion to database
      try {
        await axios.post('/api/quiz/complete', {
          finalXp: xp,
          finalStreak: streak
        });
      } catch (dbError) {
        console.error('Failed to save completion to DB:', dbError);
      }
      
      // Save completion status to localStorage
      setTimeout(() => {
        saveProgress();
      }, 100);
    } catch (err) {
      console.error("Results Error", err);
    } finally {
      setLoading(false);
    }
  };

  // --- 2. FETCH NEXT QUESTION ---
  const fetchNextQuestion = async (): Promise<void> => {
    try {
      const res = await axios.post('/api/proxy/rag/next-question', { user_id: (user as any)?._id });
      
      console.log('Next Question:', res);

      if (res.status === 204) {
        finishQuiz();
      } else {
        let processedQuestion = res.data;
        
        // Apply word simplification to question text and options
        if (processedQuestion) {
          processedQuestion.text = simplifyText(processedQuestion.text);
          
          if (processedQuestion.options) {
            processedQuestion.options = processedQuestion.options.map((opt: any) => ({
              ...opt,
              text: simplifyText(opt.text)
            }));
            
            // Shuffle options for sequence_order questions
            if (processedQuestion.type === 'sequence_order') {
              processedQuestion.options = shuffleArray(processedQuestion.options);
            }
          }
        }
        
        setQuestion(processedQuestion);
      }
    } catch (err: any) {
      // 1. If Quiz Finished
      if (err.response?.status === 204) {
        finishQuiz();
        return;
      }
      
      // 2. If Session Expired (Python RAM wiped) - AUTO RESTART 🔄
      if (err.response?.status === 404) {
        console.log('⚠️ Session expired, restarting...');
        sessionStarted.current = false; // Reset lock
        await startSession(demographic); // Re-initialize session with current demographic
        return;
      }
      
      console.error('Failed to fetch next question:', err);
    }
  };

  // --- 1. START SESSION WRAPPER ---
  const startSession = async (selectedDemographic?: string): Promise<void> => {
    if (!user || sessionStarted.current) return;
    sessionStarted.current = true;
    setLoading(true);

    try {
      // Load saved progress or use selected demographic
      loadProgress();
      const demo = selectedDemographic || demographic;
      setDemographic(demo);
      
      // Initialize session with AI engine
      await axios.post('/api/proxy/session/start', { 
        user_id: (user as any)?._id,
        demographic: demo
      });
      
      // Fetch first question
      await fetchNextQuestion();
    } catch (err) {

      console.error("Failed to start:", err);
    } finally {
      setLoading(false);
    }
  };

  // --- 3. SUBMIT ANSWER (THE GAME LOOP) ---
  const submitAnswer = async (rawAnswer: string | object | string[]): Promise<void> => {
    if (!user || !question) return;

    console.log('📤 SUBMIT ANSWER:', { 
      questionId: question.id, 
      questionType: question.type,
      rawAnswer,
      userId: (user as any)?._id 
    });

    // Trigger mascot thinking state
    mascot.onAnswerStart();
    
    // Determine if it's a survey question (no right/wrong answer)
    const isSurvey = ['likert_5', 'visual_swipe'].includes(question.type);
    
    // Validate using the raw input (the helper handles types)
    const isCorrect = isSurvey ? true : validateAnswer(rawAnswer);
    
    console.log('✅ VALIDATION RESULT:', { isCorrect, isSurvey });
    
    let newStreak = streak;
    let earnedXp = 0;
    let result: 'correct' | 'wrong' | 'neutral' = 'neutral';

    if (!isSurvey) {
       if (isCorrect) {
         // 🎯 CORRECT ANSWER REWARDS
         newStreak += 1;
         
         // Base XP for correct answer
         let correctXp = 25;
         
         // Streak bonus: +5 XP per streak level
         const streakBonus = newStreak * 5;
         
         // Difficulty bonus (from question.difficulty: 0.1 to 1.0)
         const difficultyBonus = Math.floor((question.difficulty || 0.5) * 20);
         
         // Total XP
         earnedXp = correctXp + streakBonus + difficultyBonus;
         
         result = 'correct';
         console.log('🎉 Marked as CORRECT', { 
           baseXp: correctXp, 
           streakBonus, 
           difficultyBonus, 
           totalXp: earnedXp,
           newStreak 
         });
       } else {
         // ❌ WRONG ANSWER
         newStreak = 0; // Break streak
         
         // Still reward effort (participation XP)
         earnedXp = 10;
         
         result = 'wrong';
         console.log('❌ Marked as WRONG', { participationXp: earnedXp });
       }
    } else {
      // Survey questions: moderate reward for participation
      earnedXp = 15;
      result = 'neutral';
    }

    // Update local state
    setStreak(newStreak);
    setXp(prev => prev + earnedXp);
    setXpGained(earnedXp);
    setQuestionCount(prev => prev + 1);

    // Check for stage crossing
    const newStageId = Math.min(Math.ceil((questionCount + 2) / questionsPerStage), 3);
    const stageCrossed = newStageId > currentStageId;
    
    if (stageCrossed) {
      setPreviousStageId(newStageId);
      // Mark previous stage as completed
      if (!completedStages.includes(currentStageId)) {
        setCompletedStages(prev => [...prev, currentStageId]);
      }
    }

    // Check badges
    const badgeEarned = checkBadges(newStreak);

    try {
      // SEND NORMALIZED STRING TO BACKEND
      await axios.post('/api/proxy/user/save-response', {
        user_id: (user as any)._id,
        question_id: question.id,
        response_id: normalizeInput(rawAnswer), // Vital Fix: normalize before sending
        time_taken: 0 // TODO: Track actual time if needed
      });

      // Trigger mascot result state
      mascot.onAnswerResult(result, stageCrossed);
      
      // Trigger badge celebration if earned
      if (badgeEarned) {
        mascot.onBadgeEarned();
      }

      if (questionCount + 1 >= maxQuestions) {
        finishQuiz();
        return;
      }

      await fetchNextQuestion();
      
      // Save progress
      saveProgress();
      
      setTimeout(() => {
        setXpGained(0);
      }, 1000);

    } catch (err) {
      console.error("Submit Error", err);
    }
  };

  // Get current stage
  const stage = STAGES[Math.min(currentStageId, 3)];

  // --- RETAKE QUIZ ---
  const retakeQuiz = async () => {
    if (!user) return;
    
    try {
      // 1. Delete/abandon current quiz session in database
      await axios.delete('/api/quiz/session');
      
      // 2. Clear local storage
      localStorage.removeItem('quizProgress');
      
      // 3. Reset all state
      setQuestion(null);
      setIsFinished(false);
      setResults(null);
      setQuestionCount(0);
      setPreviousStageId(1);
      setCompletedStages([]);
      setStreak(0);
      setXp(0);
      setXpGained(0);
      setBadge(null);
      sessionStarted.current = false;
      
      console.log('🔄 Quiz reset for retake - DB session abandoned');
    } catch (error) {
      console.error('Error during quiz retake:', error);
      // Still reset local state even if API call fails
      localStorage.removeItem('quizProgress');
      sessionStarted.current = false;
    }
  };

  return { 
    question, 
    results,
    loading: (loading || userLoading), 
    isFinished,
    demographic,
    setDemographic,
    currentStageId,
    completedStages,
    progress,
    questionCount,
    maxQuestions,
    stage,
    streak,
    xp,
    xpGained,
    badge,
    mascotState: mascot.state,
    startSession,
    submitAnswer,
    loadProgress,
    retakeQuiz
  };
}

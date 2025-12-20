"use client"
import { useState, useEffect } from 'react'
import QuizHeader from '@/components/dashboad/quiz/QuizHeader'
import QuestionCounter from '@/components/dashboad/quiz/QuestionCounter'
import LikertScale from '@/components/quiz/templates/LikertScale'
import SurveyControls from '@/components/dashboad/survey/SurveyControls'
import QuizTopBar from '@/components/dashboad/quiz/QuizTopbar'
import ConfirmModal from '@/components/ui/ConfirmModal'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { logActivity, ActivityTypes } from '@/helpers/activityLogger'
import { motion, AnimatePresence } from 'framer-motion'

export default function SurveyPage() {
  const { user } = useAuth()
  const router = useRouter()

  const questionsPerPage = 1 // Show one question at a time for better UX
  const [currentPage, setCurrentPage] = useState(0)
  const [questions, setQuestions] = useState([])
  const [answers, setAnswers] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [hasLoggedStart, setHasLoggedStart] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const [isResetting, setIsResetting] = useState(false)
  const [showRetakeModal, setShowRetakeModal] = useState(false)

  // Load questions and user's progress from backend
  useEffect(() => {
    if (user) {
      fetchQuestionsAndProgress()
    }
  }, [user])

  async function fetchQuestionsAndProgress() {
    setLoading(true)
    try {
      // Fetch questions
      const questionsRes = await fetch('/api/survey/questions', { credentials: 'include' })
      const questionsJson = await questionsRes.json()
      
      if (questionsJson && Array.isArray(questionsJson.questions)) {
        // Remove duplicate questions based on _id
        const uniqueQuestions = questionsJson.questions.filter((q, index, self) =>
          index === self.findIndex((t) => t._id === q._id)
        )
        console.log('[Survey] Total questions fetched:', questionsJson.questions.length)
        console.log('[Survey] Unique questions:', uniqueQuestions.length)
        setQuestions(uniqueQuestions)

        // Fetch user's existing progress
        const progressRes = await fetch('/api/survey/progress', { credentials: 'include' })
        const progressJson = await progressRes.json()
        
        if (progressJson && Array.isArray(progressJson.responses)) {
          // Convert array of {questionId, answer} to object format
          const existingAnswers = {}
          progressJson.responses.forEach(resp => {
            existingAnswers[resp.questionId] = resp.answer
          })
          console.log('[Survey] Loaded existing progress:', Object.keys(existingAnswers).length, 'answers')
          console.log('[Survey] Backend reports isComplete:', progressJson.isComplete)
          setAnswers(existingAnswers)
          
          // Use backend-verified completion status
          if (progressJson.isComplete) {
            // Survey already completed - show completion screen
            console.log('[Survey] Backend confirmed all questions answered, showing completion screen')
            setIsCompleted(true)
          } else {
            // Set current page to first unanswered question
            const firstUnanswered = uniqueQuestions.findIndex(q => !existingAnswers[q._id])
            if (firstUnanswered >= 0) {
              setCurrentPage(firstUnanswered)
            }
          }
        }
      } else {
        setError("Invalid response format from server.")
      }
    } catch (e) {
      console.error(e)
      setError("Failed to load questions.")
    } finally {
      setLoading(false)
    }
  }

  const total = questions.length
  const start = currentPage * questionsPerPage
  const end = start + questionsPerPage
  const currentQuestions = questions.slice(start, end)
  const currentQuestion = currentQuestions[0] // Single question per page
  const allAnswered = total > 0 && Object.keys(answers).length === total
  const progress = total > 0 ? ((Object.keys(answers).length / total) * 100) : 0

  async function handleSelect(questionId, option) {
    if (user && !hasLoggedStart) {
      logActivity(user._id, ActivityTypes.SURVEY_STARTED)
      setHasLoggedStart(true)
    }
    
    // Update local state
    setAnswers(prev => ({ ...prev, [questionId]: option }))
    
    // Save to backend immediately
    try {
      await fetch('/api/survey/submit', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          responses: [{ questionId, answer: option }]
        })
      })
      console.log('[Survey] Saved answer for question:', questionId)
    } catch (error) {
      console.error('[Survey] Failed to save answer:', error)
      setError('Failed to save your answer. Please try again.')
      return
    }
    
    // Auto-advance to next question after a short delay
    setTimeout(() => {
      if ((currentPage + 1) * questionsPerPage < total) {
        setCurrentPage(prev => prev + 1)
      }
    }, 400)
  }

  function handleNext() {
    if ((currentPage + 1) * questionsPerPage < total) {
      setCurrentPage(prev => prev + 1)
      setError("")
    }
  }

  function handlePrev() {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1)
      setError("")
    }
  }

  async function handleRetakeSurvey() {
    setIsResetting(true)
    setShowRetakeModal(false)
    try {
      const res = await fetch('/api/survey/reset', {
        method: 'POST',
        credentials: 'include'
      })
      
      if (res.ok) {
        // Reload page to start fresh
        window.location.reload()
      } else {
        const data = await res.json()
        setError(data.error || 'Failed to reset survey')
        setIsResetting(false)
      }
    } catch (e) {
      console.error('Reset failed:', e)
      setError('Failed to reset survey. Please try again.')
      setIsResetting(false)
    }
  }

  async function handleSubmit() {
    console.log('[Survey Submit] Total questions:', total)
    console.log('[Survey Submit] Answered questions:', Object.keys(answers).length)
    console.log('[Survey Submit] All answered:', allAnswered)
    
    if (!allAnswered) {
      setError(`Please answer all questions before submitting. ${Object.keys(answers).length}/${total} completed.`)
      return
    }

    try {
      // Calculate and save personality scores
      const scoreRes = await fetch('/api/survey/score', {
        method: 'POST',
        credentials:'include'
      })

      const scoreJson = await scoreRes.json()
      if (!scoreRes.ok) {
        console.warn('Scoring failed:', scoreJson?.error)
        setError('Could not process results. Please try again later.')
        return
      }
      
      if (user) {
        logActivity(user._id, ActivityTypes.SURVEY_COMPLETED)
      }
      
      // Show completion screen instead of redirecting
      setIsCompleted(true)

    } catch (e) {
      console.error(e)
      setError('Submission failed. Please try again.')
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">Loading survey...</p>
      </div>
    </div>
  )

  // Show completion screen after submission
  if (isCompleted) return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl w-full bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden"
      >
        {/* Success Header */}
        <div className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 p-8 text-white text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="text-6xl mb-4"
          >
            🎉
          </motion.div>
          <h1 className="text-3xl font-bold mb-2">Survey Completed!</h1>
          <p className="text-green-50 text-lg">Your personality analysis is ready</p>
        </div>

        {/* Content */}
        <div className="p-8 text-center space-y-6">
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Thank you for completing the personality survey. We've analyzed your responses and generated personalized career recommendations just for you.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <button
              onClick={() => router.push('/dashboard/recommendations')}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              📊 See Your Results
            </button>
            <button
              onClick={() => setShowRetakeModal(true)}
              disabled={isResetting}
              className="px-8 py-4 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold rounded-xl border-2 border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isResetting ? '⏳ Resetting...' : '🔄 Retake Survey'}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Retake Confirmation Modal */}
      <ConfirmModal
        isOpen={showRetakeModal}
        onClose={() => setShowRetakeModal(false)}
        onConfirm={handleRetakeSurvey}
        title="Retake Survey?"
        message="Are you sure you want to retake the survey? This will delete your current results and you'll need to answer all questions again."
        confirmText="Yes, Retake Survey"
        cancelText="Cancel"
        confirmVariant="primary"
        isLoading={isResetting}
      />
    </div>
  )
  
  if (questions.length === 0) return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
      <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-xl">
        <p className="text-gray-600 dark:text-gray-400">No questions found.</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Top Bar */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <QuizTopBar exitText='Survey' />
        </motion.div>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden mt-6"
        >
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-8 text-white">
            <QuizHeader
              title="Personality Survey"
              description="Tell us about your personality traits and preferences to help us recommend the best career paths for you."
            />
            
            {/* Progress Bar */}
            <div className="mt-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium">Progress</span>
                <span className="font-medium">{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-white/30 rounded-full h-3 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                  className="h-full bg-white rounded-full shadow-lg"
                />
              </div>
              <div className="mt-2 text-sm text-white/90">
                Question {start + 1} of {total}
              </div>
            </div>
          </div>

          {/* Question Section */}
          <div className="p-8 md:p-12">
            <AnimatePresence mode="wait">
              {currentQuestion && (
                <motion.div
                  key={currentQuestion._id}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-8"
                >
                  {/* Question Number Badge */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-white font-bold text-lg shadow-lg">
                      {start + 1}
                    </div>
                    <div className="h-1 flex-1 bg-gradient-to-r from-blue-200 to-purple-200 dark:from-blue-900 dark:to-purple-900 rounded-full" />
                  </div>

                  {/* Likert Scale Component */}
                  <LikertScale
                    question={currentQuestion}
                    onAnswer={(option) => handleSelect(currentQuestion._id, option)}
                    initialAnswer={answers[currentQuestion._id]}
                  />

                  {/* Answer Indicator */}
                  {answers[currentQuestion._id] && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-4"
                    >
                      <div className="inline-flex items-center gap-2 px-6 py-3 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full font-medium">
                        <span className="text-xl">✓</span>
                        Answer recorded
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm text-center"
              >
                {error}
              </motion.div>
            )}
          </div>

          {/* Controls Section */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-6 bg-gray-50 dark:bg-gray-900/50">
            <SurveyControls
              onPrev={handlePrev}
              onNext={handleNext}
              onSubmit={handleSubmit}
              disablePrev={currentPage === 0}
              disableNext={!answers[currentQuestion?._id]}
              isLast={end >= total}
            />
          </div>
        </motion.div>

        {/* Completion Status */}
        {allAnswered && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl shadow-xl text-white text-center"
          >
            <div className="text-4xl mb-2">🎉</div>
            <h3 className="text-xl font-bold mb-1">All Questions Answered!</h3>
            <p className="text-green-100">Click submit to get your personalized career recommendations</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}

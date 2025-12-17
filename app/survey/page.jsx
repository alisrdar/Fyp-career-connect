"use client"
import { useState, useEffect } from 'react'
import QuizHeader from '@/components/dashboad/quiz/QuizHeader'
import QuestionCounter from '@/components/dashboad/quiz/QuestionCounter'
import LikertScale from '@/components/quiz/templates/LikertScale'
import SurveyControls from '@/components/dashboad/survey/SurveyControls'
import QuizTopBar from '@/components/dashboad/quiz/QuizTopbar'
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

  useEffect(() => {
    const saved = localStorage.getItem('surveyResponses')
    if (saved) setAnswers(JSON.parse(saved))
    fetchQuestions()
  }, [])

  useEffect(() => {
    localStorage.setItem('surveyResponses', JSON.stringify(answers))
  }, [answers])

  async function fetchQuestions() {
    setLoading(true)
    try {
      const res = await fetch('/api/survey/questions', { credentials: 'include' })
      const json = await res.json()
      if (json && Array.isArray(json.questions)) {
        // Remove duplicate questions based on _id
        const uniqueQuestions = json.questions.filter((q, index, self) =>
          index === self.findIndex((t) => t._id === q._id)
        )
        console.log('[Survey] Total questions fetched:', json.questions.length)
        console.log('[Survey] Unique questions:', uniqueQuestions.length)
        setQuestions(uniqueQuestions)
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

  function handleSelect(questionId, option) {
    if (user && !hasLoggedStart) {
      logActivity(user._id, ActivityTypes.SURVEY_STARTED)
      setHasLoggedStart(true)
    }
    setAnswers(prev => ({ ...prev, [questionId]: option }))
    
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

  async function handleSubmit() {
    console.log('[Survey Submit] Total questions:', total)
    console.log('[Survey Submit] Answered questions:', Object.keys(answers).length)
    console.log('[Survey Submit] All answered:', allAnswered)
    
    if (!allAnswered) {
      setError(`Please answer all questions before submitting. ${Object.keys(answers).length}/${total} completed.`)
      return
    }

    const payload = Object.entries(answers).map(([questionId, answer]) => ({ questionId, answer }))
    console.log('[Survey Submit] Payload:', payload.length, 'responses')

    try {
      await fetch('/api/survey/submit', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ responses: payload })
      })
      const scoreRes = await fetch('api/survey/score', {
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
      
      localStorage.removeItem('surveyResponses')
      // Redirect or confirmation logic goes here
      router.push('/dashboard/recommendations')

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

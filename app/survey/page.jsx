"use client"
import { useState, useEffect } from 'react'
import QuizHeader from '@/components/dashboad/quiz/QuizHeader'
import QuestionCounter from '@/components/dashboad/quiz/QuestionCounter'
import QuestionCard from '@/components/dashboad/quiz/QuestionCard'
import OptionsList from '@/components/dashboad/quiz/OptionList'
import SurveyControls from '@/components/dashboad/survey/SurveyControls'
import ProgressTracker from '@/components/dashboad/quiz/ProgressTracker'
import QuizTopBar from '@/components/dashboad/quiz/QuizTopbar'

export default function SurveyPage() {
  const likertScale = [
    "Strongly Disagree",
    "Disagree",
    "Neutral",
    "Agree",
    "Strongly Agree"
  ]

  const questionsPerPage = 3
  const [currentPage, setCurrentPage] = useState(0)
  const [questions, setQuestions] = useState([])
  const [answers, setAnswers] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

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
        setQuestions(json.questions)
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
  const allAnswered = total > 0 && Object.keys(answers).length === total

  function handleSelect(questionId, option) {
    setAnswers(prev => ({ ...prev, [questionId]: option }))
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
    if (!allAnswered) {
      setError('Please answer all questions before submitting.')
      return
    }

    const payload = Object.entries(answers).map(([questionId, answer]) => ({ questionId, answer }))

    try {
      await fetch('/api/dashboard/survey/submit', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ responses: payload })
      })
      localStorage.removeItem('surveyResponses')
      // Redirect or confirmation logic goes here
    } catch (e) {
      console.error(e)
      setError('Submission failed. Please try again.')
    }
  }

  if (loading) return <div className="text-center p-6">Loading...</div>
  if (questions.length === 0) return <div className="text-center p-6">No questions found.</div>

  return (
    <div className="min-h-screen bg-muted/10 dark:bg-background p-4">
      <div className="max-w-3xl mx-auto bg-white dark:bg-background-dark rounded-2xl shadow-xl p-6 space-y-6">
        <QuizTopBar exitText='Survey' />
        <QuizHeader
          title="Interest Survey"
          description="Tell us about your interests and preferences to help us recommend the best career paths for you."
        />

        {currentQuestions.map((q) => (
          <div key={q._id} className="mb-6">
            <QuestionCard question={q} />
            <OptionsList
              options={q.options?.length ? q.options : likertScale}
              selected={answers[q._id]}
              onSelect={(option) => handleSelect(q._id, option)}
            />
          </div>
        ))}

        {error && (
          <div className="text-red-500 text-sm text-center -mt-4">{error}</div>
        )}

        <SurveyControls
          onPrev={handlePrev}
          onNext={handleNext}
          onSubmit={handleSubmit}
          disablePrev={currentPage === 0}
          disableNext={currentQuestions.some(q => !answers[q._id])}
          isLast={end >= total}
        />

        <QuestionCounter current={start + 1} total={total} />

        {/* Option A: Remove ProgressTracker or... */}
        {/* <ProgressTracker /> */}

        {/* Option B: Update ProgressTracker to accept actual data */}
      
      </div>
    </div>
  )
}

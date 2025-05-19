"use client"
import { useState, useEffect } from 'react'
// import QuizHeader from './QuizHeader'
import QuestionCounter from '@/components/dashboad/quiz/QuestionCounter'
import QuestionCard from '@/components/dashboad/quiz/QuestionCard'
import OptionsList from '@/components/dashboad/quiz/OptionList'
import Controls from '@/components/dashboad/quiz/Controls'
import ScoreStreak from '@/components/dashboad/quiz/ScoreStreak'
import ProgressTracker from '@/components/dashboad/quiz/ProgressTracker'
import QuizTopBar from '@/components/dashboad/quiz/QuizTopbar'
import { useRouter } from 'next/navigation'

export default function QuizPage() {
  const [question, setQuestion] = useState(null)
  const [selected, setSelected] = useState('')
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState(null)
  const [progress, setProgress] = useState(null)

  useEffect(() => {
    fetchNextQuestion()
    fetchProgress()
  }, [])

  const router = useRouter();

  // Redirect to report page if quiz is completed
  useEffect(() => {
    if (progress?.completed >= 10) {
      router.push('/dashboard/recommendations')
    }
  }, [progress])


  const fetchNextQuestion = async () => {
    if (progress?.completed >= 10) {
      setQuestion(null)
      return (<div className="text-center p-8 text-lg">Quiz completed! Redirecting to report...</div>)
      
    }

    setLoading(true)
    setMessage(null)
    try {
      const res = await fetch('/api/dashboard/quiz/nextquestion', { credentials: 'include' })
      const data = await res.json()

      if (data.done) {
        setMessage(data.message)
        setQuestion(null)
      } else {
        setQuestion(data)
      }
    } catch (err) {
      setMessage("Error loading question")
    } finally {
      setLoading(false)
    }
  }


  const fetchProgress = async () => {
    try {
      const res = await fetch('/api/dashboard/quiz/progress', { credentials: 'include' })
      const data = await res.json()
      setProgress(data)
    } catch { }
  }

  const handleSubmit = async () => {
    if (!selected) return
    try {
      await fetch('/api/dashboard/quiz/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionId: question.id, selectedAnswer: selected }),
        credentials: 'include'
      })
      setSelected('')
      fetchNextQuestion()
      fetchProgress()
    } catch {
      setMessage('Submission failed')
    }
  }

  if (loading) return <div className="text-center p-6 text-foreground-light dark:text-foreground-dark">Loading...</div>
  if (message) return <div className="text-center p-6 text-foreground-light dark:text-foreground-dark">{message}</div>

  return (
    <div className="min-h-screen bg-muted/10 dark:bg-background p-4">

      <div className=" bg-white  max-w-3xl mx-auto dark:bg-background-dark rounded-2xl shadow-xl p-6 space-y-6">
        {/* <QuizHeader /> */}
        <QuizTopBar currentStep={progress?.completed + 1} totalSteps={10} />
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <h1 className="text-3xl  font-bold text-foreground-light dark:text-white">
            Aptitude Assessment
          </h1>
          <QuestionCounter
            current={progress?.completed + 1}
            total={10} />
        </header>

        <div className="space-y-4 bg-gray-200 dark:bg-background-dark p-6 rounded-xl shadow-sm  border-border">
          <QuestionCard question={question} />
          <OptionsList
            options={question.options}
            selected={selected}
            onSelect={setSelected} />
        </div>
        <div className="flex flex-wrap flex-col md:flex-row md:justify-between  gap-4 mt-4">
          <Controls
            onSubmit={handleSubmit}
            onSkip={fetchNextQuestion}
            disabled={!selected} 
          />
          <ScoreStreak score={progress?.correct * 50 || 0} streak={2} />
        </div>
        <div className="pt-6 border-t border-border">
          <ProgressTracker data={progress} />
        </div>
      </div>
    </div>
  )
}
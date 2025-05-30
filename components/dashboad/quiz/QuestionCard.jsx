"use client"
import { useState } from 'react'
import { Info } from 'lucide-react'

export default function QuestionCard({ question }) {
  const [showSupport, setShowSupport] = useState(false)
  const [showArticle, setArticle] = useState(false)

  const toggleSupport = () => setShowSupport(prev => !prev)
  const toggleArticle = () => setArticle(prev => !prev)

  return (
    <>
      {(question.article || question.question) && (
        <div className="p-4 bg-white flex flex-col justify-between dark:bg-surface rounded-lg shadow-md relative">
          <div className="flex justify-between items-start">
            <h2 className="text-lg font-medium text-foreground-light dark:text-foreground-dark/50">
              {question.question}
            </h2>

            {question.support && (
              <button
                onClick={toggleSupport}
                className="ml-2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Toggle support info"
              >
                <Info className='hover:text-primary dark:text-extra-muted/80 cursor-pointer' size={18} />
              </button>
            )}
          </div>

          {question.article && (
            <button
              onClick={toggleArticle}
              className='ml-2 text-muted-foreground hover:text-foreground transition-colors'
              aria-label='Toggle Article'
            >
              <Info className='hover:text-primary dark:text-extra-muted/80 cursor-pointer' size={18}
              />
            </button>
          )}

          {question.support && showSupport && (
            <p className="mt-2 text-sm text-primary  dark:text-secondary bg-blue-50 dark:bg-darkblue p-2 rounded-lg">
              {question.support}
            </p>
          )}
        </div>
      )}

      {question.text && showArticle && (
        <div className="p-4 sm:p-6 md:p-8 bg-gray-100 dark:bg-surface/60 rounded-xl my-6 dark:shadow-less-dark shadow-sm">
          <h2 className="text-base sm:text-lg md:text-lg font-medium text-foreground-light dark:text-white">
            {question.text}
          </h2>
        </div>
      )}
    </>
  )
}

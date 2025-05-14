// components/quiz/QuestionCard.jsx
export default function QuestionCard({ question }) {
  return (
    <>
      { question.article || question.question &&
        (<div className="p-4 bg-white dark:bg-surface rounded-lg shadow-md">

          <p className="mb-4 text-gray-700 dark:text-muted">{question.article}</p>

          {/* {question.support && (
          <p className="mb-4 text-gray-700 dark:text-muted">{question.support}</p>
        )} */}

          <h2 className="text-xl font-medium text-foreground-light dark:text-foreground-dark/50">{question.question}</h2>

        </div>
        )}
      {question.text &&
        (
          <div className="p-4 bg-gray-100 dark:bg-surface/60 rounded-xl my-6 dark:shadow-less-dark shadow-sm">
            <h2 className="font-medium text-foreground-light dark:text-white">{question.text}</h2>
          </div>
        )}
    </>
  )
}
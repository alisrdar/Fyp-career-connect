// components/quiz/QuestionCard.jsx
export default function QuestionCard({ question }) {
  return (
    <div className="p-4 bg-white dark:bg-surface rounded-lg shadow">
      {question.article && (
        <p className="mb-4 text-gray-700 dark:text-muted">{question.article}</p>
      )}
      {/* {question.support && (
        <p className="mb-4 text-gray-700 dark:text-muted">{question.support}</p>
      )} */}
      <h2 className="text-xl font-medium text-foreground-light dark:text-foreground-dark/50">{question.question}</h2>
    </div>
  )
}
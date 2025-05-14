export default function QuestionCounter({ current, total }) {
  return (
    <div className="text-sm text-blue-600 dark:text-blue-400">
      Question {current} of {total}
    </div>
  )
}
// components/survey/SurveyHeader.jsx
export default function QuizHeader({ title, description }) {
  return (
    <div className="space-y-1">
      <h1 className="text-3xl font-semibold text-foreground-light dark:text-white">{title}</h1>
      <p className="text-gray-600 dark:text-muted">{description}</p>
    </div>
  )
}

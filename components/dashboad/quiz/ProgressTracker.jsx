// components/quiz/ProgressTracker.jsx
export default function ProgressTracker({ data }) {
  const subjects = [
    { name: 'Logical Reasoning', done: true, pts: 100, match: 'Strong match' },
    { name: 'Verbal Aptitude', done: true, pts: 150, match: 'Very strong match' },
    { name: 'Problem Solving', done: false, pts: '--', match: 'Evaluating...' }
  ]

  return (
    <div className="space-y-2">
      {subjects.map((sub, i) => (
        <div key={i} className="flex items-center justify-between bg-white dark:bg-surface p-4 rounded-lg">
          <div className="flex items-center">
            <span className={`h-4 w-4 mr-2 ${sub.done ? 'bg-green-500' : 'border-2 border-gray-400'} rounded-full`} />
            <span className="text-foreground-light dark:text-foreground-dark">{sub.name}</span>
          </div>
          <div className="text-sm text-foreground-light dark:text-foreground-dark">{sub.done ? 'Completed' : 'In progress'}</div>
          <div className="text-sm text-blue-600 dark:text-blue-400">{sub.pts} pts</div>
          <div className="text-sm text-gray-500 dark:text-muted">{sub.match}</div>
        </div>
      ))}
    </div>
  )
}
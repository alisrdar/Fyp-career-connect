// components/quiz/ProgressTracker.jsx

export default function ProgressTracker({ data }) {
  const subjects = [
    { name: 'Logical Reasoning', done: true, pts: 100, match: 'Strong match' },
    { name: 'Verbal Aptitude', done: true, pts: 150, match: 'Very strong match' },
    { name: 'Problem Solving', done: false, pts: '--', match: 'Evaluating...' },
  ];

  return (
    <div className="space-y-3">
      {subjects.map((sub, i) => (
        <div
          key={i}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 rounded-xl shadow-sm bg-gradient-to-r from-white to-gray-50 dark:from-surface dark:to-surface/80"
        >
          <div className="flex items-center gap-2">
            <div
              className={`h-4 w-4 rounded-full flex items-center justify-center
                ${sub.done
                  ? 'bg-green-500 text-white'
                  : 'border-2 border-gray-400 dark:border-muted'
                }`}
            >
              {sub.done ? '✔' : ''}
            </div>
            <span className="font-medium text-gray-700 dark:text-gray-100">
              {sub.name}
            </span>
          </div>

          <div className="flex gap-4 sm:gap-6 text-sm text-gray-600 dark:text-gray-300">
            <span className={sub.done ? 'text-green-600 dark:text-green-400' : ''}>
              {sub.done ? 'Completed' : 'In progress'}
            </span>
            <span className="font-semibold text-blue-700 dark:text-blue-400">{sub.pts} pts</span>
            <span className="text-gray-500 dark:text-muted italic">{sub.match}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

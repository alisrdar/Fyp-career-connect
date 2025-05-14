// components/quiz/ScoreStreak.jsx
export default function ScoreStreak({ score, streak }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="p-4 bg-white dark:bg-surface rounded-lg text-foreground-light dark:text-foreground-dark">
        <div className="text-sm">Current Score</div>
        <div className="text-2xl font-bold">{score} pts</div>
        <div className="text-xs text-gray-500 dark:text-muted">+50 points each correct</div>
      </div>
      <div className="p-4 bg-white dark:bg-surface rounded-lg text-foreground-light dark:text-foreground-dark">
        <div className="text-sm">Streak</div>
        <div className="text-2xl font-bold">{streak} 🔥</div>
        <div className="text-xs text-gray-500 dark:text-muted">Keep it going!</div>
      </div>
    </div>
  )
}

"use client"
import { useEffect, useState } from "react";
import { Info } from "lucide-react";

export default function ScoreStreak({ score, streak }) {
  const [animateScore, setAnimateScore] = useState(false);
  const [animateStreak, setAnimateStreak] = useState(false);

  // Trigger animations on prop change
  useEffect(() => {
    if (score) {
      setAnimateScore(true);
      const timer = setTimeout(() => setAnimateScore(false), 600);
      return () => clearTimeout(timer);
    }
  }, [score]);

  useEffect(() => {
    if (streak) {
      setAnimateStreak(true);
      const timer = setTimeout(() => setAnimateStreak(false), 600);
      return () => clearTimeout(timer);
    }
  }, [streak]);

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="p-4 bg-white dark:bg-surface rounded-lg text-foreground-light dark:text-foreground-dark shadow-md">
        <div className="flex items-center justify-between text-sm mb-1">
          <span>Current Score</span>
          <Info className="text-gray-400 cursor-pointer" size={16} title="Your total points earned so far" />
        </div>
        <div
          className={`text-2xl font-bold transition-transform duration-500 ${
            animateScore ? "scale-110 text-green-500" : ""
          }`}
        >
          {score} pts
        </div>
        <div className="text-xs text-gray-500 dark:text-muted">+50 points each correct</div>
      </div>

      <div className="p-4 bg-white dark:bg-surface rounded-lg text-foreground-light dark:text-foreground-dark shadow-md">
        <div className="flex items-center justify-between text-sm mb-1">
          <span>Streak</span>
          <Info className="text-gray-400 cursor-pointer" size={16} title="Number of consecutive correct answers" />
        </div>
        <div
          className={`text-2xl font-bold transition-transform duration-500 ${
            animateStreak ? "scale-110 text-yellow-400" : ""
          }`}
        >
          {streak} <span role="img" aria-label="fire">🔥</span>
        </div>
        <div className="text-xs text-gray-500 dark:text-muted">Keep it going!</div>
      </div>
    </div>
  );
}

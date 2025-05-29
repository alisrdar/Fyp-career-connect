// components/ProgressItem.jsx
'use client'
import React from 'react'

export default function ProgressItem({
  title,
  detail,
  percent = 0,
  onClick,
  locked = false,
}) {
  const P   = Math.min(Math.max(percent, 0), 100)
  const R   = 40
  const C   = 2 * Math.PI * R
  const offset = C * (1 - P / 100)

  return (
    <div
      onClick={locked ? undefined : onClick}
      className={`
        w-64 
        bg-gradient-to-b from-white to-blue-50 
        dark:from-gray-900 dark:via-surface dark:to-surface
        rounded-xl p-6 flex-shrink-0
        border border-gray-200 dark:border-none
        shadow-gray-300 shadow-md dark:shadow-muted/10
        hover:shadow-lg dark:hover:shadow-muted/20
        transition-shadow duration-200
        ${locked ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
    >
      {/* circular progress */}
      <div className="relative w-36 h-36 mx-auto">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>
            {/* light-mode gradient */}
            <linearGradient id="gradLight" x1="1" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#38bdf8" />   {/* sky-400 */}
              <stop offset="100%" stopColor="#0ea5e9" /> {/* sky-500 */}
            </linearGradient>
            {/* dark-mode gradient */}
            <linearGradient id="gradDark" x1="1" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#06b6d4" />   {/* cyan-500 */}
              <stop offset="100%" stopColor="#0891b2" /> {/* cyan-600 */}
            </linearGradient>
          </defs>

          {/* background ring */}
          <circle
            cx="50" cy="50" r={R}
            className="stroke-gray-200 dark:stroke-gray-700"
            strokeWidth="8" fill="none"
          />

          {/* progress ring: light */}
          <circle
            cx="50" cy="50" r={R}
            stroke="url(#gradLight)"
            strokeWidth="8"
            fill="none"
            strokeDasharray={C}
            strokeDashoffset={offset}
            strokeLinecap="round"
            transform="rotate(-90 50 50)"
            className="dark:hidden"
          />

          {/* progress ring: dark */}
          <circle
            cx="50" cy="50" r={R}
            stroke="url(#gradDark)"
            strokeWidth="8"
            fill="none"
            strokeDasharray={C}
            strokeDashoffset={offset}
            strokeLinecap="round"
            transform="rotate(-90 50 50)"
            className="hidden dark:block"
          />
        </svg>

        {/* percent text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl font-semibold text-gray-800 dark:text-gray-100">
            {P}%
          </span>
        </div>
      </div>

      {/* title & detail */}
      <h4 className="mt-6 text-center text-lg font-semibold text-blue-600 dark:text-cyan-400">
        {title}
      </h4>
      <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
        {detail}
      </p>
    </div>
  )
}

// components/ProgressItem.jsx
'use client'

import React from 'react'
import { ArrowRight } from 'lucide-react'

const statusBg = {
  default: 'bg-background-light dark:bg-background-dark',
  completed: 'bg-green-50 dark:bg-green-950/50',
  inProgress: 'bg-blue-50 dark:bg-blue-950/40',
  locked: 'bg-gray-100 dark:bg-gray-900',
}

const ProgressItem = ({
  title,
  detail,
  onClick,
  status = 'default', // 'completed' | 'inProgress' | 'locked'
}) => {
  return (
    <button
      onClick={onClick}
      className={`
        w-full flex items-center justify-between p-4 rounded-lg
        ${statusBg[status]}
        text-gray-600 dark:text-muted
        transition-colors duration-200
        hover:bg-gray-100 dark:hover:bg-gray-700
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary
      `}
      aria-label={`${title}: ${detail}`}
    >
      <div className="flex flex-col text-left">
        <h4 className="text-base font-medium text-foreground-light dark:text-foreground-dark">
          {title}
        </h4>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {detail}
        </p>
      </div>
      <ArrowRight className="w-5 h-5 text-gray-400 dark:text-gray-500" />
    </button>
  )
}

export default ProgressItem

// components/ResourceItem.jsx
'use client'

import React from 'react'
import { Bookmark as BookmarkIcon, ChevronRight } from 'lucide-react'

export default function ResourceItem({
  title,
  meta,
  onClick,
  onBookmarkClick,
  bookmarked = false,
}) {
  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      className="
        relative flex items-center p-6 bg-white dark:bg-surface
        rounded-2xl shadow-md hover:shadow-lg
        transition-shadow duration-200 cursor-pointer
        focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2
      "
      aria-label={`Open resource: ${title}`}
    >
      {/* Text */}
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {title}
        </h3>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          {meta}
        </p>
      </div>

      {/* Arrow Icon */}
      <ChevronRight className="w-5 h-5 text-gray-400 dark:text-gray-500 ml-4" />

      {/* Bookmark Button */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          onBookmarkClick()
        }}
        aria-label={bookmarked ? 'Remove bookmark' : 'Add bookmark'}
        className="
          absolute top-4 right-4 p-2 bg-gray-100 dark:bg-less-dark
          rounded-full transition-colors duration-200
          hover:bg-gray-200 dark:hover:bg-gray-600
          focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2
        "
      >
        <BookmarkIcon
          className={`w-5 h-5 ${
            bookmarked
              ? 'text-yellow-500 dark:text-yellow-400'
              : 'text-gray-400 dark:text-gray-500'
          }`}
        />
      </button>
    </div>
  )
}

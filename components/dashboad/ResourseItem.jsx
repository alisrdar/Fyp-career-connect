// components/ResourceItem.jsx
'use client'

import React from 'react'
import { Bookmark, Bookmark as BookmarkIcon } from 'lucide-react'

const ResourceItem = ({
  title,
  meta,
  onClick,            // jab user row pe click kare
  onBookmarkClick,    // jab user bookmark icon pe click kare
  bookmarked = false, // toggle state
}) => {
  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      className="
        flex justify-between items-center
        p-4 border-b border-gray-200 dark:border-border
        bg-background-light dark:bg-background-dark
        cursor-pointer
        transition-colors duration-200
        hover:bg-gray-100 dark:hover:bg-gray-800
        focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
      "
      aria-label={`Open resource: ${title}`}
    >
      {/* Text */}
      <div className="flex flex-col">
        <span className="font-medium text-foreground-light dark:text-foreground-dark">
          {title}
        </span>
        <span className="text-sm text-gray-500 dark:text-muted mt-1">
          {meta}
        </span>
      </div>

      {/* Bookmark btn */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          onBookmarkClick()
        }}
        aria-label={bookmarked ? 'Remove bookmark' : 'Add bookmark'}
        className="
          p-2 rounded-full
          transition-colors duration-200
          hover:bg-gray-200 dark:hover:bg-gray-700
          focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
        "
      >
        <BookmarkIcon
          className={`w-5 h-5 ${
            bookmarked
              ? 'text-yellow-500 dark:text-yellow-400'
              : 'text-gray-500 dark:text-muted'
          }`}
        />
      </button>
    </div>
  )
}

export default ResourceItem

import React from 'react'
import { Bookmark } from 'lucide-react'

const ResourseItem = ({ title, meta }) => {
    return (
        <div className="flex justify-between bg-background-light dark:bg-background-dark items-center py-2 border-b border-gray-200 dark:border-border">
            <div>
                <p className="font-medium text-foreground-light dark:text-foreground-dark">{title}</p>
                <span className="text-sm text-gray-500 dark:text-muted">{meta}</span>
            </div>
            <button className="text-gray-500 dark:text-muted hover:text-black dark:hover:text-white transition">
                <Bookmark className="w-5 h-5" />
            </button>
        </div>
    )
}

export default ResourseItem

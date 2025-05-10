import React from 'react'
import { ArrowRight } from 'lucide-react'

const ProgressItem = ({ title, detail }) => {
    return (
        <div className="flex items-center justify-between py-4 bg-background-light dark:bg-background-dark text-gray-600 dark:text-muted rounded-lg ">
            <div className=''>
                <h4 className="font-medium text-foreground-light dark:text-foreground-dark">{title}</h4>
                <p className="text-sm mt-1">{detail}</p>
            </div>
            <span className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white ">
                <ArrowRight className="w-5 h-5" />
            </span>
        </div>
    )
}

export default ProgressItem

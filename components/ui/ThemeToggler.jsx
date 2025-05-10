import React from 'react'
import { useDarkMode } from '@/context/ThemeContext';
import clsx from 'clsx';
import { Sun, Moon } from 'lucide-react';


const ThemeToggler = ({className="", hideOnMobile= false}) => {
    const {theme, toggleTheme} = useDarkMode()
    return (
        <button
        onClick={toggleTheme}
        className={clsx(
          'p-2 rounded-full hover:bg-muted/20 transition-colors text-foreground-light dark:text-foreground-dark',
          hideOnMobile && 'hidden md:inline-block',
          className
        )}
        aria-label="Toggle Theme"
      >
        {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
      </button>
    )
}

export default ThemeToggler

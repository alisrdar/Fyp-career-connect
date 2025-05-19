'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import ThemeToggler from '@/components/ui/ThemeToggler'
import { ArrowLeft } from 'lucide-react'
import { useDarkMode } from '@/context/ThemeContext'

const QuizTopBar = ({ currentStep, totalSteps, exitText = "Quiz" }) => {

    const { theme } = useDarkMode()
    const router = useRouter()

    const logoSrc =
        theme === "dark" ? "/pgec_logo_white_Svg.png" : "/pegcLogo_black.png";

    return (
        <header className="flex flex-col md:flex-row space-y-2 sm:space-y-0 items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-background-dark transition-colors ">
            {/* Left Section: Logo & Back */}
            <div className="flex items-center gap-4">

                <Link href="/dashboard">
                    <div className="flex items-center gap-2 ml-4">
                        <Image
                            src={logoSrc}
                            alt="Logo"
                            width={40}
                            height={40}
                        />
                        <span className="text-lg font-bold text-gray-800 dark:text-white hidden sm:inline">Career Connect</span>
                    </div>
                </Link>
            </div>

            {/* Right Section: Theme Toggle */}
            <div className='flex sm:flex-row items-start  gap-2 sm:gap-4 text-sm'>
                {/* Center (optional): Progress Indicator */}
                {currentStep && totalSteps && (
                    <div className="text-sm mr-4 font-medium text-muted-foreground dark:text-gray-300">
                        Question {currentStep} of {totalSteps}
                    </div>
                )}
                {/* Back Button */}
                <button
                    onClick={() => router.push('/dashboard')}
                    className="flex items-center text-primary dark:text-accent hover:underline"
                >
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Exit {exitText}
                </button>

                <div>
                    <ThemeToggler />
                </div>

            </div>

        </header>
    )
}

export default QuizTopBar

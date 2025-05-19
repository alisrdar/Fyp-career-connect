"use client"
import React from 'react'
import StepCard from './StepCard'
import ProgressItem from './ProgressItem'
import ResourceItem from './ResourseItem'
import { FileChartColumn, FileVideo, Compass, UserCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'

const DashBoardWelcome = () => {
    const router = useRouter()
    return (
        <div className="space-y-12 px-4 sm:px-6 md:px-8 dark:bg-background-dark">
            {/* Welcome Header */}
            <div>
                <h2 className="text-2xl sm:text-3xl font-semibold text-foreground-light dark:text-foreground-dark">
                    Welcome back, Alex!
                </h2>
                <p className="text-gray-600 dark:text-muted text-sm sm:text-base">
                    Continue your career discovery journey
                </p>
            </div>

            {/* Next Steps Section */}
            <section>
                <h3 className="text-lg sm:text-xl font-semibold mb-4 text-foreground-light dark:text-foreground-dark">
                    Next Steps
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <StepCard
                        step="1"
                        title="Career Interest Survey"
                        description="Complete this survey to help us understand your interests and preferences."
                        primaryLabel="Start Survey"
                        handlePrimaryClick={() => router.push('/dashboard/survey')}
                        handleSecondaryClick={() => console.log('Learn more clicked')}
                    />
                    <StepCard
                        step="2"
                        title="Skills Assessment Quiz"
                        description="Take this quiz to identify your strengths and areas for development."
                        primaryLabel="Take Quiz"
                        handlePrimaryClick={() => router.push('/dashboard/quiz')}
                        handleSecondaryClick={() => console.log('Learn more clicked')}
                    />
                </div>
            </section>

            {/* Progress Section */}
            <section>
                <h3 className="text-lg sm:text-xl font-semibold mb-4 text-foreground-light dark:text-foreground-dark">
                    Your Progress
                </h3>
                <div className="space-y-4">
                    {/* Profile Completion */}
                    <div className='flex flex-col sm:flex-row items-start sm:items-center gap-2'>
                        <div className='bg-white dark:bg-surface p-3 rounded-xl dark:text-background-light'>
                            <UserCircle className='h-4 w-4 sm:h-5 sm:w-5' />
                        </div>
                        <div className='w-full min-w-0'>
                            <ProgressItem title="Profile Completion" detail="75% complete" />
                        </div>
                    </div>

                    {/* Career Path */}
                    <div className='flex flex-col sm:flex-row items-start sm:items-center gap-2'>
                        <div className='bg-white dark:bg-surface p-3 rounded-xl dark:text-background-light'>
                            <Compass className='h-4 w-4 sm:h-5 sm:w-5' />
                        </div>
                        <div className='w-full min-w-0'>
                            <ProgressItem title="Career Path Discovery" detail="2 of 5 steps completed" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Resources Section */}
            <section>
                <h3 className="text-lg sm:text-xl font-semibold mb-4 text-foreground-light dark:text-foreground-dark">
                    Recommended Resources
                </h3>
                <div className="space-y-4">
                    <div className='flex flex-col sm:flex-row items-start sm:items-center gap-2'>
                        <div className='bg-white dark:bg-surface p-2 rounded-xl dark:text-background-light'>
                            <FileChartColumn className='h-4 w-4 sm:h-5 sm:w-5' />
                        </div>
                        <div className='w-full min-w-0'>
                            <ResourceItem title="Career Path Analysis" meta="2 min read" />
                        </div>
                    </div>

                    <div className='flex flex-col sm:flex-row items-start sm:items-center gap-2'>
                        <div className='bg-white dark:bg-surface p-2 rounded-xl dark:text-background-light'>
                            <FileVideo className='h-4 w-4 sm:h-5 sm:w-5' />
                        </div>
                        <div className='w-full min-w-0'>
                            <ResourceItem title="Understanding Your Career Strengths" meta="10 min video" />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default DashBoardWelcome

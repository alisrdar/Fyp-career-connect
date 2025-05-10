import React from 'react'
import StepCard from './StepCard'
import ProgressItem from './ProgressItem'
import ResourceItem from './ResourseItem'
import { FileChartColumn,FileVideo, Compass , UserCircle} from 'lucide-react'

const DashBoardWelcome = () => {
    return (
        <div className="space-y-12  dark:bg-background-dark ">
            <div>
                <h2 className="text-3xl font-semibold text-foreground-light dark:text-foreground-dark">Welcome back, Alex!</h2>
                <p className="text-gray-600 dark:text-muted">Continue your career discovery journey</p>
            </div>

            <section>
                <h3 className="text-xl font-semibold mb-4 text-foreground-light dark:text-foreground-dark">Next Steps</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <StepCard
                        step="1"
                        title="Career Interest Survey"
                        description="Complete this survey to help us understand your interests and preferences."
                        primaryLabel="Start Survey"
                    />
                    <StepCard
                        step="2"
                        title="Skills Assessment Quiz"
                        description="Take this quiz to identify your strengths and areas for development."
                        primaryLabel="Take Quiz"
                    />
                </div>
            </section>

            <section>
                <h3 className="text-xl font-semibold mb-4 text-foreground-light dark:text-foreground-dark">Your Progress</h3>
                <div className="space-y-2">
                    <div className='flex flex-nowrap items-center gap-2 '>
                        <div className='bg-white dark:bg-surface p-3.5 rounded-xl dark:text-background-light'>
                            <UserCircle className=' h-5 w-5'/>
                        </div>
                        <div className='w-full pl-3'>
                            <ProgressItem title="Profile Completion" detail="75% complete" />  
                        </div>
                             
                    </div>
                    <div className='flex items-center gap-2 flex-nowrap'>
                        <div className='dark:bg-surface p-3.5 rounded-xl bg-white dark:text-background-light da'>
                            <Compass className=' h-5 w-5'/>
                        </div>
                        <div className='pl-3 w-full'>
                            <ProgressItem title="Career Path Discovery" detail="2 of 5 steps completed" />  
                        </div>
                             
                    </div>
                
                    
                </div>
            </section>

            <section>
                <h3 className="text-xl font-semibold mb-4 text-foreground-light dark:text-foreground-dark">Recommended Resources</h3>
                <div className="space-y-2">
                    <div className='flex items-center gap-2 flex-nowrap'>
                        <div className=' p-1 rounded-xl dark:text-background-light'>
                            <FileChartColumn className=' h-5 w-5'/>
                        </div>
                        <div className='pl-3 w-full'>
                            <ResourceItem title="Career Path Analysis" meta="2 min read" />
                        </div>
                    </div>
                    <div className='flex items-center gap-2 flex-nowrap'>
                        <div className=' p-1 rounded-xl dark:text-background-light'>
                            <FileVideo className=' h-5 w-5'/>
                        </div>
                        <div className='pl-3 w-full'>
                            <ResourceItem title="Understanding Your Career Strengths" meta="10 min video" />
                        </div>
                    </div>
                    
                </div>
            </section>
        </div>
    )
}

export default DashBoardWelcome

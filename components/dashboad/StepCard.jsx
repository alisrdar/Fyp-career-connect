import React from 'react'
import Button from '@/components/ui/Button'

const StepCard = ({ step, title, description, primaryLabel }) => {
    return (
        <div className="bg-white h- dark:bg-surface text-gray-600 dark:text-muted p-4 sm:p-6 rounded-xl shadow transition hover:shadow-md w-full">
            <p className="text-xs sm:text-sm text-gray-400 dark:text-muted">STEP {step}</p>
            <h4 className="text-base sm:text-lg font-semibold mt-1 text-foreground-light dark:text-foreground-dark">
                {title}
            </h4>
            <p className="text-sm sm:text-base mt-2">{description}</p>
            <div className="mt-4 flex flex-col sm:flex-row gap-2 sm:gap-3">
                <Button
                    variant="primary"
                    size="sm"
                    className="w-full sm:w-auto"
                    btnText={primaryLabel}
                    type="button"
                />
                <Button
                    variant="secondary"
                    size="sm"
                    className="w-full sm:w-auto"
                    btnText="Learn more"
                    type="button"
                />
            </div>
        </div>
    )
}

export default StepCard

// DashboardStepCard.jsx
import React from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { useRouter } from 'next/navigation'

const StepCard = ({ imageLink,step, title, description, primaryLabel, onPrimaryClick, onSecondaryClick }) => {
    const router = useRouter()

    return (
        <Card
            imageSrc={imageLink}
            tag={`STEP ${step}`}
            title={title}
            description={description}
            className="rounded-xl shadow hover:shadow-md "
        >
            <div className="mt-4 flex flex-col sm:flex-row gap-2 sm:gap-3">
                <Button
                    variant="primary"
                    size="sm"
                    className="w-full sm:w-auto"
                    btnText={primaryLabel}
                    onClick={onPrimaryClick}
                />
                <Button
                    variant="secondary"
                    size="sm"
                    className="w-full sm:w-auto"
                    btnText="Learn more"
                    onClick={onSecondaryClick}
                />
            </div>
        </Card>

    )
}

export default StepCard

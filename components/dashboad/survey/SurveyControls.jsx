import Button from "@/components/ui/Button"
export default function SurveyControls({
    onPrev,
    onNext,
    onSubmit,
    disablePrev,
    disableNext,
    isLast
}) {
    return (
        <div className="flex justify-between">
            <button
                className="px-4 py-2 bg-gray-200 dark:bg-surface rounded-lg"
                onClick={onPrev}
                disabled={disablePrev}
            >
                Previous
            </button>
            {!isLast ? (
                <button
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    onClick={onNext}
                    disabled={disableNext}
                >
                    Next
                </button>
            ) : (
                <button
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                    onClick={onSubmit}
                    disabled={disableNext}
                >
                    Submit Survey
                </button>
            )}
        </div>
    )
}

import Button from "@/components/ui/Button";

export default function SurveyControls({
  onPrev,
  onNext,
  onSubmit,
  disablePrev,
  disableNext,
  isLast,
}) {
  return (
    <div className="flex justify-between items-center w-full gap-4 mt-6">
      <Button
        btnText="Previous"
        onClick={onPrev}
        disabled={disablePrev}
        variant="secondary"
        size="lg"
        className="min-w-30"
      />

      {!isLast ? (
        <Button
          btnText="Next"
          onClick={onNext}
          disabled={disableNext}
          variant="primary"
          size="lg"
          className="min-w-30"
        />
      ) : (
        <Button
          btnText="Submit Survey"
          onClick={onSubmit}
          disabled={disableNext}
          size="lg"
          className="min-w-34 font-bold text-white bg-gradient-to-r 
            from-green-600 to-green-500
            hover:from-green-700 hover:to-green-600
            dark:from-green-700 dark:to-green-500
            dark:hover:from-green-600 dark:hover:to-green-400"
        />
      )}
    </div>
  );
}

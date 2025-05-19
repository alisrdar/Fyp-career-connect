import Button from "@/components/ui/Button"

export default function Controls({ onSubmit, onSkip, disabled }) {
  return (
    <div className="flex my-auto gap-4 px-2 w-full sm:w-1/3 justify-end">
      <Button
        variant="ghost"
        btnText="Skip"
        onClick={onSkip}
        size="lg"
        className="text-md font-medium text-muted dark:text-extra-muted hover:text-primary dark:hover:text-accent transition-colors"
      />

      <Button
        type="submit"
        btnText="Submit"
        disabled={disabled}
        size="lg"
        variant="primary"
        onClick={onSubmit}
        className=" font-bold text-white bg-gradient-to-r 
          from-primary to-secondary
          hover:from-primary hover:to-secondary/80
          dark:from-muted dark:to-extra-muted
          dark:hover:from-muted/80 dark:hover:to-extra-muted/80"
      />
    </div>

  )
}
import Button from "@/components/ui/Button"

export default function Controls({ onSubmit, onSkip, disabled }) {
  return (
    <div className="flex justify-between px-2">
      <Button
        variant="ghost"
        btnText="Skip"
        onClick={onSkip}
        className="text-sm cursor-pointer"
        size="lg"
      />
      <Button
        type="submit"
        btnText="Submit"
        disabled={disabled}
        className="text-sm cursor-pointer  bg-blue-600 hover:bg-blue-700 text-white font-bold"
        onClick={onSubmit}
        size="lg"
        variant="primary"
      />
    </div>
  )
}
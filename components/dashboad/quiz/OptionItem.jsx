import { Check } from "lucide-react"; // or use a Unicode checkmark ✔

export default function OptionItem({ option, selected, onSelect }) {
  return (
    <li
      onClick={onSelect}
      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors
        text-foreground-light dark:text-extra-muted/80
        hover:bg-gray-100 dark:hover:bg-muted
        ${selected ? 'bg-blue-100 border border-accent dark:bg-muted dark:border-primary' : 'bg-white dark:bg-surface'}
      `}
    >
      {/* Circle with check */}
      <div
        className={`w-5 h-5 flex items-center justify-center rounded-full border-2
          ${selected
            ? 'border-gray-400 bg-gray-400 text-white'
            : 'border-gray-400 text-transparent'}
        `}
      >
        <Check size={14} strokeWidth={3} />
      </div>

      {/* Option Text */}
      <span className="truncate ">{option}</span>
    </li>
  );
}

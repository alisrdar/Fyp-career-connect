export default function OptionItem({ option, selected, onSelect }) {
  return (
    <li
      className={`p-3 text-foreground-light dark:text-accent/35 rounded-lg cursor-pointer  hover:bg-gray-100 dark:hover:bg-gray-900
        ${selected ? 'bg-blue-100 border  border-blue-300 dark:bg-gray-900 dark:border-blue-700' : 'bg-white dark:bg-surface '}`}
      onClick={onSelect}
    >
      {option}
    </li>
  )
}
// components/survey/OptionsList.jsx
export default function OptionsList({ options, selected, onSelect }) {

    return (
        <ul className="space-y-3">
            {options.map((opt, idx) => (
                <li
                    key={idx}
                    className={`p-3 border g-background-light  rounded-lg cursor-pointer hover:bg-gray-200 dark:hover:bg-surface/50 \${
                    selected === opt ? 'bg-blue-100 border-blue-300 dark:bg-blue-900' : 'bg-white dark:bg-background-dark'}`
                    }
                    onClick={() => onSelect(opt)}
                >
                    {opt}
                </li>
            ))}
        </ul>
    )
}
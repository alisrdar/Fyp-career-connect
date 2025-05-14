import OptionItem from "./OptionItem"

export default function OptionsList({ options, selected, onSelect }) {
  return (
    <ul className="grid grid-cols-1 gap-4">
      {options.map((opt, idx) => (
        <OptionItem key={idx} option={opt} selected={selected === opt} onSelect={() => onSelect(opt)} />
      ))}
    </ul>
  )
}
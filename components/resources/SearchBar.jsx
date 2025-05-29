'use client'
import { useSearchParams } from 'next/navigation'
import { Search } from 'lucide-react'

export default function SearchBar({ handleSearch, onChange, value }) {
  const params = useSearchParams()
  const query = value ?? params.get('q') ?? ''

  return (
    <form onSubmit={handleSearch} className="mb-6 max-w-lg ml-auto">
      <div className="relative">
        {/* Left icon */}
        <Search
          size={20}
          className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-500 dark:text-gray-400"
        />

        {/* Input */}
        <input
          type="text"
          value={query}
          onChange={onChange}
          placeholder="Search resources..."
          className="
            w-full pl-10 pr-14 py-3
            bg-gray-100 dark:bg-gray-800
            text-gray-900 dark:text-gray-100
            placeholder-gray-500 dark:placeholder-gray-400
            rounded-full
            focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-darkblue
            transition
          "
        />

        {/* Submit button */}
        <button
          type="submit"
          className="
            absolute top-1/2 right-1 -translate-y-1/2
            w-10 h-10 flex items-center justify-center
            bg-primary hover:bg-primary/60
            dark:bg-muted dark:hover:bg-muted/60
            text-white
            rounded-full
            transition
          "
        >
          <Search size={16} />
        </button>
      </div>
    </form>
  )
}

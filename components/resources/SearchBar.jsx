'use client'
import { useSearchParams } from 'next/navigation'
import { useState } from 'react'

export default function SearchBar({handleSearch, onChange, value}) {
  const params = useSearchParams()

  return (
    <form onSubmit={handleSearch} className="mb-6">
      <input
        type="text"
        value={value || params.get('q') || ''}
        onChange={onChange}
        placeholder="Search resources..."
        className="w-full border rounded p-2 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </form>
  )
}
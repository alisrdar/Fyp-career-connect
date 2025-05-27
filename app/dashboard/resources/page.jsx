'use client'
import { useRouter} from 'next/navigation'
import { useState } from 'react'
import React from 'react'
import ResourceSection from '@/components/resources/ResourceSection'
import { articleData } from '@/lib/data/educationArticles'
import SearchBar from '@/components/resources/SearchBar'
import BreadcrumbNav from '@/components/resources/BreadcrumbNav'

const ResourcePage = () => {
    const router = useRouter()
    const [q, setQ] = useState('')
    function handleSearch(e) {
        e.preventDefault()
        if (q.trim() !== '') {
            router.push(`/dashboard/resources/search?q=${encodeURIComponent(q)}`)
        }
    }
    return (
        <div>
            <div className="p-6">
                <SearchBar
                    value={q}
                    handleSearch={handleSearch}
                    onChange={(e) => setQ(e.target.value)}

                />
                <ResourceSection
                    data={articleData}
                />
            </div>
        </div>
    )
}

export default ResourcePage

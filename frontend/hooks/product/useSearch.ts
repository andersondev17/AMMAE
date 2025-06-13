// hooks/search/useSearch.ts
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

export function useSearch() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [term, setTerm] = useState(searchParams.get('q') || '')

    const handleSearch = (query: string) => {
        setTerm(query)
        if (query.trim()) 
            router.push(`/search?q=${encodeURIComponent(query.trim())}`)
    }

    const clearSearch = () => {
        setTerm('')
        router.push('/search')
    }

    return { searchTerm: term, handleSearch, clearSearch }
}
// hooks/search/useSearch.ts
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useState } from 'react';
import { useDebounce } from '../useDebounce';

interface UseSearchReturn {
    searchTerm: string;
    debouncedSearch: string;
    handleSearch: (term: string) => void;
}

export function useSearch(): UseSearchReturn {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
    const debouncedSearch = useDebounce(searchTerm, 300);

    const handleSearch = useCallback((term: string) => {
        setSearchTerm(term);

        if (term.length === 0) {
            router.push('/');
            return;
        }

        if (term.length < 2) return;

        const params = new URLSearchParams(window.location.search);
        params.set('q', term);
        router.push(`/search?${params.toString()}`);
    }, [router]);

    return {
        searchTerm,
        debouncedSearch,
        handleSearch,
    };
}

export default useSearch;
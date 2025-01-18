// hooks/search/useSearch.ts
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { useDebounce } from '../useDebounce';

interface UseSearchReturn {
    searchTerm: string;
    debouncedSearch: string;
    handleSearch: (term: string) => void;
    isLoading: boolean;
}

export function useSearch(): UseSearchReturn {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
    const debouncedSearch = useDebounce(searchTerm, 300);

    const handleSearch = useCallback((term: string) => {
        setSearchTerm(term);
    }, []);

    useEffect(() => {
        if (!debouncedSearch) {
            // Si la búsqueda está vacía, no navegamos
            return;
        }

        setIsLoading(true);
        const timeoutId = setTimeout(() => {
            const currentPath = window.location.pathname;
            // Solo navegamos si no estamos ya en la página de búsqueda o si el término cambió
            if (currentPath !== '/search' || searchParams.get('q') !== debouncedSearch) {
                const newParams = new URLSearchParams();
                newParams.set('q', debouncedSearch);
                router.push(`/search?${newParams.toString()}`);
            }
            setIsLoading(false);
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [debouncedSearch, router, searchParams]);

    return {
        searchTerm,
        debouncedSearch,
        handleSearch,
        isLoading
    };
}
// components/Layout/Navbar/SearchBar.tsx
import { Input } from '@/components/ui/form/input';
import { Loader2, Search, X } from 'lucide-react';
import Link from 'next/link';
import { memo, useCallback } from 'react';

interface SearchBarProps {
    searchTerm: string;
    onChange: (value: string) => void;
    onClear?: () => void;
    isLoading?: boolean;
    className?: string;
}

const popularSearches = [
    { label: 'Zapatillas', href: '/search?q=zapatillas' },
    { label: 'Camiseta', href: '/search?q=camiseta' },
    { label: 'Vaqueros', href: '/search?q=vaqueros' },
    { label: 'Chaquetas', href: '/search?q=chaquetas' },
];

export const SearchBar = memo(({
    searchTerm,
    onChange,
    onClear,
    isLoading = false,
    className = '',
}: SearchBarProps) => {
    const handleSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    }, []);

    return (
        <div className="flex-1 max-w-2xl mx-auto">
            <div className="relative">
                <form onSubmit={handleSubmit} className={`relative ${className}`}>
                    {isLoading ? (
                        <Loader2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 animate-spin" />
                    ) : (
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    )}

                    <Input
                        value={searchTerm}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder="Buscar productos..."
                        className="w-full h-10 pl-10 pr-10 rounded-full border border-gray-200 focus:border-gray-300 focus:ring-0"
                        disabled={isLoading}
                    />

                    {searchTerm && !isLoading && (
                        <button
                            type="button"
                            onClick={onClear}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </form>

                {/* Popular Searches */}
                <div className="absolute -bottom-8 left-0 right-0 text-center text-sm">
                    <span className="text-gray-500 mr-2">Búsquedas populares:</span>
                    <div className="inline-flex gap-3">
                        {popularSearches.map(({ label, href }) => (
                            <Link
                                key={href}
                                href={href}
                                className="text-gray-700 hover:text-gray-900 hover:underline"
                            >
                                {label}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
});

SearchBar.displayName = 'SearchBar';
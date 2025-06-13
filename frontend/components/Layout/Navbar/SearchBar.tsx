// components/Layout/SearchBar.tsx
import { Input } from '@/components/ui/form/input';
import { useSearch } from '@/hooks/product/useSearch';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
    placeholder?: string;
    className?: string;
}

export function SearchBar({
    placeholder = "Buscar productos...",
    className = ""
}: SearchBarProps) {
    const { searchTerm, handleSearch } = useSearch();

    return (
        <div className={`relative ${className}`}>
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

            <Input
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder={placeholder}
                className="pl-10 pr-10"
                onKeyDown={(e) => e.key === 'Escape' && e.currentTarget.blur()}
            />

            {searchTerm && (
                <button
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                    <X className="h-4 w-4" />
                </button>
            )}
        </div>
    );
}

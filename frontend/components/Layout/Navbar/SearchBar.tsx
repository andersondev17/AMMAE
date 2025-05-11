// components/Layout/SearchBar.tsx
import { Input } from '@/components/ui/form/input';
import { Loader2, Search, X } from 'lucide-react';
import { memo, useCallback } from 'react';

interface SearchBarProps {
    searchTerm?: string;
    onChange?: (value: string) => void;
    onClear?: () => void;
    isOpen: boolean;
    isLoading?: boolean;
    className?: string;
    autoFocus?: boolean;
}

export const SearchBar = memo(({
    searchTerm = '',
    onChange = () => {},
    onClear,
    isOpen,
    isLoading = false,
    className = '',
    autoFocus = false
}: SearchBarProps) => {
    const handleSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    }, []);

    if (!isOpen) return null;

    return (
        <div className={className}>
            <form onSubmit={handleSubmit} className="relative mx-auto w-full">
                {isLoading ? (
                    <Loader2 className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 animate-spin" />
                ) : (
                    <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                )}

                <Input
                    value={searchTerm}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="¿Qué estás buscando?"
                    className="w-full h-14 pl-12 pr-12 border border-gray-200 focus:border-black focus:ring-0 shadow-none text-base transition-colors bg-transparent"
                    autoFocus={autoFocus}
                    disabled={isLoading}
                />

                {searchTerm && !isLoading && (
                    <button
                        type="button"
                        onClick={onClear}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                )}
            </form>
            
            {searchTerm && (
                <div className="mt-4 text-sm text-gray-500">
                    Pulsa Enter para buscar "{searchTerm}"
                </div>
            )}
        </div>
    );
});

SearchBar.displayName = 'SearchBar';
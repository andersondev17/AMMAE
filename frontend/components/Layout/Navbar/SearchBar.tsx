// components/Layout/Navbar/SearchBar.tsx
import { Input } from '@/components/ui/form/input';
import { Loader2, Search, X } from 'lucide-react';
import { memo, useCallback } from 'react';

interface SearchBarProps {
    searchTerm: string;
    onChange: (value: string) => void;
    onClear?: () => void;
    isOpen: boolean;
    isLoading?: boolean;
    className?: string;
    autoFocus?: boolean;
}

export const SearchBar = memo(({
    searchTerm,
    onChange,
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
        <div className="absolute top-full left-0 right-0 z-40 bg-transparent backdrop-blur-sm shadow-lg">
            <div className="container mx-auto py-4 px-4">
                <form onSubmit={handleSubmit} className={`relative ${className}`}>
                    {isLoading ? (
                        <Loader2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground animate-spin" />
                    ) : (
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    )}

                    <Input
                        value={searchTerm}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder="Buscar productos..."
                        className="w-full pl-10 pr-10"
                        autoFocus={autoFocus}
                        
                        disabled={isLoading}
                    />

                    {searchTerm && !isLoading && (
                        <button
                            type="button"
                            onClick={onClear}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </form>
            </div>
        </div>
    );
});

SearchBar.displayName = 'SearchBar';
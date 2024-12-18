// components/Navbar/SearchBar.tsx
import { Search } from 'lucide-react';
import { memo } from 'react';

interface SearchBarProps {
    isOpen: boolean;
    searchTerm: string;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    onChange: (value: string) => void;
}

export const SearchBar = memo(({ isOpen, searchTerm, onSubmit, onChange }: SearchBarProps) => (
    <div className={`
    absolute left-0 right-0 top-full bg-white
    transition-all duration-300 overflow-hidden
    ${isOpen ? 'max-h-24 border-b' : 'max-h-0'}
  `}>
        <form onSubmit={onSubmit} className="container mx-auto px-4 py-4">
            <div className="relative">
                <input
                    type="search"
                    placeholder="Buscar productos..."
                    value={searchTerm}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 text-gray-900 rounded-none border-b focus:outline-none focus:border-black transition-colors"
                />
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            </div>
        </form>
    </div>
));

SearchBar.displayName = 'SearchBar';
"use client";

import { useCart } from '@/hooks/useCart';
import { useScrollBehavior } from '@/hooks/useScrollBehavior';
import { Menu, Package, Search, ShoppingBag, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { memo, useCallback, useState } from 'react';
import { MobileMenu } from './MobileMenu';
import { SearchBar } from './SearchBar';

const mainCategories = [
    { name: 'JEANS', path: '/categoria/jeans', apiValue: 'Jeans' },
    { name: 'BLUSAS', path: '/categoria/blusas', apiValue: 'Blusas' },
    { name: 'VESTIDOS', path: '/categoria/vestidos', apiValue: 'Vestidos' },
    { name: 'ACCESORIOS', path: '/categoria/accesorios', apiValue: 'Accesorios' },
] as const;

export const Navbar = memo(() => {
    const { isVisible, isAtTop } = useScrollBehavior();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const router = useRouter();
    const pathname = usePathname();
    const { itemCount, onOpen } = useCart();

    const handleSearch = useCallback((e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSearchOpen(false);
        router.push(`/search?q=${encodeURIComponent(searchTerm)}`);
    }, [searchTerm, router]);

    const toggleSearch = useCallback(() => {
        setSearchOpen((prev) => !prev);
    }, []);

    return (
        <>
            {/* Banner promocional */}
            <div className={`
                bg-gradient-to-r from-[#232526] to-[#232526] text-white text-xs py-3 text-center font-medium
                transition-transform duration-300 shadow-md
                ${!isVisible ? '-translate-y-full' : 'translate-y-0'}
            `}>
                <p className='container mx-auto italic'>
                    ✨ ENVÍO GRATIS EN PEDIDOS SUPERIORES A $100 K ✨
                </p>
            </div>

            {/* Navbar */}
            <nav className={`
                fixed w-full z-50 
                transition-all duration-300 ease-in-out
                ${!isVisible ? '-translate-y-full' : 'translate-y-0'}
                ${!isAtTop ? 'bg-white/95 backdrop-blur-sm shadow-lg' : 'bg-transparent'}
            `}>
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        {/* Botón menú móvil */}
                        <button
                            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            onClick={() => setIsMenuOpen(true)}
                            aria-label="Menú"
                        >
                            <Menu className="h-6 w-6 text-gray-600" />
                        </button>

                        {/* Logo */}
                        <Link href="/" className="flex-shrink-0">
                            <h1 className="text-2xl font-bold text-gray-600">AMMAE</h1>
                        </Link>

                        {/* Navegación desktop */}
                        <div className="hidden lg:flex items-center space-x-8">
                            {mainCategories.map((category) => (
                                <Link
                                    key={category.name}
                                    href={category.path}
                                    className={`text-sm font-medium transition-colors
                                        ${pathname === category.path 
                                            ? 'text-black border-b font-black' 
                                            : 'hover:text-gray-300'}`}
                                >
                                    {category.name}
                                </Link>
                            ))}
                        </div>

                        {/* Iconos de acción */}
                        <div className="flex items-center space-x-6">
                            <button
                                onClick={toggleSearch}
                                className="hover:text-blue-600 transition-colors p-2"
                                aria-label="Buscar"
                            >
                                <Search className="h-5 w-5" />
                            </button>

                            <Link
                                href="/account"
                                className="hover:text-blue-600 transition-colors p-2"
                                aria-label="Mi cuenta"
                            >
                                <User className="h-5 w-5" />
                            </Link>

                            <Link
                                href="/admin/products"
                                className="hidden md:flex items-center space-x-2 hover:text-blue-600 transition-colors"
                            >
                                <Package className="h-5 w-5" />
                                <span className="text-sm">Admin</span>
                            </Link>

                            <button
                                onClick={onOpen}
                                className="hover:text-blue-600 transition-colors p-2 relative"
                                aria-label="Carrito"
                            >
                                <ShoppingBag className="h-5 w-5" />
                                {itemCount > 0 && (
                                    <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-blue-600 flex items-center justify-center text-[10px] text-white">
                                        {itemCount}
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Barra de búsqueda */}
                    <SearchBar
                        isOpen={searchOpen}
                        searchTerm={searchTerm}
                        onSubmit={handleSearch}
                        onChange={setSearchTerm}
                    />
                </div>

                {/* Menú móvil */}
                <MobileMenu
                    isOpen={isMenuOpen}
                    onClose={() => setIsMenuOpen(false)}
                    categories={mainCategories}
                />
            </nav>

            {/* Espaciador */}
            <div className="h-[64px]" />
        </>
    );
});

Navbar.displayName = 'Navbar';
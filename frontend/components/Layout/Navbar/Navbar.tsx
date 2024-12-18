'use client';

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

    const handleSearch = useCallback(
        (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            setSearchOpen(false);
            router.push(`/search?q=${encodeURIComponent(searchTerm)}`);
        },
        [searchTerm, router]
    );

    const toggleMenu = useCallback(() => {
        setIsMenuOpen((prev) => !prev);
    }, []);

    const toggleSearch = useCallback(() => {
        setSearchOpen((prev) => !prev);
    }, []);

    return (
        <>
            {/* Banner promocional */}
            <div
                className={`
          bg-gradient-to-r from-[#232526] to-[#232526] text-white text-xs py-3 text-center font-medium
          transition-transform duration-300 shadow-md
          ${!isVisible ? '-translate-y-full' : 'translate-y-0'}
        `}
            >
                <p className='container mx-auto italic'>✨ ENVÍO GRATIS EN PEDIDOS SUPERIORES A $100 K ✨</p>
            </div>

            {/* Navbar */}
            <nav
                className={`
          fixed w-full z-50 
          transition-all duration-300 ease-in-out
          ${!isVisible ? '-translate-y-full' : 'translate-y-0'}
          ${!isAtTop ? 'bg-white/95 backdrop-blur-sm shadow-lg' : 'bg-transparent'}
        `}
            >
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        {/* Menú móvil */}
                        <button
                            className="lg:hidden p-2"
                            onClick={toggleMenu}
                            aria-label="Menú"
                        >
                            <Menu className="h-6 w-6 text-gray-600" />
                        </button>

                        {/* Logo */}
                        <Link href="/" className="flex-shrink-0">
                            {/* <Image
                                src="/assets/logo2.jpeg"
                                alt="AMMAE"
                                width={120}
                                height={40}
                                className="h-8 w-auto"
                                priority
                            /> */}
                            <h1 className="text-2xl font-bold text-gray-600">AMMAE</h1>
                        </Link>

                        {/* Categorías principales */}
                        <div className="hidden lg:flex items-center space-x-8">
                            {mainCategories.map((category) => (
                                <Link
                                    key={category.name}
                                    href={category.path}
                                    className={`text-sm font-medium transition-colors ${pathname === category.path
                                            ? 'text-gray-900 font-black'
                                            : 'hover:text-gray-600'
                                        }`}
                                >
                                    {category.name}
                                </Link>
                            ))}
                        </div>

                        {/* Iconos */}
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

                            <Link
                                href="/cart"
                                className="hover:text-blue-600 transition-colors p-2"
                                aria-label="Carrito"
                            >
                                <ShoppingBag className="h-5 w-5" />
                            </Link>
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
                    categories={mainCategories}
                    onClose={() => setIsMenuOpen(false)}
                />
            </nav>

            {/* Separador para la altura del Navbar */}
            <div className="h-[64px]" />
        </>
    );
});

Navbar.displayName = 'Navbar';

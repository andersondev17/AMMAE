'use client';

import { Menu, Package, Search, ShoppingBag, User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const mainCategories = [
    { name: 'JEANS', path: '/categoria/jeans', apiValue: 'Jeans' },
    { name: 'BLUSAS', path: '/categoria/blusas', apiValue: 'Blusas' },
    { name: 'VESTIDOS', path: '/categoria/vestidos', apiValue: 'Vestidos' },
    { name: 'ACCESORIOS', path: '/categoria/accesorios', apiValue: 'Accesorios' }
];

export const Navbar: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const router = useRouter();
    const pathname = usePathname();

    // Efecto para manejar el scroll
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSearchOpen(false);
        router.push(`/search?q=${encodeURIComponent(searchTerm)}`);
    };

    return (
        <>
            {/* Barra de anuncios */}
            <div className="bg-black text-white text-xs py-2 text-center">
                <p>ENVÍO GRATIS EN PEDIDOS SUPERIORES A $99</p>
            </div>

            {/* Navbar principal */}
            <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white text-black shadow-md' : 'bg-transparent text-black'
                }`}>
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        {/* Menú móvil */}
                        <button
                            className="lg:hidden"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            <Menu className="h-6 w-6" />
                        </button>

                        {/* Logo */}
                        <Link href="/" className="flex-shrink-0">
                            <Image
                                src="/assets/logo2.jpeg"
                                alt="AMMAE"
                                width={120}
                                height={40}
                                className="h-8 w-auto"
                                priority
                            />
                        </Link>

                        {/* Navegación principal - Desktop */}
                        <div className="hidden lg:flex items-center space-x-8">
                            {mainCategories.map((category) => (
                                <Link
                                    key={category.name}
                                    href={category.path}
                                    className={`text-sm font-medium hover:text-gray-600 transition-colors ${
                                        pathname === category.path 
                                        ? 'text-blue-600 font-semibold' 
                                        : 'hover:text-gray-600'
                                    }`}
                                >
                                    {category.name}
                                </Link>
                            ))}
                        </div>

                        {/* Iconos de acción */}
                        <div className="flex items-center space-x-6">
                            <button
                                onClick={() => setSearchOpen(!searchOpen)}
                                className="hover:text-gray-600 transition-colors"
                            >
                                <Search className="h-5 w-5" />
                            </button>

                            <Link
                                href="/account"
                                className="hover:text-gray-600 transition-colors"
                            >
                                <User className="h-5 w-5" />
                            </Link>

                            {/* Admin link con visibilidad condicional */}
                            <Link
                                href="/admin/products"
                                className="hidden md:flex items-center space-x-2 hover:text-gray-600 transition-colors"
                            >
                                <Package className="h-5 w-5" />
                                <span className="text-sm">Admin</span>
                            </Link>

                            <Link
                                href="/cart"
                                className="hover:text-gray-600 transition-colors"
                            >
                                <ShoppingBag className="h-5 w-5" />
                            </Link>
                        </div>
                    </div>

                    {/* Barra de búsqueda expandible */}
                    <div className={`
                            absolute left-0 right-0 top-full bg-white
                            transition-all duration-300 overflow-hidden
                            ${searchOpen ? 'max-h-24 border-b' : 'max-h-0'}
                        `}>
                        <form onSubmit={handleSearch} className="container mx-auto px-4 py-4">
                            <div className="relative">
                                <input
                                    type="search"
                                    placeholder="Buscar productos..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-gray-50 text-gray-900 rounded-none border-b focus:outline-none focus:border-black transition-colors"
                                />
                                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                            </div>
                        </form>
                    </div>
                </div>

                {/* Menú móvil */}
                <div className={`
                        lg:hidden fixed inset-0 bg-white z-50 transform transition-transform duration-300
                        ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}
                    `}>
                    <div className="p-4">
                        <div className="flex justify-between items-center mb-8">
                            <Image
                                src="/assets/logo.jpeg"
                                alt="AMMAE"
                                width={100}
                                height={40}
                                className="h-8 w-auto"
                            />
                            <button onClick={() => setIsMenuOpen(false)}>
                                <span className="text-2xl">&times;</span>
                            </button>
                        </div>

                        <div className="space-y-4">
                            {mainCategories.map((category) => (
                                <Link
                                    key={category.name}
                                    href={category.path}
                                    className="block text-lg font-medium py-2 border-b border-gray-100"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {category.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Espaciador para el fixed navbar */}
            <div className="h-[64px]" />
        </>
    );
};
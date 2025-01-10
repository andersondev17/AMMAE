'use client'
import { useCart } from '@/hooks/useCart';
import { cn } from '@/lib/utils';

import gsap from 'gsap';
import { Menu, Package, Search, ShoppingBag, User, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useWindowScroll } from 'react-use';
import { MobileMenu } from './MobileMenu';

const mainCategories = [
    { name: 'JEANS', path: '/categoria/jeans', apiValue: 'Jeans' },
    { name: 'BLUSAS', path: '/categoria/blusas', apiValue: 'Blusas' },
    { name: 'VESTIDOS', path: '/categoria/vestidos', apiValue: 'Vestidos' },
    { name: 'ACCESORIOS', path: '/categoria/accesorios', apiValue: 'Accesorios' },
] as const;

export default function AnimatedNavbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const { itemCount, onOpen } = useCart();

    const pathname = usePathname();
    const navContainerRef = useRef<HTMLDivElement | null>(null);
    const { y: currentScrollY } = useWindowScroll();
    const [isNavVisible, setIsNavVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const isHomePage = pathname === '/';


    useEffect(() => {
        if (currentScrollY === 0) {
            setIsNavVisible(true);
            navContainerRef.current?.classList.remove("floating-nav");
        } else if (currentScrollY > lastScrollY) {
            setIsNavVisible(false);
            navContainerRef.current?.classList.add("floating-nav");
        } else if (currentScrollY < lastScrollY) {
            setIsNavVisible(true);
            navContainerRef.current?.classList.add("floating-nav");
        }

        setLastScrollY(currentScrollY);
    }, [currentScrollY, lastScrollY]);

    useEffect(() => {
        gsap.to(navContainerRef.current, {
            y: isNavVisible ? 0 : -100,
            opacity: isNavVisible ? 1 : 0,
            duration: 0.2,
        });
    }, [isNavVisible]);

    // Determina si el navbar está en modo transparente o flotante
    const shouldBeTransparent = isHomePage && currentScrollY === 0;
    const textColor = shouldBeTransparent ? "text-white" : "text-gray-800";
    const hoverTextColor = shouldBeTransparent ? "hover:text-gray-200" : "hover:text-gray-600";

    return (
        <div className="fixed inset-x-0 top-0 z-50 pt-3">
            <div
                ref={navContainerRef}
                className={cn(
                    "relative z-50 mx-auto max-w-7xl px-4 h-16 transition-all duration-700",
                    "sm:px-6 lg:px-12 xl:px-16 2xl:px-24",
                    shouldBeTransparent
                        ? "bg-transparent"
                        : "floating-nav bg-white/95 shadow-lg backdrop-blur-sm"
                )}
            >
                <nav className="flex h-full items-center justify-between">
                    <div className="flex items-center gap-6">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className={cn("lg:hidden transition-colors", textColor, hoverTextColor)}
                        >
                            <Menu className="h-6 w-6" />
                        </button>

                        <Link href="/" className="flex-shrink-0">
                            <h1 className={cn("text-2xl font-bold transition-colors", textColor)}>AMMAE</h1>

                        </Link>
                    </div>

                    <div className="hidden lg:flex items-center space-x-7">
                        {mainCategories.map((category) => (
                            <Link
                                key={category.name}
                                href={category.path}
                                className={cn(
                                    "nav-hover-btn",
                                    pathname === category.path
                                        ? textColor
                                        : shouldBeTransparent ? "text-gray-200" : "black-600",
                                    hoverTextColor
                                )}
                            >
                                {category.name}
                            </Link>
                        ))}
                    </div>

                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => setSearchOpen(!searchOpen)}
                            className={cn("nav-hover-btn p-2 transition-colors", textColor)}
                            aria-label="Buscar"
                        >
                            <Search className="h-5 w-5" />
                        </button>

                        <Link
                            href="/account"
                            className={cn("nav-hover-btn p-2", textColor)}
                            aria-label="Mi cuenta"
                        >
                            <User className="h-5 w-5" />
                        </Link>

                        <Link
                            href="/admin/products"
                            className={cn("hidden md:flex items-center nav-hover-btn", textColor)}
                        >
                            <Package className="h-5 w-5" />
                            <span className="ml-2">Admin</span>
                        </Link>

                        <button
                            onClick={onOpen}
                            className={cn("nav-hover-btn p-2", textColor)}
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
                </nav>
            </div>


            {/* Search Panel */}
            <div
                className={cn(
                    "absolute top-full left-0 right-0 z-40",
                    "transform transition-all duration-300 ease-in-out",
                    "bg-white/95 backdrop-blur-sm",
                    "border-b border-gray-200/80",
                    searchOpen
                        ? "translate-y-0 opacity-100 shadow-lg"
                        : "-translate-y-2 opacity-0 pointer-events-none"
                )}
            >
                <div className="container mx-auto max-w-8xl">
                    <div className="relative flex items-center px-4 py-4 sm:px-6 lg:px-8">
                        <Search className="absolute left-6 h-5 w-5 text-gray-400" />
                        <input
                            type="search"
                            placeholder="Buscar productos..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={cn(
                                "w-full pl-12 pr-4 py-3",
                                "bg-transparent rounded-lg",
                                "text-gray-900 placeholder-gray-500",
                                "border border-gray-200 focus:border-gray-900",
                                "transition-all duration-200",
                                "focus:outline-none focus:ring-2 focus:ring-blue-500/20",
                                "text-base sm:text-lg"
                            )}
                        />
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm('')}
                                className="absolute right-6 p-2 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        )}
                    </div>

                    {/* Opcional: Búsquedas recientes o sugerencias */}
                    {searchOpen && (
                        <div className="px-4 py-3 border-t border-gray-100">
                            <div className="text-sm text-gray-500">
                                Búsquedas populares:
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {['Jeans', 'Blusas', 'Vestidos'].map((term) => (
                                        <button
                                            key={term}
                                            onClick={() => setSearchTerm(term)}
                                            className={cn(
                                                "px-3 py-1 rounded-full text-sm",
                                                "bg-gray-100 hover:bg-gray-200",
                                                "text-gray-700 transition-colors"
                                            )}
                                        >
                                            {term}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile Menu */}
            <MobileMenu
                isOpen={isMenuOpen}
                onClose={() => setIsMenuOpen(false)}
                categories={mainCategories}
            />


            {/* Espaciador */}
            <div className="h-[64px]" />

        </div>
    );
}
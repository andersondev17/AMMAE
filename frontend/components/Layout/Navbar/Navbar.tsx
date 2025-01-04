'use client'
import { useCart } from '@/hooks/useCart';
import { cn } from '@/lib/utils';

import gsap from 'gsap';
import { Menu, Package, Search, ShoppingBag, User } from 'lucide-react';
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
    const isTransparent = currentScrollY === 0;
    const textColor = isTransparent ? "text-white" : "text-gray-800";
    const hoverTextColor = isTransparent ? "hover:text-gray-200" : "hover:text-gray-600";

    return (
        <div className="fixed inset-x-0 top-0 z-50 pt-3">
           

            <div
                ref={navContainerRef}
                className={cn(
                    "relative z-50 mx-auto max-w-7xl px-4 h-16 transition-all duration-700",
                    "sm:px-6 lg:px-8",
                    isTransparent 
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

                    <div className="hidden lg:flex items-center space-x-1">
                        {mainCategories.map((category) => (
                            <Link
                                key={category.name}
                                href={category.path}
                                className={cn(
                                    "nav-hover-btn",
                                    pathname === category.path 
                                        ? textColor 
                                        : isTransparent ? "text-gray-200" : "black-600",
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
            <div className={cn(
                "fixed left-0 right-0 z-40",
                "transform transition-all duration-300",
                "bg-white/95 backdrop-blur-sm shadow-lg",
                searchOpen ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
            )}>
                <div className="container mx-auto px-4 py-6">
                    <input
                        type="search"
                        placeholder="Buscar productos..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2 bg-transparent border-b border-gray-200 
                                 text-gray-900 placeholder-gray-500 focus:border-gray-900 focus:outline-none"
                    />
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
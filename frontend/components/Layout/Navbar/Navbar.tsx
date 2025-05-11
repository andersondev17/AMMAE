'use client'
import { useCart } from '@/hooks/cart/useCart';
import { cn } from '@/lib/utils';

import { mainCategories } from '@/constants';
import { useSearch } from '@/hooks/product/useSearch';
import gsap from 'gsap';
import { Menu, Package, Search, ShoppingBag, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useWindowScroll } from 'react-use';
import { MobileMenu } from './MobileMenu';
import { SearchBar } from './SearchBar';


export default function AnimatedNavbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const { itemCount, onOpen } = useCart();

    const pathname = usePathname();
    const navContainerRef = useRef<HTMLDivElement | null>(null);
    const { y: currentScrollY } = useWindowScroll();
    const [isNavVisible, setIsNavVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const isHomePage = pathname === '/';

    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const { searchTerm, handleSearch, isLoading } = useSearch();

    const handleToggleSearch = useCallback(() => {
        setIsSearchOpen(prev => !prev);
    }, []);

    const handleClearSearch = useCallback(() => {
        handleSearch('');
        setIsSearchOpen(false);
    }, [handleSearch]);


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
            duration: 0.3,
            ease: "power3.out"
        });
    }, [isNavVisible]);

    // Determina si el navbar está en modo transparente o flotante
    const shouldBeTransparent = isHomePage && currentScrollY === 0;
    const textColor = shouldBeTransparent ? "text-white" : "text-gray-800";
    const hoverTextColor = shouldBeTransparent ? "hover:text-gray-200" : "hover:text-gray-600";
    if (pathname.includes('/checkout')) {
        return (
            <div className="fixed inset-x-0 top-0 z-50">
                <div className="mx-auto px-4 h-10 backdrop-blur-sm shadow-sm">
                    <nav className="flex h-full items-center justify-center">
                        <Link href="/" className="flex-shrink-0">
                            <h1 className="text-2xl font-bold text-gray-800">AMMAE</h1>
                        </Link>
                    </nav>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-x-0 top-0 z-50 pt-3">
            <div
                ref={navContainerRef}
                className={cn(
                    "relative z-50 mx-auto px-4 h-16 transition-all duration-700",
                    "sm:px-6 lg:px-12 xl:px-16 2xl:px-24",
                    isHomePage ? "mx-auto max-w-7xl" : "w-full",
                    shouldBeTransparent
                        ? "bg-transparent"
                        : "floating-nav bg-white/95 shadow-lg backdrop-blur-sm"
                )}
            >
                <nav className="flex h-full items-center justify-between p-4">
                    <div className="flex items-center gap-7">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className={cn("lg:hidden transition-colors", textColor, hoverTextColor)}
                        >
                            <Menu className="h-6 w-6" />
                        </button>

                        <Link href="/" className="flex-shrink-0">
                            <h1 className={cn(
                                "text-2xl font-zentry tracking-wider transition-colors",
                                textColor,
                                "uppercase font-black"
                            )}>
                                AMMAE
                            </h1>
                        </Link>
                    </div>

                    {/* Search Panel */}
                    <div className={cn(
                        "absolute top-full left-0 right-0 z-40",
                        "transform transition-all duration-300 ease-in-out",
                        "bg-white backdrop-blur-sm",
                        "border b rounded-xl",
                        isSearchOpen ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0 pointer-events-none"
                    )}>
                        <div className="container mx-auto px-4 ">
                            <SearchBar
                                searchTerm={searchTerm}
                                onChange={handleSearch}
                                onClear={handleClearSearch}
                                isOpen={isSearchOpen}
                                isLoading={isLoading}
                                autoFocus
                            />
                        </div>
                    </div>

                    <div className="hidden lg:flex items-center space-x-8">
                        {mainCategories.map((category) => (
                            <Link
                                key={category.name}
                                href={category.path}
                                className={cn(
                                    "relative tracking-widest text-xs font-zentry font-bold group overflow-hidden",
                                    "transition-colors duration-300 py-1",
                                    pathname === category.path
                                        ? "text-blue-600 font-bold"
                                        : shouldBeTransparent ? "text-gray-200" : "text-gray-500",
                                    hoverTextColor
                                )}
                                style={{ letterSpacing: '0.10em' }}
                            >
                                <span className="block">
                                    {category.name}
                                </span>
                                <span
                                    className={cn(
                                        "absolute bottom-0 left-0 w-full h-0.5 transform scale-x-0 transition-transform duration-300 ease-out",
                                        pathname === category.path
                                            ? "bg-blue-600 scale-x-100"
                                            : "bg-current group-hover:scale-x-100"
                                    )}
                                />
                            </Link>
                        ))}
                    </div>
                    {/* Icons */}

                    <div className="flex items-center space-x-4">
                        {[
                            { icon: Search, label: "Buscar", action: handleToggleSearch, ariaLabel: "Buscar" },
                            { icon: User, label: "Cuenta", href: "/account", ariaLabel: "Mi cuenta" },
                            { icon: Package, label: "Admin", href: "/admin/products", className: "hidden md:flex", ariaLabel: "Administración" },
                            { icon: ShoppingBag, label: "Carrito", action: onOpen, badge: itemCount > 0, badgeCount: itemCount, ariaLabel: "Carrito" }
                        ].map((item, index) => (
                            <div
                                key={item.label}
                                className="relative"
                            >
                                {item.href ? (
                                    <Link
                                        href={item.href}
                                        className={cn(
                                            "relative p-2 rounded-full transition-all duration-300",
                                            "hover:bg-white/10 backdrop-blur-sm",
                                            item.className || "",
                                            textColor
                                        )}
                                        aria-label={item.ariaLabel}
                                    >
                                        <item.icon className="h-5 w-5" />
                                        {item.label !== "Admin" ? null : (
                                            <span className="ml-2 text-xs font-robert-medium">{item.label}</span>
                                        )}
                                    </Link>
                                ) : (
                                    <button
                                        onClick={item.action}
                                        className={cn(
                                            "relative p-2 rounded-full transition-all duration-300",
                                            "hover:bg-white/10 backdrop-blur-sm",
                                            textColor
                                        )}
                                        aria-label={item.ariaLabel}
                                        tabIndex={0}
                                    >
                                        <item.icon className="h-5 w-5" />
                                        {item.badge && (
                                            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-blue-600 flex items-center justify-center text-xs text-white font-robert-medium">
                                                {item.badgeCount}
                                            </span>
                                        )}
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </nav>
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
'use client';

import { Menu, Package, Search, User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export const Navbar: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const router = useRouter();

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        router.push(`/search?q=${encodeURIComponent(searchTerm)}`);
    };

    return (
        <nav className="bg-blue-600 text-white">
            <div className="container mx-auto px-4 py-3">
                <div className="flex justify-between items-center">
                    <Link href="/" className="text-2xl font-bold">
                        <Image
                            src="/assets/logo.jpeg"
                            alt="AM logo"
                            width={600}
                            height={40}
                            className="w-auto h-8 md:h-10"
                        />
                    </Link>

                    <div className="hidden md:flex items-center flex-grow justify-center mx-4">
                        <form onSubmit={handleSearch} className="relative w-full max-w-xl">
                            <input
                                type="search"
                                placeholder="SEARCH..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 w-full text-gray-900 rounded-md"
                            />
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        </form>
                    </div>

                    <div className="hidden md:flex items-center space-x-4">
                        <Link href="/account">
                            <User className="h-5 w-5" />
                        </Link>
                        <Link 
                            href="/admin/products"
                            className="flex items-center px-4 py-2 rounded-md bg-white/10 hover:bg-white/20 transition-colors"
                        >
                            <Package className="h-5 w-5 mr-2" />
                            <span className="font-medium">Admin Panel</span>
                        </Link>
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
                            <Menu className="h-5 w-5" />
                        </button>
                    </div>

                    <button
                        className="md:hidden"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        <Menu className="h-5 w-5" />
                    </button>
                </div>

                {isMenuOpen && (
                    <div className="md:hidden mt-4 space-y-4">
                        <form onSubmit={handleSearch} className="mb-4">
                            <input
                                type="search"
                                placeholder="SEARCH..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 w-full text-gray-900 rounded-md"
                            />
                        </form>
                        <div className="flex flex-col space-y-2">
                            <Link 
                                href="/account"
                                className="flex items-center px-4 py-2 hover:bg-white/10 rounded-md"
                            >
                                <User className="h-5 w-5 mr-2" />
                                <span>Mi Cuenta</span>
                            </Link>
                            <Link 
                                href="/admin/products"
                                className="flex items-center px-4 py-2 bg-white/10 hover:bg-white/20 rounded-md"
                            >
                                <Package className="h-5 w-5 mr-2" />
                                <span>Admin Panel</span>
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};
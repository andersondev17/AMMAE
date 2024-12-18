// components/Navbar/MobileMenu.tsx
import { Category } from '@/types/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { memo } from 'react';

interface MobileMenuProps {
    isOpen: boolean;
    categories: ReadonlyArray<Category>;
    onClose: () => void;
}

export const MobileMenu = memo(({ isOpen, categories, onClose }: MobileMenuProps) => (
    <div
        className={`
      lg:hidden fixed inset-0 bg-white z-50 
      transform transition-all duration-300 ease-in-out
      ${isOpen ? 'translate-x-0' : '-translate-x-full'}
    `}
    >
        <div className="p-4">
            <div className="flex justify-between items-center mb-8">
                <Image
                    src="/assets/logo.jpeg"
                    alt="AMMAE"
                    width={100}
                    height={40}
                    className="h-8 w-auto"
                />
                <button
                    onClick={onClose}
                    className="text-2xl p-2"
                    aria-label="Cerrar menú"
                >
                    &times;
                </button>
            </div>

            <div className="space-y-4">
                {categories.map((category) => (
                    <Link
                        key={category.name}
                        href={category.path}
                        className="block text-lg font-medium py-2 border-b border-gray-100"
                        onClick={onClose}
                    >
                        {category.name}
                    </Link>
                ))}
            </div>
        </div>
    </div>
));

MobileMenu.displayName = 'MobileMenu';
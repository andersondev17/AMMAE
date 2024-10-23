'use client';

import { Package } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const AdminNavLink = () => {
    const pathname = usePathname();
    const isActive = pathname.startsWith('/admin');

    return (
        <Link
            href="/admin/products"
            className={`
        flex items-center px-4 py-2 rounded-md transition-colors
        ${isActive
                    ? 'bg-white text-blue-600'
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }
      `}
        >
            <Package className="h-5 w-5 mr-2" />
            <span className="font-medium">Panel Admin</span>
        </Link>
    );
};
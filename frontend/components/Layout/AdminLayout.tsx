// components/layouts/AdminLayout.tsx
'use client';

import { useScrollBehavior } from '@/hooks/useScrollBehavior';
import { Package, Settings, Users } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { memo } from 'react';

const adminNavItems = [
    { label: 'Productos', icon: Package, path: '/admin/products' },
    { label: 'Usuarios', icon: Users, path: '/admin/users' },
    { label: 'Configuración', icon: Settings, path: '/admin/settings' },
] as const;

const AdminLayout = memo(({
    children,
}: {
    children: React.ReactNode;
}) => {
    const { isVisible, isAtTop, hasScrolled } = useScrollBehavior();
    const pathname = usePathname();

    return (
        <div className="min-h-screen bg-white">
            <header 
                className={`
                    fixed top-0 left-0 right-0 z-50
                    bg-white border-b border-gray-100
                    transition-all duration-300 ease-in-out
                    ${!isVisible && hasScrolled ? '-translate-y-full' : 'translate-y-0'}
                    ${hasScrolled ? 'shadow-sm' : ''}
                `}
            >
                <div className="h-16 px-4 flex items-center justify-between max-w-screen-2xl mx-auto">
                    <div className="flex items-center gap-8">
                        {/* Logo o título */}
                        <h1 className="text-sm font-medium text-gray-700">
                            AMMAE Admin
                        </h1>

                        {/* Navegación principal */}
                        <nav className="hidden md:flex items-center gap-1">
                            {adminNavItems.map((item) => (
                                <Link
                                    key={item.path}
                                    href={item.path}
                                    className={`
                                        flex items-center gap-2 px-4 h-16
                                        text-sm font-medium transition-colors
                                        border-b-2 -mb-[1px]
                                        ${pathname === item.path 
                                            ? 'border-gray-900 text-gray-900' 
                                            : 'border-transparent text-gray-500 hover:text-gray-900'}
                                    `}
                                >
                                    <item.icon className="h-4 w-4" />
                                    {item.label}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    {/* Indicador de estado */}
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                            <span className="block h-2 w-2 rounded-full bg-green-500"/>
                            <span className="text-xs text-gray-500">
                                Vista administrador
                            </span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Contenido principal */}
            <main className="pt-16 px-4">
                <div className="max-w-screen-2xl mx-auto py-8">
                    {children}
                </div>
            </main>
        </div>
    );
});

AdminLayout.displayName = 'AdminLayout';

export default AdminLayout;
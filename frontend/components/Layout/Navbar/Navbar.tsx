'use client'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { mainCategories, navCategories } from '@/constants'
import { useCart } from '@/hooks/cart/useCart'
import { useSearch } from '@/hooks/product/useSearch'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'
import { Menu, Package, Search, ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { MobileMenu } from './MobileMenu'
import { SearchBar } from './SearchBar'

export default function Navbar() {
    const router = useRouter()
    const { user, logout, isAdmin } = useAuth()
    const { itemCount, onOpen } = useCart()
    const pathname = usePathname()

    const [uiState, setUiState] = useState({
        isMenuOpen: false,
        isSearchOpen: false
    })

    const { isMenuOpen, isSearchOpen } = uiState
    const { searchTerm, handleSearch, isLoading } = useSearch()

    const toggleState = (key: keyof typeof uiState) => () => {
        setUiState(prev => ({ ...prev, [key]: !prev[key] }))
    }

    const handleClearSearch = () => {
        handleSearch('')
        setUiState(prev => ({ ...prev, isSearchOpen: false }))
    }

    if (pathname.includes('/checkout')) {
        return (
            <div className="fixed inset-x-0 top-0 z-50 h-10 backdrop-blur-sm shadow-sm bg-white/95">
                <nav className="flex h-full items-center justify-center">
                    <Link href="/">
                        <h1 className="text-2xl font-bold text-gray-800">AMMAE</h1>
                    </Link>
                </nav>
            </div>
        )
    }

    return (
        <div className="fixed inset-x-0 top-0 z-50">
            <div className={cn(
                "mx-auto bg-white/95 shadow-lg backdrop-blur-sm border border-black",
                "sm:px-6 lg:px-12 xl:px-16 2xl:px-24 w-full"
            )}>
                <nav className="flex items-center justify-between ">
                    {/* Sección izquierda */}
                    <div className="flex items-center gap-7">
                        <button
                            onClick={toggleState('isMenuOpen')}
                            className="lg:hidden text-gray-800"
                            aria-label="Menú móvil"
                        >
                            <Menu className="h-6 w-6" />
                        </button>

                        <Link href="/" aria-label="Inicio">
                            <h1 className="uppercase font-black text-2xl   tracking-wider  text-black">
                                AMMAE
                            </h1>
                        </Link>
                    </div>

                    {/* Navegación desktop */}
                    <div className="hidden lg:flex items-center space-x-8">
                        {navCategories.map((category) => (
                            <NavLink
                                key={category.name}
                                href={category.path}
                                currentPath={pathname}
                            >
                                {category.name}
                            </NavLink>
                        ))}
                        <SearchIcon toggle={toggleState('isSearchOpen')} />

                    </div>

                    {/* Iconos derecha */}
                    <div className="flex items-center space-x-4">
                        {user ? <UserMenu {...{ user, isAdmin, router, logout }} /> : <AuthLink />}

                        {isAdmin && <AdminLink />}

                        <CartIcon onOpen={onOpen} itemCount={itemCount} />
                    </div>
                </nav>
            </div>

            {/* Búsqueda móvil */}
            <SearchPanel
                isOpen={isSearchOpen}
                searchTerm={searchTerm}
                handleSearch={handleSearch}
                handleClear={handleClearSearch}
                isLoading={isLoading}
            />

            <MobileMenu
                isOpen={isMenuOpen}
                onClose={toggleState('isMenuOpen')}
                categories={mainCategories}
            />
        </div>
    )
}

// Componentes auxiliares actualizados
export const NavLink = ({ href, currentPath, children }: { href: string; currentPath: string; children: React.ReactNode }) => (
    <Link
        href={href}
        className={cn(
            "relative tracking-widest text-xs font-general font-bold group",
            "transition-colors duration-300 py-1 text-gray-500 hover:text-black",
            currentPath === href && "text-black font-bold"
        )}
        style={{ letterSpacing: '0.10em' }}
    >
        {children}
        <span className={cn(
            "absolute bottom-0 left-0 w-full h-0.5 transform scale-x-0 transition-transform duration-300 ease-out",
            currentPath === href ? "bg-black scale-x-100" : "bg-current group-hover:scale-x-100"
        )} />
    </Link>
)

const UserMenu = ({ user, isAdmin, router, logout }: { user: any; isAdmin: boolean; router: any; logout: () => void }) => (
    <DropdownMenu>
        <DropdownMenuTrigger asChild={false}>
            {/* O simplemente elimina el prop asChild por completo */}
            <Avatar className="cursor-pointer border-2 border-red-500 hover:border-red-600">
                <AvatarFallback className="bg-red-500 text-white">
                    {user?.name?.split(' ').slice(0, 2).map((n: string) => n[0]).join('').toUpperCase() || 'US'}
                </AvatarFallback>
            </Avatar>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-48 rounded-lg shadow-lg font-robert-medium">
            <div className="px-3 py-2">
                <p className="font-medium truncate">{user?.name || user?.email || 'Usuario'}</p>
                <p className="text-xs text-gray-500">{isAdmin ? 'Administrador' : 'Usuario'}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push('/profile')}>
                👤 Perfil
            </DropdownMenuItem>
            {isAdmin && <DropdownMenuItem onClick={() => router.push('/admin/dashboard')}>⚙️ Panel Admin</DropdownMenuItem>}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => { logout(); router.push('/') }} className="text-red-600 hover:bg-red-50">
                🚪 Cerrar Sesión
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
)

const SearchIcon = ({ toggle }: { toggle: () => void }) => (
    <div className="h-10 border border-black ">
        <button onClick={toggle} className="flex items-center justify-center w-full h-full px-4 text-gray-900 hover:bg-gray-50" aria-label="Abrir búsqueda de productos">
            <Search className="h-5 w-5" />
            <span className="ml-2 hidden md:inline font-general font-semibold text-xs tracking-wide">BUSCAR AQUÍ</span>
        </button>
    </div>
)

const AuthLink = () => (
    <Link href="/login" className="p-2 text-xs font-general tracking-widest font-bold text-gray-700 hover:text-black rounded-full">
        INICIAR SESION
    </Link>
)

const AdminLink = () => (
    <Link href="/admin/products" className="p-2 rounded-full text-gray-800 hover:text-black hidden md:flex" aria-label="Abrir Panel Admin">
        <Package className="h-5 w-5" />
    </Link>
)

const CartIcon = ({ onOpen, itemCount }: { onOpen: () => void; itemCount: number }) => (
    <button onClick={onOpen} className="relative p-2 rounded-full text-gray-800 hover:text-black" aria-label="Abrir Carrito de compras">
        <ShoppingBag className="h-5 w-5" />
        {itemCount > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-blue-600 text-xs text-white">
                {itemCount}
            </span>
        )}
    </button>
)

const SearchPanel = ({ isOpen, ...props }: { isOpen: boolean;[key: string]: any }) => (
    <div className={cn(
        "absolute left-0 right-0 z-40 bg-white backdrop-blur-sm border",
        "transform transition-all duration-300 ease-in-out",
        isOpen ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0 pointer-events-none"
    )}>
        <div className="container mx-auto">
            <SearchBar
                isOpen={isOpen}
                searchTerm={props.searchTerm}
                onChange={props.handleSearch}
                onClear={props.handleClear}
                isLoading={props.isLoading}
                autoFocus
            />
        </div>
    </div>
)
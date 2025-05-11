// components/admin/Sidebar.tsx - Rediseñado según la identidad visual de AMMAE
"use client";

import { adminSideBarLinks } from "@/constants";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const Sidebar = () => {
    const pathname = usePathname();
    // Iniciamos colapsado en móvil y escritorio
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(true);

    // Cerrar sidebar en cambio de ruta (solo en móvil)
    useEffect(() => setIsMobileOpen(false), [pathname]);

    // Toggle para mantener abierto/cerrado
    const toggleCollapse = () => setIsCollapsed(!isCollapsed);

    return (
        <>
            {/* Sidebar con diseño minimalista inspirado en la identidad AMMAE */}
            <aside className={cn(
                // Base y grupo para efectos hover
                "group fixed lg:sticky top-0 h-dvh flex flex-col z-10",
                // Estilo minimalista con fondo blanco semitransparente
                "bg-white/90 backdrop-blur-md border-r border-gray-100",
                // En hover, sutilmente más oscuro
                " hover:bg-black/10 transition-colors",
                // Transiciones suaves
                "transition-all duration-300 ease-in-out",
                // Ancho base y estados
                "w-16 lg:w-20", 
                "lg:hover:w-64",
                isMobileOpen && "max-lg:w-64",
                !isCollapsed && "lg:w-64"
            )}>
                {/* Barra superior con logo */}
                <div className="p-4 border-b border-gray-100 flex justify-center lg:justify-start">
                    <Link href="/" className="flex items-center gap-3">
                        <span className="font-bold text-base text-gray-900">
                            AMMAE
                        </span>
                        <div className={cn(
                            "overflow-hidden transition-all",
                            "max-lg:hidden",
                            isMobileOpen && "max-lg:block",
                            "lg:opacity-0 lg:w-0 group-hover:opacity-100 group-hover:w-auto",
                            !isCollapsed && "lg:opacity-100 lg:w-auto"
                        )}>
                            <p className="text-xs text-gray-500">Admin Panel</p>
                        </div>
                    </Link>
                </div>

                {/* Navegación con estilo minimalista */}
                <nav className="flex-1 p-2 overflow-y-auto">
                    {adminSideBarLinks.map(({ route, text, img }) => {
                        const isSelected = pathname.startsWith(route);

                        return (
                            <Link
                                key={route}
                                href={route}
                                className={cn(
                                    // Estilo base
                                    "flex items-center gap-3 p-3 rounded-lg mb-1",
                                    "transition-all duration-300",
                                    // Alineación
                                    "justify-center lg:group-hover:justify-start",
                                    isMobileOpen && "max-lg:justify-start",
                                    !isCollapsed && "lg:justify-start",
                                    // Hover y estados
                                    "hover:bg-gray-100 hover:translate-x-1",
                                    isSelected
                                        ? "bg-black text-white"
                                        : "text-gray-700"
                                )}
                            >
                                {/* Icono */}
                                <div className="w-6 h-6 flex items-center justify-center">
                                    <Image
                                        src={img}
                                        alt={text}
                                        width={20}
                                        height={20}
                                        className={cn(
                                            "transition-all duration-300",
                                            isSelected && "invert brightness-0 saturate-100"
                                        )}
                                    />
                                </div>
                                {/* Texto */}
                                <span className={cn(
                                    "whitespace-nowrap transition-all duration-300",
                                    "max-lg:hidden lg:opacity-0 lg:w-0 lg:group-hover:opacity-100 lg:group-hover:w-auto",
                                    isMobileOpen && "max-lg:block",
                                    !isCollapsed && "lg:opacity-100 lg:w-auto"
                                )}>
                                    {text}
                                </span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Botón de toggle para móvil */}
                <button
                    onClick={() => setIsMobileOpen(!isMobileOpen)}
                    className="lg:hidden absolute -right-3 top-4 
                              bg-black text-white p-1.5 rounded-full
                              shadow-md transition-all duration-300"
                    aria-label="Toggle mobile sidebar"
                >
                    {isMobileOpen ? (
                        <X className="h-4 w-4" />
                    ) : (
                        <Menu className="h-4 w-4" />
                    )}
                </button>

                {/* Botón para fijar abierto/cerrado en desktop */}
                <button
                    onClick={toggleCollapse}
                    className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2
                              bg-black text-white p-1.5 rounded-full
                              shadow-md transition-all duration-300"
                    aria-label="Pin sidebar open"
                >
                    {isCollapsed ? (
                        <Menu className="h-4 w-4" />
                    ) : (
                        <X className="h-4 w-4" />
                    )}
                </button>
            </aside>

            {/* Overlay para móvil */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-black/10 backdrop-blur-sm lg:hidden z-[5]
                              transition-opacity duration-300 ease-in-out"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}
        </>
    );
};

export default Sidebar;
"use client";

import { adminSideBarLinks } from "@/constants";
import { cn } from "@/lib/utils";
import { Dumbbell, Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const Sidebar = () => {
    const pathname = usePathname();
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);

    // Cerrar sidebar en mobile al cambiar de ruta
    useEffect(() => {
        setIsMobileOpen(false);
    }, [pathname]);

    // Toggle sidebar en mobile
    const toggleMobileMenu = () => {
        setIsMobileOpen(!isMobileOpen);
    };

    return (
        <>
            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 left-0 right-0 z-20 bg-gradient-to-b from-gray-900 to-slate-800 p-4 flex items-center justify-between shadow-md">
                <button 
                    onClick={toggleMobileMenu}
                    className="text-white p-2 rounded-md hover:bg-white/10 transition-colors"
                >
                    {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
                
                <Link href="/" className="flex items-center gap-2">
                    <div className="relative h-8 w-8 bg-gradient-to-tr from-red-500 to-red-600 rounded-lg flex items-center justify-center shadow-lg shadow-red-600/20">
                        <Dumbbell className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-white font-bold">AMMAE</span>
                </Link>
                
                <div className="w-8"></div> {/* Spacer para balancear el layout */}
            </div>

            {/* Sidebar */}
            <aside className={cn(
                "fixed lg:sticky top-0 left-0 h-dvh flex flex-col justify-between bg-gradient-to-b from-gray-900 to-slate-800 text-white shadow-xl z-10 transition-all duration-300",
                "w-64 px-4 pb-5 pt-8", // Tamaño normal
                "lg:w-20 lg:hover:w-64", // Collapsible en desktop
                "transform lg:translate-x-0", // Estado desktop
                isMobileOpen ? "translate-x-0" : "-translate-x-full", // Estado mobile
                isCollapsed ? "lg:w-20" : "lg:w-64" // Control colapsado
            )}>
                <div>
                    {/* Logo y título */}
                    <Link href="/" className="block">
                        <div className={cn(
                            "flex items-center gap-3 border-b border-dashed border-red-500/20 pb-6 group",
                            "overflow-hidden transition-all duration-300",
                            isCollapsed ? "justify-center" : ""
                        )}>
                            <div className="relative h-10 w-10 bg-gradient-to-tr from-red-500 to-red-600 rounded-lg flex items-center justify-center shadow-lg shadow-red-600/20 group-hover:shadow-red-600/40 transition-all duration-300 flex-shrink-0">
                                <Dumbbell className="h-6 w-6 text-white" />
                            </div>
                            <div className={cn(
                                "flex flex-col transition-all duration-300",
                                isCollapsed ? "opacity-0 w-0" : "opacity-100 w-auto"
                            )}>
                                <h1 className="text-xl font-bold text-white group-hover:text-red-400 transition-colors duration-300">
                                    AMMAE
                                </h1>
                                <p className="text-xs text-gray-400">Admin Panel</p>
                            </div>
                        </div>
                    </Link>

                    {/* Menú principal */}
                    <div className="mt-8">
                        <p className={cn(
                            "mb-3 px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider",
                            isCollapsed ? "hidden" : "block"
                        )}>
                            Main Menu
                        </p>

                        <nav className="flex flex-col gap-2">
                            {adminSideBarLinks.map((link) => {
                                const isSelected =
                                    pathname === link.route ||
                                    (link.route !== "/admin" && pathname.includes(link.route) && link.route.length > 1);

                                return (
                                    <Link href={link.route} key={link.route}>
                                        <div
                                            className={cn(
                                                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-300 overflow-hidden",
                                                isSelected
                                                    ? "bg-gradient-to-r from-red-600 to-red-500 text-white shadow-md shadow-red-600/20"
                                                    : "text-gray-300 hover:bg-white/5"
                                            )}
                                        >
                                            <div className="flex items-center justify-center w-8 h-8 flex-shrink-0">
                                                <div className="relative size-5">
                                                    <Image
                                                        src={link.img}
                                                        alt={link.text}
                                                        fill
                                                        className={cn(
                                                            "object-contain transition-all duration-200",
                                                            isSelected ? "brightness-0 invert" : "opacity-80"
                                                        )}
                                                    />
                                                </div>
                                            </div>
                                            <span className={cn(
                                                "font-medium transition-all duration-300",
                                                isCollapsed ? "opacity-0 w-0" : "opacity-100 w-auto"
                                            )}>
                                                {link.text}
                                            </span>
                                            
                                            {/* Indicador de selección */}
                                            {isSelected && !isCollapsed && (
                                                <div className="ml-auto size-2 rounded-full bg-white"></div>
                                            )}
                                        </div>
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>
                </div>
                
               
                {/* Botón para colapsar (solo desktop) */}
                <button 
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="hidden lg:block absolute -right-3 top-1/2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100 transition-colors"
                >
                    {isCollapsed ? (
                        <svg className="h-4 w-4 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    ) : (
                        <svg className="h-4 w-4 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    )}
                </button>
            </aside>

            {/* Overlay para mobile */}
            {isMobileOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 lg:hidden z-[5]"
                    onClick={toggleMobileMenu}
                />
            )}
        </>
    );
};

export default Sidebar;
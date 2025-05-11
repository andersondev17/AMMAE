// app/admin/layout.tsx
"use client";

import Sidebar from "@/components/admin/Sidebar";
import { cn } from "@/lib/utils";
import { ReactNode, useEffect, useState } from "react";

const AdminLayout = ({ children }: { children: ReactNode }) => {
    // Estado para detectar si la página ha cargado completamente
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    return (
        <main className="flex min-h-screen bg-white">
            <Sidebar />
            
            {/* Contenido principal con transición de carga */}
            <div className={cn(
                "flex-1 ml-16 lg:ml-20 transition-all duration-300",
                "min-h-screen overflow-x-hidden",
                isLoaded ? "opacity-100" : "opacity-0"
            )}>
                {/* Contenedor de contenido principal */}
                <div className="min-h-screen px-4 py-6 md:px-6 lg:px-8 lg:py-8">
                    {children}
                </div>
            </div>
        </main>
    );
}

export default AdminLayout;
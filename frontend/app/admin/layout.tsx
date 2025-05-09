"use client";

import Sidebar from "@/components/admin/Sidebar";
import { ReactNode } from "react";

const AdminLayout = ({ children }: { children: ReactNode }) => {

    return (
        <main className='flex min-h-screen bg-slate-50'>
            {/* Barra superior de administrador */}
            <Sidebar />
            <header className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 text-white pt-20 pb-5 px-1 shadow-xl">
                <div className="container mx-auto flex justify-between p-2">
                    <h1 className="text-xl font-semibold tracking-wide absolute left-0 top-1/2 -translate-y-1/2 transform -rotate-90 origin-left flex items-center gap-2">
                        <span className="text-blue-100">⚙️</span>
                        Modo Administrador
                    </h1>
                </div>
            </header>
            <div className='flex flex-col flex-1 overflow-x-hidden'>

            <div className='flex-1 p-6'>
                {children}
            </div>
            </div>
        </main>

    );
}

export default AdminLayout;
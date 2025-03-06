"use client";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="font-zentry tracking-wider transition-colors min-h-screen bg-gradient-to-tr from-gray-50 via-gray-100 to-gray-200">
            {/* Barra superior de administrador */}
            <header 
                className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 
                         text-white pt-20 pb-5 px-6 shadow-xl"
            >
                <div className="container mx-auto flex items-center justify-between">
                    <h1 className="text-xl font-semibold tracking-wide flex items-center gap-2">
                        <span className="text-blue-100">⚙️</span> 
                        Modo Administrador
                    </h1>
                    <p className="text-sm italic text-blue-50 border-b border-blue-200">
                        GESTIONA TU CONTENIDO
                    </p>
                </div>
            </header>

            {/* Contenido principal */}
            <main className="relative">
                <div 
                    className="absolute inset-0 bg-gradient-to-bl from-blue-200/40 
                             via-white/30 to-transparent"
                    aria-hidden="true"
                />
                
                <div className="relative z-10 container mx-auto p-6 animate-fadeIn">
                    {children}
                </div>
            </main>
        </div>
    );
}

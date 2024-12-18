"use client";
import { motion } from "framer-motion";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="min-h-screen bg-gradient-to-tr from-gray-50 via-gray-100 to-gray-200"
        >
            {/* Barra superior de administrador */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
                className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 text-white py-4 px-6 shadow-xl"
            >
                <div className="container mx-auto flex items-center justify-between">
                    <h1 className="text-xl font-semibold tracking-wide">
                        <span className="text-blue-300">⚙️</span> Modo Administrador
                    </h1>
                    <p className="text-sm italic opacity-90 border-b border-gray-200">GESTIONA TU CONTENIDO</p>
                </div>
            </motion.div>

            {/* Fondo decorativo con color grading */}
            <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-bl from-blue-200 via-white to-transparent opacity-40 pointer-events-none"></div>
                <motion.div
                    initial={{ opacity: 1, scale: 0.95 }}
                    animate={{ opacity: 2, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
                    className="relative z-10 container mx-auto p-6"
                >
                    {children}
                </motion.div>
            </div>
        </motion.div>
    );
}

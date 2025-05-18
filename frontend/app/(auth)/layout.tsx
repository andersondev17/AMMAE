// app/auth/layout.tsx (actualizado)
import Image from 'next/image';
import { ReactNode } from 'react';

export default function AuthLayout({ children }: { children: ReactNode }) {
    return (
        <main className="grid grid-cols-1 md:grid-cols-2 min-h-screen">
            {/* Formulario */}
            <section className="flex items-center justify-center p-6 bg-gray-900">
                <div className="w-full max-w-md bg-gray-800/80 backdrop-blur-sm p-8 sm:p-10 rounded-xl shadow-xl border border-gray-700/50">
                    <div className="flex items-center gap-3 mb-8">
                        <Image src="/assets/logo.jpeg" alt="AMMAE" width={40} height={40} />
                        <h1 className="text-xl font-bold text-white">AMMAE</h1>
                    </div>
                    {children}
                </div>
            </section>

            <section className="hidden md:block relative">
                <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 to-transparent z-10 flex items-center p-12">
                    <div>
                        <h2 className="text-4xl font-bold text-white mb-4">Transforma tu estilo,<br />
                            <span className="text-red-500">transforma tu vida</span>
                        </h2>
                    </div>
                </div>
                <Image
                    src="/assets/logoo.png"
                    alt="AMMAE Inspiration"
                    className="object-cover"
                    priority
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw" // Agregado para resolver la advertencia
                    placeholder='blur'
                    blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
                />
            </section>
        </main>
    );
}
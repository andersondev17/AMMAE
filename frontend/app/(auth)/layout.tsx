import Image from 'next/image';
import Link from 'next/link';
import { ReactNode } from 'react';

const AuthLayout= ({ children }: { children: ReactNode }) => {
    return (
        <main className="grid grid-cols-1 md:grid-cols-2 min-h-screen">
            {/* Formulario */}
            <section className="flex items-center justify-center p-6 bg-white">
                <div className="w-full max-w-md p-8 sm:p-10 border border-black">
                    <div className="flex items-center gap-3 mb-8">
                        <Link href="/" aria-label="Inicio" className="flex items-center">
                            <h1 className="text-2xl tracking-wider uppercase font-black text-black">
                                AMMAE
                            </h1>
                        </Link>
                    </div>
                    {children}
                </div>
            </section>

            <section className="hidden md:block relative">
                <div className="absolute inset-0 bg-black/20 z-10 flex items-center justify-center" />
                <Image
                    src="/assets/logoo.png"
                    alt="AMMAE Inspiration"
                    className="object-cover"
                    priority
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    placeholder='blur'
                    blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
                />
            </section>
        </main>
    );
}

export default AuthLayout
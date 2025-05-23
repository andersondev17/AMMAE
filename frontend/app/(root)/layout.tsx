'use client';
import { Footer } from '@/components/Layout/Footer';
import Navbar from '@/components/Layout/Navbar/Navbar';
import { usePathname } from 'next/navigation';
import { ReactNode, useEffect } from 'react';
const RootLayout = ({ children }: { children: ReactNode }) => {
    const pathname = usePathname();
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [pathname]);

    return (
        <main className={`flex flex-col min-h-screen `}>
            <Navbar />

            <div className="flex-grow">
                {children}
            </div>
            <Footer />

        </main>
    )
}

export default RootLayout;
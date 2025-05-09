import { Footer } from '@/components/Layout/Footer';
import { ReactNode } from 'react';
import Navbar from '../../components/Layout/Navbar/Navbar';
const RootLayout = ({ children }: { children: ReactNode }) => {
    return (
        <main >
            <Navbar />

            <div className="">
                {children}
            </div>
            <Footer />

        </main>
    )
}

export default RootLayout;
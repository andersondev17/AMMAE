// components/layout/Navbar.tsx
import Link from 'next/link';

export const Navbar = () => {
    return (
        <nav className="bg-indigo-600 text-white">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                <Link href="/" className="text-xl font-bold">Fashion Store</Link>
                <div>
                    <Link href="/cart" className="mr-4">Cart</Link>
                    <Link href="/account">Account</Link>
                </div>
            </div>
        </nav>
    );
};


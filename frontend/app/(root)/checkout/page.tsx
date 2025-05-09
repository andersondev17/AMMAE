// frontend/app/checkout/page.tsx
'use client';

import { CheckoutForm } from '@/components/checkout/page';
import { useCart } from '@/hooks/cart/useCart';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function CheckoutPage() {
    const router = useRouter();
    const { items } = useCart();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Solo redirigir si no hay items y la página ya se montó
        if (!items.length) {
            router.push('/');
        } else {
            setIsLoading(false);
        }
    }, [items.length, router]);

    // Mostrar un estado de carga mientras se verifica el carrito
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container max-w-7xl mx-auto px-4">
                <CheckoutForm />
            </div>
        </div>
    );
}
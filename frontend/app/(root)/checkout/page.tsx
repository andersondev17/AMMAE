'use client';

import { CheckoutForm } from '@/components/checkout/CheckoutForm';
import { useCart } from '@/hooks/cart/useCart';
import { useRouter } from 'next/navigation';
import { Suspense, useEffect } from 'react';

const LoadingSpinner = () => (
    <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
    </div>
);

export default function CheckoutPage() {
    const { items } = useCart();
    const router = useRouter();

    useEffect(() => {
        if (!items.length) {
            router.replace('/');
        }
    }, [items.length, router]);

    if (!items.length) {
        return <LoadingSpinner />;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container max-w-7xl mx-auto px-4">
                <Suspense fallback={<LoadingSpinner />}>
                    <CheckoutForm />
                </Suspense>
            </div>
        </div>
    );
}
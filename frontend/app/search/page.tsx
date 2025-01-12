// app/search/page.tsx
'use client';

import { ProductList } from '@/components/product/ProductList';
import { useProducts } from '@/hooks/product/useProducts';
import { useSearchParams } from 'next/navigation';

export default function SearchPage() {
    const searchParams = useSearchParams();
    const searchQuery = searchParams.get('q') || '';

    const { products, isLoading, error } = useProducts({
        search: searchQuery,
        limit: 12
    });

    return (
        <div className="container mx-auto px-4 py-28">
            <h1 className="text-2xl font-bold mb-6">
                {searchQuery ? 
                    `Resultados para "${searchQuery}"` : 
                    'Todos los productos'
                }
            </h1>

            <ProductList
                products={products}
                isLoading={isLoading}
                error={error}
                isAdminView={false}
            />
        </div>
    );
}
'use client';

import { ProductList } from '@/components/product/ProductList';
import { useProducts } from '@/hooks/product/useProducts';
import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';

export default function SearchPage() {
    const searchParams = useSearchParams();
    const query = searchParams.get('q') || '';
    const searchQuery = useMemo(() => query, [query]);
    const { products, isLoading } = useProducts({
        search: searchQuery,
        limit: 12
    });

    return (
        <div className="container mx-auto px-4 py-16">
            <h1 className="text-xl mb-6 font-robert-medium">
                {query ? `Resultados para "${query}"` : 'Te puede interesar'}
            </h1>
            <ProductList
                products={products}
                isLoading={isLoading}
                error={null}
                isAdminView={false}
            />
        </div>
    );
}
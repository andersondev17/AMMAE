'use client';

import ErrorBoundary from '@/components/ErrorBoundary';
import { ProductList } from '@/components/product/ProductList';
import { Spinner } from '@/components/ui/Spinner';
import { useProducts } from '@/hooks/useProducts';
import { notFound } from 'next/navigation';

const validCategories = ['jeans', 'blusas', 'vestidos', 'accesorios'];

export default function CategoryPage({ params }: { params: { categoria: string } }) {
    const categoria = params.categoria.toLowerCase();

    // Validación de categoría
    if (!validCategories.includes(categoria)) {
        notFound();
    }

    const {
        products,
        isLoading,
        error,
        totalCount,
    } = useProducts({
        categoria: categoria,
        limit: 12,
        sortBy: '-createdAt'
    });

    return (
        <ErrorBoundary fallback={
            <div className="flex items-center justify-center min-h-[400px]">
                <p className="text-red-500">Algo salió mal. Por favor, intenta recargar la página.</p>
            </div>
        }>
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-8">Colección {categoria}</h1>

                {isLoading && !products.length ? (
                    <div className="flex justify-center items-center min-h-[400px]">
                        <Spinner />
                    </div>
                ) : (
                    <>
                        {totalCount > 0 && (
                            <p className="text-gray-600 mb-6">
                                {totalCount} productos encontrados
                            </p>
                        )}

                        <ProductList
                            products={products}
                            isLoading={isLoading}
                            error={error}
                            isAdminView={false}
                        />

                        
                    </>
                )}
            </div>
        </ErrorBoundary>
    );
}
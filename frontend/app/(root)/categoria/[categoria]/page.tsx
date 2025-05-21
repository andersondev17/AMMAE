// app/categoria/[categoria]/page.tsx
'use client';

import ErrorBoundary from '@/components/ErrorBoundary';
import { Skeleton } from '@/components/ui';
import { useProducts } from '@/hooks/product/useProducts';
import { PRODUCT_CATEGORIES, ProductCategory } from '@/types/product.types';
import dynamic from 'next/dynamic';
import { notFound } from 'next/navigation';
import { memo, useCallback } from 'react';

const ProductList = dynamic(
    () => import('@/components/product/ProductList').then(mod => mod.ProductList),
    {
        loading: () => <Skeleton />,
        ssr: false
    }
);

const ErrorFallback = memo(({ message, onRetry }: { message: string; onRetry: () => void }) => (
  <div className="container mx-auto px-4 py-16 text-center">
    <h2 className="text-xl font-medium text-gray-900 mb-4">No se pudieron cargar los productos</h2>
    <p className="text-gray-600 mb-6">{message}</p>
    <button
      onClick={onRetry}
      className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
      aria-label='Reintentar carga de productos'
    >
      Reintentar
    </button>
  </div>
));

ErrorFallback.displayName = 'ErrorFallback';

export default function CategoryPage({ params }: { params: { categoria: string } }) {
  const normalizedCategory = params.categoria.charAt(0).toUpperCase() + params.categoria.slice(1).toLowerCase();
  
  if (!PRODUCT_CATEGORIES.includes(normalizedCategory as ProductCategory)) {
    notFound();
  }
  
  const {
    products,
    isLoading,
    error,
    totalCount,
    refresh
  } = useProducts({
    categoria: normalizedCategory,
    limit: 12,
    sortBy: '-createdAt',
    fields: 'nombre,precio,imagenes,categoria,tallas,colores,enOferta,precioOferta,stock'
  });

  // Handler para reintentar la carga
  const handleRetry = useCallback(() => refresh(), [refresh]);

  const renderContent = () => {
    // Si hay error, mostramos el mensaje
    if (error) {
      return <ErrorFallback message={error.message} onRetry={handleRetry} />;
    }

    //  devolvemos el ProductList,  maneja internamente los estados isLoading y error
    return (
      <>
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Colección {normalizedCategory}
          </h1>
          
          {!isLoading && (
            <p className="text-gray-600">
              {totalCount} productos encontrados
            </p>
          )}
        </div>
        
        <ProductList
          products={products}
          isLoading={isLoading}
          error={error}
          isAdminView={false}
        />
      </>
    );
  };

  return (
    <ErrorBoundary
      fallback={
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-red-500">Error al cargar la página. Por favor, intenta nuevamente.</p>
        </div>
      }
    >
      <div className="container mx-auto px-4 py-8 pt-24">
        {renderContent()}
      </div>
    </ErrorBoundary>
  );
}
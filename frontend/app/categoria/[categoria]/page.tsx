// app/categoria/[categoria]/page.tsx
'use client';

import ErrorBoundary from '@/components/ErrorBoundary';
import { ProductList } from '@/components/product/ProductList';
import { Spinner } from '@/components/ui/Spinner';
import { useProducts } from '@/hooks/product/useProducts';
import { capitalize } from '@/utils/formatting';
import { notFound } from 'next/navigation';
import { useCallback } from 'react';

// Using Set for faster lookups
const VALID_CATEGORIES = new Set(['Jeans', 'Blusas', 'Vestidos', 'Accesorios']);

// Simple functional components without unnecessary memoization
const ErrorMessage = ({ message, onRetry }: { message: string; onRetry: () => void }) => (
  <section className="container mx-auto px-4 py-8">
    <div className="text-center">
      <h1 className="text-2xl font-zentry font-bold text-gray-800 mb-4">
        Error al cargar los productos
      </h1>
      <p className="font-inter text-gray-600 mb-4">{message}</p>
      <button
        onClick={onRetry}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 
                 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="Intentar nuevamente"
      >
        Intentar nuevamente
      </button>
    </div>
  </section>
);

const ProductCount = ({ count }: { count: number }) => (
  <p className="font-inter text-gray-600 mb-6">
    {count > 0 
      ? `${count} productos encontrados`
      : 'No hay productos disponibles en esta categoría'
    }
  </p>
);

export default function CategoryPage({ params }: { params: { categoria: string } }) {
  // Normalize and validate category
  const categoria = capitalize(params.categoria);
  
  if (!VALID_CATEGORIES.has(categoria)) {
    notFound();
  }

  // Use hook with direct config object
  const {
    products,
    isLoading,
    error,
    totalCount,
    refresh
  } = useProducts({
    categoria,
    limit: 12,
    sortBy: '-createdAt'
  });

  // Simple callback for refresh
  const handleRetry = useCallback(() => refresh(), [refresh]);

  // Early return for errors
  if (error) {
    return <ErrorMessage message={error.message} onRetry={handleRetry} />;
  }

  return (
    <ErrorBoundary
      fallback={
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="font-inter text-red-500">
            Error al cargar la página. Por favor, intenta recargar.
          </p>
        </div>
      }
    >
      <section className="container mx-auto px-4 py-8 pt-24">
        <h1 className="font-zentry text-3xl font-bold mb-4">
          Colección {categoria}
        </h1>

        {isLoading ? (
          <div className="flex justify-center items-center min-h-[400px]" aria-live="polite" role="status">
            <Spinner />
            <span className="sr-only">Cargando productos...</span>
          </div>
        ) : (
          <>
            <ProductCount count={totalCount} />
            <ProductList
              products={products}
              isLoading={isLoading}
              error={error}
              isAdminView={false}
            />
          </>
        )}
      </section>
    </ErrorBoundary>
  );
}
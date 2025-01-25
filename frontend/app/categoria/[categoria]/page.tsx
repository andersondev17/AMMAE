// app/categoria/[categoria]/page.tsx
'use client';

import ErrorBoundary from '@/components/ErrorBoundary';
import { ProductList } from '@/components/product/ProductList';
import { Spinner } from '@/components/ui/Spinner';
import { useProducts } from '@/hooks/product/useProducts';
import { capitalize } from '@/utils/formatting';
import { notFound } from 'next/navigation';
import { memo, useCallback, useMemo } from 'react';

const validCategories = ['Jeans', 'Blusas', 'Vestidos', 'Accesorios'] as const;

// Componente de error memoizado
const ErrorMessage = memo(({ message, onRetry }: { message: string; onRetry: () => void }) => (
  <div className="container mx-auto px-4 py-8">
    <div className="text-center">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">
        Error al cargar los productos
      </h1>
      <p className="text-gray-600 mb-4">{message}</p>
      <button
        onClick={onRetry}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 
                 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Intentar nuevamente
      </button>
    </div>
  </div>
));
ErrorMessage.displayName = 'ErrorMessage';

// Componente contador de productos memoizado
const ProductCount = memo(({ count }: { count: number }) => (
  <p className="text-gray-600 mb-6">
    {count > 0 
      ? `${count} productos encontrados`
      : 'No hay productos disponibles en esta categoría'
    }
  </p>
));
ProductCount.displayName = 'ProductCount';

export default function CategoryPage({ params }: { params: { categoria: string } }) {
  // Validación y transformación de categoría
  const categoria = useMemo(() => {
    const normalizedCategory = capitalize(params.categoria);
    if (!validCategories.includes(normalizedCategory as any)) {
      notFound();
    }
    return normalizedCategory;
  }, [params.categoria]);

  // Hook de productos con configuración memoizada
  const queryConfig = useMemo(() => ({
    categoria,
    limit: 12,
    sortBy: '-createdAt'
  }), [categoria]);

  const {
    products,
    isLoading,
    error,
    totalCount,
    refresh
  } = useProducts(queryConfig);

  // Callback memoizado para refresh
  const handleRetry = useCallback(() => {
    refresh();
  }, [refresh]);

  // Renderizado condicional temprano para errores
  if (error) {
    return <ErrorMessage message={error.message} onRetry={handleRetry} />;
  }

  return (
    <ErrorBoundary
      fallback={
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-red-500">
            Error al cargar la página. Por favor, intenta recargar.
          </p>
        </div>
      }
    >
      <div className="container mx-auto px-4 py-8 pt-24">
        <h1 className="text-3xl font-bold mb-4">
          Colección {categoria}
        </h1>

        {isLoading ? (
          <div className="flex justify-center items-center min-h-[400px]" role="status">
            <Spinner />
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
      </div>
    </ErrorBoundary>
  );
}
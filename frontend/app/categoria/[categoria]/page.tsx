// app/categoria/[categoria]/page.tsx
'use client';

import ErrorBoundary from '@/components/ErrorBoundary';
import { ProductList } from '@/components/product/ProductList';
import { Spinner } from '@/components/ui/Spinner';
import { useProducts } from '@/hooks/product/useProducts';
import { capitalize } from '@/utils/formatting';
import { notFound } from 'next/navigation';
import { useEffect } from 'react';

const validCategories = ['Jeans', 'Blusas', 'Vestidos', 'Accesorios'];

export default function CategoryPage({ params }: { params: { categoria: string } }) {
  const categoria = capitalize(params.categoria);

  // Validación de categoría
  useEffect(() => {
    if (!validCategories.includes(categoria)) {
      notFound();
    }
  }, [categoria]);

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

  // Manejo de errores de carga
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Error al cargar los productos
          </h1>
          <p className="text-gray-600 mb-4">{error.message}</p>
          <button
            onClick={() => refresh()}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            Intentar nuevamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary
      fallback={
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-red-500">
            Algo salió mal. Por favor, intenta recargar la página.
          </p>
        </div>
      }
    >
      <div className="container mx-auto px-4 py-8 pt-24">
        <h1 className="text-3xl font-bold mb-4">
          Colección {categoria}
        </h1>

        {isLoading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <Spinner />
          </div>
        ) : (
          <>
            {totalCount > 0 ? (
              <p className="text-gray-600 mb-6">
                {totalCount} productos encontrados
              </p>
            ) : (
              <p className="text-gray-600 mb-6">
                No hay productos disponibles en esta categoría
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
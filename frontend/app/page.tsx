'use client';

import ErrorBoundary from '@/components/ErrorBoundary';
import { ProductList } from '@/components/product/ProductList';
import { Spinner } from '@/components/ui/Spinner';
import { useProducts } from '@/hooks/useProducts';
import { Package } from 'lucide-react';
import Link from 'next/link';

  export default function Home() {
  // Utilizamos el hook useProducts con configuración inicial
  const {
    products,
    isLoading,
    error,
    totalCount,
    refresh
  } = useProducts({
    page: 1,
    limit: 12,
    sortBy: '-createdAt' // Mostrar los más recientes primero
  });

  return (
    <ErrorBoundary fallback={
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-red-500">Algo salió mal. Por favor, intenta recargar la página.</p>
      </div>
    }>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Nuestros Productos</h1>
            {!isLoading && (
              <p className="text-sm text-gray-500 mt-1">
                {totalCount} productos disponibles
              </p>
            )}
          </div>
          <Link
            href="/admin/products"
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Package className="h-5 w-5 mr-2" />
            <span className="font-medium">Administrar Productos</span>
          </Link>
        </div>

        {/* Estado de carga inicial */}
        {isLoading && !products.length ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <Spinner />
          </div>
        ) : (
          <ProductList
            products={products}
            isLoading={isLoading}
            error={error}
            isAdminView={false}
          />
        )}

        {/* Botón para recargar los productos */}
        {error && (
          <div className="text-center mt-4">
            <button
              onClick={() => refresh()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Intentar nuevamente
            </button>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}
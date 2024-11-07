'use client';

import ErrorBoundary from '@/components/ErrorBoundary';
import { VideoHero } from '@/components/Layout/VideoHero/VideoHero';
import { ProductList } from '@/components/product/ProductList';
import { Spinner } from '@/components/ui/Spinner';
import { useProducts } from '@/hooks/useProducts';
import { Package } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const {
    products,
    isLoading,
    error,
    totalCount,
    refresh
  } = useProducts({
    page: 1,
    limit: 12,
    sortBy: '-createdAt'
  });

  const scrollToProducts = () => {
    const productsSection = document.getElementById('products-section');
    productsSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <ErrorBoundary fallback={
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-red-500">Algo salió mal. Por favor, intenta recargar la página.</p>
      </div>
    }>
      <VideoHero
        videoUrl="/assets/videos/fashion-hero.mp4"
        title="AMMAE COLLECTION"
        subtitle="Descubre nuestra exclusiva colección de moda femenina"
        ctaText="Ver Colección"
        onCtaClick={scrollToProducts}
      />

      <section id="products-section" className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-16">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold">Nuestros Productos</h2>
              {!isLoading && (
                <p className="text-sm text-gray-500 mt-1">
                  {totalCount} productos disponibles
                </p>
              )}
            </div>
            <Link
              href="/admin/products"
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md 
                       hover:bg-blue-700 transition-colors"
            >
              <Package className="h-5 w-5 mr-2" />
              <span className="font-medium">Administrar Productos</span>
            </Link>
          </div>

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

          {error && (
            <div className="text-center mt-4">
              <button
                onClick={() => refresh()}
                className="px-4 py-2 bg-blue-600 text-white rounded-md 
                         hover:bg-blue-700 transition-colors"
              >
                Intentar nuevamente
              </button>
            </div>
          )}
        </div>
      </section>
    </ErrorBoundary>
  );
}
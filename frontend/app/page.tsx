'use client';

import ErrorBoundary from '@/components/ErrorBoundary';
import CategoriesSection from '@/components/Layout/CategoriesSection';
import { VideoHero } from '@/components/Layout/VideoHero/VideoHero';
import { ProductSkeleton } from '@/components/skeletons/ProductSkeleton';
import { BackToTop } from '@/components/ui/backToTop';
import { useProducts } from '@/hooks/product/useProducts';
import { cn } from '@/lib/utils';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Package } from 'lucide-react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Suspense, useCallback } from 'react';

// Carga dinámica optimizada de ProductList
const ProductList = dynamic(
  () => import('@/components/product/ProductList').then(mod => ({ default: mod.ProductList })),
  { loading: () => <ProductSkeleton /> }
);

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

  // Función optimizada para scroll suave
  const scrollToProducts = useCallback(() => {
    document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <ErrorBoundary fallback={
      <div className="flex-center min-h-[400px]">
        <p className="text-red-500 font-robert-medium">Error al cargar la página</p>
      </div>
    }>
      <Suspense fallback={<ProductSkeleton />}>
        {/* Primer Hero con video */}
        <VideoHero
          videoUrl="/assets/videos/fashion-hero.mp4"
          placeholderImage="/assets/images/demo/default-product.jpg"
          title="AMMAE COLLECTION"
          subtitle="Descubre nuestra exclusiva colección de moda femenina"
          ctaText="Ver Colección"
          onCtaClick={scrollToProducts}
        />

        {/* Segundo Hero estático para promoción */}
        <VideoHero
          placeholderImage="/assets/images/hero.png"
          title="Club de San Valentín"
          subtitle="Colección disponible solo por tiempo limitado"
          ctaText="Ver más"
          onCtaClick={scrollToProducts}
        />
        
        {/* Sección de categorías */}
        <CategoriesSection />

        {/* Sección de productos */}
        <section id="products-section" className="min-h-screen bg-white py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-12">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-10">
              <div>
                <h2 className="font-zentry font-bold text-2xl md:text-3xl flex items-center gap-2 tracking-wide">
                  <ArrowForwardIcon className="text-blue-600" />
                  <span className="uppercase">Te puede interesar</span>
                </h2>
                {!isLoading && totalCount > 0 && (
                  <p className="text-sm text-gray-500 mt-1 font-robert-regular">
                    {totalCount} productos disponibles
                  </p>
                )}
              </div>

              <Link
                href="/admin/products"
                className={cn(
                  "flex items-center px-6 py-3 bg-blue-600 text-white",
                  "font-zentry tracking-wide rounded-lg shadow-md",
                  "hover:bg-blue-700 transition-all duration-300 transform hover:scale-[1.02]"
                )}
              >
                <Package className="h-5 w-5 mr-2" />
                <span>Administrar Productos</span>
              </Link>
            </div>

            {/* Contenido condicional basado en el estado de carga */}
            {isLoading ? (
              <ProductSkeleton />
            ) : (
              <ProductList
                products={products}
                isLoading={isLoading}
                error={error}
                isAdminView={false}
              />
            )}

            {/* Botón de reintentar en caso de error */}
            {error && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={() => refresh()}
                  className={cn(
                    "px-6 py-3 bg-blue-600 text-white font-zentry tracking-wide",
                    "rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300"
                  )}
                >
                  Reintentar
                </button>
              </div>
            )}
          </div>
        </section>
      </Suspense>
      
      <BackToTop />
    </ErrorBoundary>
  );
}
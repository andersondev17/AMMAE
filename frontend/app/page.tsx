'use client';

import ErrorBoundary from '@/components/ErrorBoundary';
import CategoriesSection from '@/components/Layout/CategoriesSection';
import { VideoHero } from '@/components/Layout/VideoHero/VideoHero';
import { ProductSkeleton } from '@/components/skeletons/ProductSkeleton';
import { BackToTop } from '@/components/ui/backToTop';
import { useProducts } from '@/hooks/product/useProducts';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Package } from 'lucide-react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Suspense, useState } from 'react';

const ProductList = dynamic(() => import('@/components/product/ProductList').then(mod => ({
  default: mod.ProductList
})), {
  loading: () => <ProductSkeleton />
});

// Optimized Home component
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

  const [loading, setLoading] = useState(true);

  // Simplified smooth scroll
  const scrollToProducts = () => {
    document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <ErrorBoundary fallback={
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-red-500">Error al cargar la página</p>
      </div>
    }>

      <Suspense fallback={<ProductSkeleton />}>
        <VideoHero
          videoUrl="/assets/videos/fashion-hero.mp4"
          placeholderImage="/assets/images/demo/default-product.jpg"
          title="AMMAE COLLECTION"
          subtitle="Descubre nuestra exclusiva colección de moda femenina"
          ctaText="Ver Colección"

          onCtaClick={scrollToProducts}
        />


        <VideoHero
          placeholderImage="/assets/images/hero.png"
          title="Club de San Valentín"
          subtitle="Coleccion disponible solo por tiempo limitado"
          ctaText="Ver mas"
          onCtaClick={scrollToProducts}
        />
        <CategoriesSection />

        <section id="products-section" className="min-h-screen bg-white">
          <div className="container mx-auto px-4 py-16">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-bold flex items-center gap-2">
                  <ArrowForwardIcon />
                  TE PUEDE INTERESAR
                </h2>
                {!isLoading && (
                  <p className="text-sm text-gray-500 mt-1">
                    {totalCount} productos disponibles
                  </p>
                )}
              </div>

              <Link
                href="/admin/products"
                className="flex items-center px-8 py-4 bg-blue-600 text-white font-medium rounded-lg
                         hover:bg-blue-700 transition-colors shadow-md"
              >
                <Package className="h-5 w-5 mr-2" />
                Administrar Productos
              </Link>
            </div>

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

            {error && (
              <button
                onClick={() => refresh()}
                className="mx-auto mt-4 px-4 py-2 bg-blue-600 text-white rounded-md 
                       hover:bg-blue-700 transition-colors"
              >
                Reintentar
              </button>
            )}
          </div>
        </section>
      </Suspense>
      <BackToTop />

    </ErrorBoundary>
  );
}
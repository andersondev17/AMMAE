'use client';

import ErrorBoundary from '@/components/ErrorBoundary';
import CategoriesSection from '@/components/Layout/CategoriesSection';
import { VideoHero } from '@/components/Layout/VideoHero/VideoHero';
import { ProductList } from '@/components/product/ProductList';
import { ProductSkeleton } from '@/components/skeletons/ProductSkeleton';
import { useProducts } from '@/hooks/product/useProducts';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { motion } from 'framer-motion';
import { Package } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';


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
    <Suspense fallback={<ProductSkeleton />}>

      <VideoHero
        videoUrl="/assets/videos/fashion-hero.mp4"
        title="AMMAE COLLECTION"
        subtitle="Descubre nuestra exclusiva colección de moda femenina"
        ctaText="Ver Colección"
        onCtaClick={scrollToProducts}
      />
      <CategoriesSection />
      <section id="products-section" className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-16">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold flex items-center">
                <ArrowForwardIcon className="mr-2" />
                TE PUEDE INTERESAR
              </h2>
              {!isLoading && (
                <p className="text-sm text-gray-500 mt-1">
                  {totalCount} productos disponibles
                </p>
              )}
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <Link href="/admin/products" passHref>
                <motion.button
                  className="flex items-center px-8 py-4 bg-blue-600 text-white font-medium rounded-full
                                       hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Package className="h-5 w-5 mr-2" />
                  Administrar Productos
                </motion.button>
              </Link>
            </motion.div>
          </div>

          {isLoading && !products.length ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <ProductSkeleton />
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
      </Suspense>

    </ErrorBoundary>
  );
}
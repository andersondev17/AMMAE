'use client';

import ErrorBoundary from '@/components/ErrorBoundary';
import CategoriesSection from '@/components/Layout/CategoriesSection';
import { VideoHero } from '@/components/Layout/VideoHero/VideoHero';
import { BackToTop } from '@/components/ui/backToTop';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronRight } from 'lucide-react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRef } from 'react';

const ProductRecommendations = dynamic(() =>
  import('@/components/product/detail/ProductRecommendations'), {
  ssr: false,
  loading: () => (
    <div className="min-h-[400px] flex items-center justify-center">
      <div className="w-8 h-8 border-t-2 border-blue-500 rounded-full animate-spin"></div>
    </div>
  )
});

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Home() {
  const pageRef = useRef<HTMLElement>(null);
  const productsRef = useRef<HTMLDivElement>(null);

  const scrollToProducts = () => {
    document.getElementById('products-section')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  };

  useGSAP(() => {
    if (!pageRef.current || !productsRef.current) return;

    gsap.set(productsRef.current, {
      y: 100,
      borderRadius: "2.5rem 2.5rem 0 0"
    });

    gsap.to(productsRef.current, {
      y: 0,
      scrollTrigger: {
        trigger: productsRef.current,
        start: "top bottom",
        end: "top center",
        scrub: 0.8,
      }
    });
  }, { scope: pageRef, dependencies: [] });

  return (
    <ErrorBoundary fallback={<div className="min-h-[400px] flex items-center justify-center">Error</div>}>
      <main ref={pageRef} className="relative overflow-hidden">
        {/* Hero principal */}
        <VideoHero
          placeholderImage="/assets/images/hero.avif"
          title="AMMAE COLLECTION"
          subtitle="Descubre nuestra exclusiva colección de moda femenina"
          ctaText="Ver Colección"
          onCtaClick={scrollToProducts}
        />


        <div
          ref={productsRef}
          id="products-section"
          className="relative z-30 bg-black -mt-24 sm:-mt-28 md:-mt-32 shadow-xl transform-gpu will-change-transform min-h-[600px]"
        >
          <div className="w-full h-24 flex items-center justify-center">
            <div className="h-1 w-16 bg-gradient-to-r from-blue-500 via-gray-200 to-transparent rounded-full" />
          </div>

          <CategoriesSection />

          <div className="mt-12">
            <VideoHero
              placeholderImage="/assets/images/demo/accesorios/accesorio-1.png"
              title="Club de San Valentin"
              subtitle="Colección disponible solo por tiempo limitado"
              ctaText="Ver más"
              onCtaClick={scrollToProducts}
            />
          </div>

          <div className="mt-12">
            <ProductRecommendations />
          </div>
        </div>

        <div className="flex justify-center mt-12 pb-8">
          <Link
            href="/categoria/todos"
            className="group flex items-center px-6 py-3 border border-black hover:bg-black hover:text-white transition-colors"
          >
            <span className="mr-2">Ver todos los productos</span>
            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </main>

      <BackToTop />
    </ErrorBoundary>
  );
}
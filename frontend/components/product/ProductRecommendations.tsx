'use client';

import { Product } from '@/types';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { ProductCard } from '../product/ProductCard';
import { Button } from '../ui/button';

interface ProductRecommendationsProps {
    categoryId: string;
    currentProductId: string;
    limit?: number;
}

export default function ProductRecommendations({
    categoryId,
    currentProductId,
    limit = 4
}: ProductRecommendationsProps) {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [scrollPosition, setScrollPosition] = useState(0);

    const { ref, inView } = useInView({
        threshold: 0.1,
        triggerOnce: true
    });

    // Fetch similar products
    useEffect(() => {
        if (!inView) return;

        const fetchRecommendations = async () => {
            try {
                setIsLoading(true);
                setError(null);

                // Fetch products from the same category
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/productos/categoria/${categoryId}?limit=${limit + 1}`
                );

                if (!response.ok) throw new Error('Error al cargar productos recomendados');

                const data = await response.json();
                // Filter out the current product
                const filteredProducts = data.data.filter(
                    (product: Product) => product._id !== currentProductId
                ).slice(0, limit);

                setProducts(filteredProducts);
            } catch (err) {
                setError('No se pudieron cargar las recomendaciones');
                console.error('Error fetching recommendations:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchRecommendations();
    }, [categoryId, currentProductId, inView, limit]);

    // Handle carousel scroll
    const scroll = useCallback((direction: 'left' | 'right') => {
        const container = document.getElementById('recommendations-container');
        if (!container) return;

        const scrollAmount = container.clientWidth * 0.8;
        const newPosition = direction === 'left'
            ? Math.max(0, scrollPosition - scrollAmount)
            : scrollPosition + scrollAmount;

        container.scrollTo({
            left: newPosition,
            behavior: 'smooth'
        });

        setScrollPosition(newPosition);
    }, [scrollPosition]);

    // Skeleton loading state
    if (isLoading) {
        return (
            <div className="grid grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="animate-pulse">
                        <div className="aspect-[3/4] bg-gray-200 rounded-lg"></div>
                        <div className="mt-2 h-4 bg-gray-200 rounded w-2/3"></div>
                        <div className="mt-1 h-4 bg-gray-200 rounded w-1/3"></div>
                    </div>
                ))}
            </div>
        );
    }

    if (error) {
        return null;
    }

    if (products.length === 0) {
        return null;
    }

    return (
        <div className="relative" ref={ref}>
            {/* Navigation buttons */}
            <div className="absolute -left-4 top-1/2 -translate-y-1/2 z-10">
                <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full bg-white shadow-md"
                    onClick={() => scroll('left')}
                    disabled={scrollPosition <= 0}
                >
                    <ArrowLeft className="h-4 w-4" />
                </Button>
            </div>

            <div className="absolute -right-4 top-1/2 -translate-y-1/2 z-10">
                <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full bg-white shadow-md"
                    onClick={() => scroll('right')}
                >
                    <ArrowRight className="h-4 w-4" />
                </Button>
            </div>

            {/* Products carousel */}
            <div
                id="recommendations-container"
                className="flex overflow-x-auto scrollbar-hide gap-4 pb-4 -mx-4 px-4"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {products.map(product => (
                    <div key={product._id} className="min-w-[250px] max-w-[300px] flex-shrink-0">
                        <ProductCard
                            product={product}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
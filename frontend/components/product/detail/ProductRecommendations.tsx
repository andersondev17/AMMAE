'use client';

import { ProductCard } from '@/components/product/ProductCard';
import { Button } from '@/components/ui/button';
import { useProducts } from '@/hooks/product/useProducts';
import { Product } from '@/types';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef } from 'react';

interface ProductRecommendationsProps {
    title?: string;
    subtitle?: string;
    limit?: number;
    filter?: 'popular' | 'new' | 'sale';
    excludeProductId?: string;
}

export const ProductRecommendations = ({
    title = "PRODUCTOS RECOMENDADOS",
    subtitle,
    limit = 8,
    filter = 'popular',
    excludeProductId
}: ProductRecommendationsProps) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // Query para obtener los productos
    const { products, isLoading } = useProducts({
        limit,
        sortBy: filter === 'new' ? '-createdAt' : '-precio',
        enOferta: filter === 'sale'
    });

    // Filtrar productos para excluir el producto actual si estamos en una página de detalle
    const filteredProducts = excludeProductId
        ? products.filter((product: Product) => product._id !== excludeProductId)
        : products;

    // Función para desplazar el carrusel
    const scroll = (direction: 'left' | 'right') => {
        if (!scrollContainerRef.current) return;

        const container = scrollContainerRef.current;
        const scrollAmount = container.clientWidth * 0.75;

        if (direction === 'left') {
            container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        } else {
            container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    // Si no hay productos después de filtrar, no mostramos nada
    if (!isLoading && (!filteredProducts || filteredProducts.length === 0)) {
        return null;
    }

    return (
        <section className="py-12 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-end mb-8">
                    
                    <div>
                        <h2 className="text-2xl font-semibold font-zentry">{title}</h2>
                        {subtitle && <p className="text-gray-500 mt-1">{subtitle}</p>}
                    </div>

                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => scroll('left')}
                            className="rounded-full border-gray-300 hover:border-gray-900 transition-colors"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => scroll('right')}
                            className="rounded-full border-gray-300 hover:border-gray-900 transition-colors"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                <div
                    ref={scrollContainerRef}
                    className="flex overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {isLoading ? (
                        // Placeholders durante la carga
                        Array.from({ length: 4 }).map((_, i) => (
                            <div
                                key={`skeleton-${i}`}
                                className="min-w-[280px] h-[400px] bg-gray-100 animate-pulse rounded-md mr-4 flex-shrink-0 snap-start"
                            />
                        ))
                    ) : (
                        filteredProducts.map((product: Product) => (
                            <div
                                key={product._id}
                                className="min-w-[280px] max-w-[280px] mr-4 flex-shrink-0 snap-start"
                            >
                                <ProductCard
                                    product={product}
                                    isAdminView={false}
                                />
                            </div>
                        ))
                    )}
                </div>
            </div>
        </section>
    );
};

export default ProductRecommendations;
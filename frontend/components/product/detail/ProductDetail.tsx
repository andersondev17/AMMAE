// components/product/ProductDetail.tsx
import { Product } from '@/types';
import { memo } from 'react';
import { ProductBreadcrumb } from './ProductBreadcrumb';

import { Skeleton } from '@/components/ui';
import dynamic from 'next/dynamic';
import ProductRecommendations from './ProductRecommendations';

const ProductGallery = dynamic(
    () => import('@/components/product/detail/ProductGallery'),
    {
        loading: () => <Skeleton />,
        ssr: false
    }
);
const ProductContent = dynamic( () => import('./ProductContent'), {
    loading: () => <Skeleton />,
    ssr: false
} )
interface ProductDetailProps {
    product: Product;
}

const ProductDetail = memo(({ product }: ProductDetailProps) => {
    // Calcular descuento una vez aquí y pasarlo a los componentes hijos
    const discount = product.enOferta && product.precioOferta
        ? Math.round(((product.precio - product.precioOferta) / product.precio) * 100)
        : 0;

    return (
        <div className="max-w-7xl mx-auto p-4 space-y-6 py-10">
            <ProductBreadcrumb product={product} />

            <div className="grid md:grid-cols-2 gap-8">
                <ProductGallery product={product} />
                <ProductContent product={product} discount={discount} />
            </div>

            <ProductRecommendations
                title="PRODUCTOS SIMILARES"
                subtitle={`Más productos en ${product.categoria}`}
                filter="popular"
                excludeProductId={product._id}
            />
        </div>
    );
});

ProductDetail.displayName = 'ProductDetail';

export default ProductDetail;
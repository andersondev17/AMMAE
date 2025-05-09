// components/product/ProductDetail.tsx
import { Product } from '@/types';
import { memo } from 'react';
import { ProductBreadcrumb } from './ProductBreadcrumb';
import ProductContent from './ProductContent';
import ProductGallery from './ProductGallery';
import ProductRecommendations from './ProductRecommendations';

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
                categoryId={product.categoria}
                currentProductId={product._id}
            />
        </div>
    );
});

ProductDetail.displayName = 'ProductDetail';

export default ProductDetail;
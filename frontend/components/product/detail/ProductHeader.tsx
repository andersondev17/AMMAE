// components/product/ProductHeader.tsx
import { Product } from "@/types/product.types";
import { memo } from "react";

const StockStatus = memo(({ stock }: { stock: number }) => {
    if (stock === 0) {
        return <span className="text-red-600 font-medium">Agotado</span>;
    }

    if (stock <= 5) {
        return <span className="text-amber-600 font-medium">¡Solo {stock} en stock!</span>;
    }

    return <span className="text-green-600 font-medium">En stock</span>;
});

const ProductHeader = memo(({ product, discount }: {
    product: Product;
    discount: number;
}) => (
    <div className="space-y-4">
        <div>
            <h1 className="text-2xl font-medium">{product.nombre}</h1>
            <p className="text-gray-500 mt-1">{product.categoria}</p>
        </div>

        <div className="flex items-baseline gap-4">
            {discount > 0 ? (
                <>
                    <span className="text-2xl font-medium">${product.precioOferta?.toFixed(2)}</span>
                    <span className="text-gray-500 line-through text-sm">${product.precio.toFixed(2)}</span>
                    <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-medium">
                        -{discount}% OFF
                    </span>
                </>
            ) : (
                <span className="text-2xl font-medium">${product.precio.toFixed(2)}</span>
            )}
        </div>

        <div className="flex items-center gap-2 text-sm">
            <StockStatus stock={product.stock} />
            {product.stock > 0 && (
                <>
                    <span className="text-gray-300">•</span>
                    <span className="text-gray-500">SKU: {product._id.substring(product._id.length - 8)}</span>
                </>
            )}
        </div>
    </div>
));

ProductHeader.displayName = 'ProductHeader';

export default ProductHeader;
// components/product/ProductCard.tsx
import { useCart } from '@/hooks/useCart';
import { Product, ProductCardProps } from '@/types';
import { DEFAULT_IMAGES, getProductImages } from '@/utils/demoImages';
import { Edit, Trash } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { ProductSkeleton } from '../skeletons/ProductSkeleton';
import { Button } from '../ui/button';
// Subcomponentes
const ProductImage = memo(({
    product,
    isHovering,
    onError
}: {
    product: Product;
    isHovering: boolean;
    onError?: () => void;
}) => {
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState(false);
    const { primary, hover } = useMemo(() => getProductImages(product), [product]);

    useEffect(() => {
        let mounted = true;
        const preloadImages = async () => {
            try {
                setIsLoading(true);
                setLoadError(false);

                await Promise.all([
                    new Promise<void>((resolve, reject) => {
                        const img = document.createElement('img');
                        img.onload = () => mounted && resolve();
                        img.onerror = () => mounted && reject();
                        img.src = primary;
                    }),
                    new Promise<void>((resolve, reject) => {
                        const img = document.createElement('img');
                        img.onload = () => mounted && resolve();
                        img.onerror = () => mounted && reject();
                        img.src = hover;
                    })
                ]);

                if (mounted) setIsLoading(false);
            } catch (err) {
                if (mounted) {
                    setLoadError(true);
                    setIsLoading(false);
                    onError?.();
                }
            }
        };

        preloadImages();
        return () => { mounted = false; };
    }, [primary, hover, onError]);

    if (isLoading) return <ProductSkeleton />;

    if (loadError) {
        return (
            <div className="relative aspect-square w-full overflow-hidden bg-gray-50">
                <Image
                    src={DEFAULT_IMAGES.primary}
                    alt="Imagen no disponible"
                    fill
                    className="object-cover"
                    priority
                />
            </div>
        );
    }

    return (
        <div className="relative aspect-square w-full overflow-hidden bg-white">
            <div className="absolute inset-0">
                <Image
                    src={primary}
                    alt={product.nombre}
                    className={`
                        w-full h-full object-cover
                        transition-opacity duration-300 ease-out
                        ${isHovering ? 'opacity-0' : 'opacity-100'}
                    `}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority
                />
                <Image
                    src={hover}
                    alt={`${product.nombre} - alternativa`}
                    className={`
                        w-full h-full object-cover
                        transition-opacity duration-300 ease-out
                        ${isHovering ? 'opacity-100' : 'opacity-0'}
                    `}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
            </div>
        </div>
    );
});

export const ProductCard = memo(({
    product,
    onEdit,
    onDelete,
    isAdminView = false
}: ProductCardProps) => {
    const [isHovering, setIsHovering] = useState(false);
    const [imageError, setImageError] = useState(false);

    const handleEdit = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (onEdit) onEdit(product);
    }, [onEdit, product]);

    const handleDelete = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        if (onDelete && window.confirm('¿Estás seguro de que deseas eliminar este producto?')) {
            onDelete(product._id);
        }
    }, [onDelete, product._id]);

    return (
        <div
            className="group relative bg-white overflow-hidden rounded-none border-0 transition-all duration-300 hover:shadow-xl"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
        >
            <Link href={`/product/${product._id}`} className="block">
                <ProductImage
                    product={product}
                    isHovering={isHovering}
                    onError={() => setImageError(true)}
                />

                {/* Badges y controles */}
                <div className="absolute top-0 left-0 right-0 p-4">
                    {product.enOferta && (
                        <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 text-xs font-medium">
                            SALE
                        </div>
                    )}

                    {isAdminView && (
                        <div className="absolute top-4 left-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                            <Button
                                size="icon"
                                variant="secondary"
                                onClick={handleEdit}
                                className="hover:scale-105 transition-transform"
                            >
                                <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                                size="icon"
                                variant="destructive"
                                onClick={handleDelete}
                                className="hover:scale-105 transition-transform"
                            >
                                <Trash className="h-4 w-4" />
                            </Button>
                        </div>
                    )}
                </div>

                {/* Información del producto */}
                <div className="p-4">
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                        {product.nombre}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">{product.estilo}</p>
                    <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold">
                                ${product.precio.toFixed(2)}
                            </span>
                            {product.enOferta && product.precioOferta && (
                                <span className="text-sm text-red-500 line-through">
                                    ${product.precioOferta.toFixed(2)}
                                </span>
                            )}
                        </div>
                        {isAdminView && (
                            <span className="text-xs text-gray-500">
                                Stock: {product.stock}
                            </span>
                        )}
                    </div>
                </div>
            </Link>

            {/* Quick Add button */}
            {!isAdminView && (
                <div
                    className={`
                        absolute bottom-0 left-0 right-0 
                        bg-white/90 backdrop-blur-sm
                        transition-all duration-300
                        ${isHovering ? 'translate-y-0' : 'translate-y-full'}
                    `}
                >
                    <button
                        className="w-full py-4 text-sm font-medium text-black hover:bg-black hover:text-white transition-colors"
                        onClick={(e) => {
                            e.preventDefault();
                            const cart = useCart.getState();
                            cart.addItem(product);
                        }}
                    >
                        Añadir al carrito
                    </button>
                </div>
            )}
        </div>
    );
});

// Display names
ProductCard.displayName = 'ProductCard';
ProductImage.displayName = 'ProductImage';
ProductSkeleton.displayName = 'ProductSkeleton';

export default ProductCard;
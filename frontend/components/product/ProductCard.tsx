import { Product, ProductCardProps } from '@/types';
import { demoImages, getImageUrl } from '@/utils/demoImages';
import { Edit, Trash } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { memo, useCallback, useState } from 'react';
import { Button } from '../ui/button';

// Compound Components para ProductCard
const ProductCardRoot = memo(({
    product,
    onEdit,
    onDelete,
    isAdminView = false,
    isLoading = false
}: ProductCardProps & { isLoading?: boolean }) => {
    const [isHovering, setIsHovering] = useState(false);
    const [imageError, setImageError] = useState(false);

    const handleMouseEnter = useCallback(() => setIsHovering(true), []);
    const handleMouseLeave = useCallback(() => setIsHovering(false), []);

    // Si está cargando, mostrar el skeleton
    if (isLoading) {
        return <ProductCard.Skeleton />;
    }

    const getProductImage = useCallback((imageUrl?: string): string => {
        if (imageError) return demoImages.default;
        return getImageUrl(imageUrl || '');
    }, [imageError]);

    const handleDelete = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        if (onDelete && window.confirm('¿Estás seguro de que deseas eliminar este producto?')) {
            onDelete(product._id);
        }
    }, [onDelete, product._id]);

    const handleEdit = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (onEdit) {
            const productToEdit = {
                ...product,
                imagenes: product.imagenes?.map(img =>
                    img.startsWith('http') || img.startsWith('/assets')
                        ? img
                        : `/assets/images/demo/${img}`
                ) || []
            };
            onEdit(productToEdit);
        }
    }, [onEdit, product]);

    return (
        <div
            className="group relative h-full"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <Link href={`/product/${product._id}`} className="block h-full">
                <div className="relative aspect-[3/4] w-full overflow-hidden border">
                    <ProductCard.Image
                        src={getProductImage(product.imagenes?.[0])}
                        alt={product.nombre}
                        isVisible={!isHovering}
                        onError={() => setImageError(true)}
                        priority
                    />

                    {product.imagenes?.[1] && (
                        <ProductCard.Image
                            src={getProductImage(product.imagenes[1])}
                            alt={`${product.nombre} - vista alternativa`}
                            isVisible={isHovering}
                        />
                    )}

                    <ProductCard.Controls
                        product={product}
                        isAdminView={isAdminView}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                </div>

                <ProductCard.Info
                    product={product}
                    isAdminView={isAdminView}
                />
            </Link>

            {!isAdminView && (
                <ProductCard.QuickAdd isVisible={isHovering} />
            )}
        </div>
    );
});

// Subcomponentes
const ProductImage = memo(({
    src,
    alt,
    isVisible,
    onError,
    priority = false
}: {
    src: string;
    alt: string;
    isVisible: boolean;
    onError?: () => void;
    priority?: boolean;
}) => (
    <Image
        src={src}
        alt={alt}
        className={`
            object-cover transition-opacity duration-500 ease-in-out
            ${isVisible ? 'opacity-100' : 'opacity-0'}
        `}
        fill
        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
        onError={onError}
        priority={priority}
    />
));

const ProductControls = memo(({
    product,
    isAdminView,
    onEdit,
    onDelete
}: {
    product: Product;
    isAdminView: boolean;
    onEdit: (e: React.MouseEvent) => void;
    onDelete: (e: React.MouseEvent) => void;
}) => (
    <div className="absolute inset-0 p-4">
        {product.enOferta && (
            <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 text-xs font-medium">
                SALE
            </div>
        )}

        {isAdminView && (
            <div className="absolute top-2 left-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                <Button
                    size="icon"
                    variant="secondary"
                    onClick={onEdit}
                    className="hover:scale-105 transition-transform"
                >
                    <Edit className="h-4 w-4" />
                </Button>
                <Button
                    size="icon"
                    variant="destructive"
                    onClick={onDelete}
                    className="hover:scale-105 transition-transform"
                >
                    <Trash className="h-4 w-4" />
                </Button>
            </div>
        )}
    </div>
));
const ProductInfo = memo(({
    product,
    isAdminView
}: {
    product: Product;
    isAdminView: boolean;
}) => (
    <div className="p-4 space-y-2">
        <h3 className="text-sm font-medium tracking-tight line-clamp-1">
            {product.nombre}
        </h3>
        <p className="text-sm text-gray-500">{product.estilo}</p>
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
                <span className="text-sm font-medium">
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
));

const QuickAddButton = memo(({ isVisible }: { isVisible: boolean }) => (
    <div
        className={`
            absolute bottom-0 left-0 right-0 
            bg-black bg-opacity-5 backdrop-blur-sm
            transition-all duration-300 ease-in-out
            ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full'}
        `}
    >
        <button className="w-full py-3 px-4 text-sm font-medium text-black hover:bg-black hover:text-white transition-colors">
            Añadir al carrito
        </button>
    </div>
));
const ProductSkeleton = memo(() => (
    <div className="relative h-full animate-pulse bg-white rounded-lg overflow-hidden">
        {/* Imagen skeleton */}
        <div className="relative aspect-[3/4] w-full bg-gray-200">
            <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer"
                style={{
                    backgroundSize: '400% 100%',
                    animation: 'shimmer 1.5s infinite'
                }}
            />
        </div>

        {/* Contenido skeleton */}
        <div className="p-4 space-y-3">
            <div className="h-4 bg-gray-200 rounded-md w-3/4" />
            <div className="h-3 bg-gray-200 rounded-md w-1/2" />
            <div className="flex justify-between items-center">
                <div className="h-4 bg-gray-200 rounded-md w-20" />
                <div className="h-3 bg-gray-200 rounded-md w-16" />
            </div>
        </div>
    </div>
));

// Compound Component Export
export const ProductCard = Object.assign(ProductCardRoot, {
    Image: ProductImage,
    Controls: ProductControls,
    Info: ProductInfo,
    QuickAdd: QuickAddButton,
    Skeleton: ProductSkeleton
});

// Style para la animación shimmer
const shimmerStyles = `
@keyframes shimmer {
    0% { background-position: 100% 0; }
    100% { background-position: -100% 0; }
}

.animate-shimmer {
    animation: shimmer 1.5s infinite;
}
`;

// Agregar estilos al documento
if (typeof document !== 'undefined') {
    const style = document.createElement('style');
    style.textContent = shimmerStyles;
    document.head.appendChild(style);
}

// Display names
ProductCardRoot.displayName = 'ProductCard';
ProductImage.displayName = 'ProductCard.Image';
ProductControls.displayName = 'ProductCard.Controls';
ProductInfo.displayName = 'ProductCard.Info';
QuickAddButton.displayName = 'ProductCard.QuickAdd';
ProductSkeleton.displayName = 'ProductCard.Skeleton';

export default ProductCard;
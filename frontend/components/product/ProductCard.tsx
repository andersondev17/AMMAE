import { useCart } from '@/hooks/cart/useCart';
import { Product, ProductCardProps } from '@/types';
import { getImageUrl } from '@/utils/demoImages';
import { Edit, Trash } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { memo, useCallback, useMemo, useState } from 'react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';

// Subcomponente para mostrar el stock y las tallas
const StockInfo = memo(({ stock, tallas }: { stock: number; tallas: string[] }) => {
    const getStockStatus = useCallback((stock: number) => {
        if (stock === 0) return { label: 'Sin stock', color: 'bg-red-100 text-red-800' };
        if (stock <= 5) return { label: 'Stock bajo', color: 'bg-yellow-100 text-yellow-800' };
        return { label: 'En stock', color: 'bg-green-100 text-green-800' };
    }, []);

    const status = getStockStatus(stock);

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Disponibilidad:</span>
                <Badge variant="outline" className={`${status.color} border-0`}>
                    {status.label} ({stock})
                </Badge>
            </div>
            <div className="flex flex-wrap gap-1">
                {tallas.map((talla, index) => (
                    <Badge
                        key={`${talla}-${index}`}
                        variant="outline"
                        className="text-xs bg-gray-100 hover:bg-gray-200 transition-colors"
                    >
                        {talla}
                    </Badge>
                ))}
            </div>
        </div>
    );
});

// Subcomponente para manejar las imágenes del producto
const ProductImage = memo(({
    product,
    isHovering,
}: {
    product: Product;
    isHovering: boolean;
}) => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);

    const { primary, hover } = useMemo(() => {
        const images = product.imagenes?.map(img => getImageUrl(img)) || [];
        return {
            primary: images[0] || getImageUrl(`default/${product.categoria.toLowerCase()}.jpg`),
            hover: images[1] || images[0] || getImageUrl(`default/${product.categoria.toLowerCase()}.jpg`)
        };
    }, [product]);

    return (
        <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
            {/* Primary Image */}
            <Image
                src={primary}
                alt={product.nombre}
                className={`
                    absolute inset-0 w-full h-full object-cover
                    transition-all duration-300 ease-out
                    ${isHovering ? 'opacity-0' : 'opacity-100'}
                    ${isLoading ? 'scale-110 blur-sm' : 'scale-100 blur-0'}
                `}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority
                onLoad={() => setIsLoading(false)}
                onError={() => setError(true)}
            />

            {/* Hover Image */}
            {!error && hover && (
                <Image
                    src={hover}
                    alt={`${product.nombre} - alternativa`}
                    className={`
                        absolute inset-0 w-full h-full object-cover
                        transition-opacity duration-300 ease-out
                        ${isHovering ? 'opacity-100' : 'opacity-0'}
                    `}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    onError={() => setError(true)}
                />
            )}

            {/* Loading Indicator */}
            {isLoading && (
                <div className="absolute inset-0 bg-gray-100 animate-pulse" />
            )}
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
    const { addItem } = useCart();

    const handleAddToCart = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        addItem(product);
    }, [product, addItem]);

    const handleEdit = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onEdit?.(product);
    }, [onEdit, product]);

    const handleDelete = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        if (window.confirm('¿Estás seguro de que deseas eliminar este producto?')) {
            onDelete?.(product._id);
        }
    }, [onDelete, product._id]);

    return (
        <div
            className="group relative bg-white rounded-lg overflow-hidden "
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
        >
            <Link href={`/product/${product._id}`}>
                <div className="relative">
                    <ProductImage
                        product={product}
                        isHovering={isHovering}
                    />

                    {/* Badges y opciones */}
                    <div className="absolute inset-x-0 top-0 p-4">
                        <div className="flex justify-between items-start">
                            {/* Colores disponibles */}
                            <div className="flex -space-x-1">
                                {product.colores?.map((color, idx) => {
                                    const colorMap: { [key: string]: string } = {
                                        'Negro': '#000000',
                                        'Blanco': '#FFFFFF',
                                        'Azul': '#2563EB',
                                        'Rojo': '#DC2626',
                                        'Verde': '#059669',
                                        'Amarillo': '#CA8A04',
                                        'Morado': '#7C3AED',
                                        'Rosa': '#DB2777',
                                        'Gris': '#4B5563',
                                        'Beige': '#D4B89C'
                                    };

                                    const colorValue = colorMap[color] || color;
                                    const isLight = colorValue === '#FFFFFF' || colorValue === '#D4B89C';

                                    return (
                                        <div
                                            key={idx}
                                            className={`
                                                w-5 h-5 rounded-full 
                                                border-2 border-white 
                                                ring-1 ${isLight ? 'ring-gray-300' : 'ring-gray-200'}
                                                shadow-sm
                                            `}
                                            style={{ backgroundColor: colorValue }}
                                            title={color}
                                        />
                                    );
                                })}
                            </div>

                            {/* Badge de descuento */}
                            {product.enOferta && product.precioOferta && (
                                <Badge variant="destructive">
                                    -{Math.round(((product.precio - product.precioOferta) / product.precio) * 100)}%
                                </Badge>
                            )}
                        </div>
                    </div>


                    {/* Botones de administrador */}
                    {isAdminView && (
                        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                                size="icon"
                                variant="secondary"
                                onClick={handleEdit}
                                className="bg-white hover:bg-blue-50 text-blue-600 border border-blue-200 shadow-sm"
                                title="Editar producto"
                            >
                                <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                                size="icon"
                                variant="destructive"
                                onClick={handleDelete}
                                className="bg-white hover:bg-red-50 text-red-600 border border-red-200 shadow-sm hover:text-red-700"
                                title="Eliminar producto"
                            >
                                <Trash className="h-4 w-4" />
                            </Button>
                        </div>
                    )}

                    {/* Botón de agregar al carrito */}
                    {!isAdminView && product.stock > 0 && (
                        <div className={`
                            absolute bottom-16 inset-x-0
                            transition-all duration-300 ease-out
                            ${isHovering ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
                        `}>
                            <Button
                                onClick={handleAddToCart}
                                className="w-[calc(100%-2rem)] mx-4 bg-white hover:bg-black text-black hover:text-white transition-colors"
                            >
                                SELECCIONAR OPCIONES
                            </Button>
                        </div>
                    )}
                </div>



                {/* Información del producto */}
                <div className="p-4 md:p-6 text-center">
                    {/* Nombre y categoría */}
                    <div className="space-y-2">
                        <h3 className="text-base md:text-sm font-medium text-gray-900 tracking-tight">
                            {product.nombre}
                        </h3>

                    </div>

                    {/* Precios */}
                    <div className="mt-3 flex items-center justify-center gap-3">
                        {product.enOferta && product.precioOferta ? (
                            <>
                                <span className="text-base md:text-sm font-medium text-red-600">
                                    ${product.precioOferta}
                                </span>
                                <span className="text-sm text-gray-600 line-through">
                                    ${product.precio}
                                </span>
                                <span className="px-2 py-0.5 text-xs font-medium text-red-600 border border-red-200 rounded">
                                    SALE
                                </span>
                            </>
                        ) : (
                            <span className="text-base md:text-sm font-medium text-gray-600">
                                ${product.precio}
                            </span>
                        )}
                    </div>

                    {/* Información adicional para vista de administrador */}
                    {isAdminView && (
                        <div className="mt-4 pt-3 border-t border-gray-100">
                            <StockInfo stock={product.stock} tallas={product.tallas} />
                        </div>
                    )}
                </div>
            </Link>
        </div>
    );
});

// Display names
ProductCard.displayName = 'ProductCard';
ProductImage.displayName = 'ProductImage';
StockInfo.displayName = 'StockInfo';

export default ProductCard;
import { useCart } from '@/hooks/cart/useCart';
import { cn } from '@/lib/utils';
import { ProductCardProps } from '@/types';
import { getImageUrl } from '@/utils/demoImages';
import { Edit, Trash } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { memo, useMemo, useState } from 'react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';

const COLOR_MAP = {
    Negro: '#000',
    Blanco: '#fff',
    Azul: '#2563EB',
    Rojo: '#DC2626',
    Verde: '#059669',
    Amarillo: '#CA8A04',
    Morado: '#7C3AED',
    Rosa: '#DB2777',
    Gris: '#4B5563',
    Beige: '#D4B89C'
};

const StockStatus = memo(({ stock }: { stock: number }) => {
    const status = useMemo(() => {
        if (stock === 0) return { label: 'Sin stock', color: 'bg-red-100 text-red-800' };
        return stock <= 5
            ? { label: 'Stock bajo', color: 'bg-yellow-100 text-yellow-800' }
            : { label: 'En stock', color: 'bg-green-100 text-green-800' };
    }, [stock]);

    return (
        <Badge variant="outline" className={`${status.color} border-0`}>
            {status.label} ({stock})
        </Badge>
    );
});

export const ProductCard = memo(({ product, onEdit, onDelete, isAdminView = false }: ProductCardProps) => {
    const { addItem } = useCart();
    const [isHovering, setIsHovering] = useState(false);
    const [imageState, setImageState] = useState({ isLoading: true, error: false });

    const { primaryImage, hoverImage } = useMemo(() => ({
        primaryImage: product.imagenes?.[0] ? getImageUrl(product.imagenes[0]) : getImageUrl(`default/${product.categoria.toLowerCase()}.jpg`),
        hoverImage: product.imagenes?.[1] ? getImageUrl(product.imagenes[1]) : undefined
    }), [product.imagenes, product.categoria]);

    const discount = useMemo(() =>
        product.enOferta && product.precioOferta
            ? Math.round(((product.precio - product.precioOferta) / product.precio) * 100)
            : 0
        , [product]);

    const handleImageEvent = (type: 'load' | 'error') => {
        setImageState(prev => ({ ...prev, [type === 'load' ? 'isLoading' : 'error']: true }));
    };

    return (
        <article
            className="group relative bg-white rounded-xl overflow-hidden transition-shadow"
        >
            <Link href={`/product/${product._id}`} className="block h-full">
                <div className="relative aspect-[3/4] bg-gray-50 overflow-hidden"
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                >
                    {/* Image Container */}
                    <div className="relative h-full w-full">
                        {imageState.isLoading && (
                            <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse" />
                        )}

                        {!imageState.error && (
                            <>
                                <Image
                                    src={primaryImage}
                                    alt={product.nombre}
                                    className={cn(
                                        "object-cover transition-opacity duration-500",
                                        isHovering && hoverImage ? "opacity-0" : "opacity-100"
                                    )}
                                    fill
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    priority
                                    onLoad={() => handleImageEvent('load')}
                                    onError={() => handleImageEvent('error')}
                                />

                                {hoverImage && (
                                    <Image
                                        src={hoverImage}
                                        alt={`${product.nombre} - Vista alternativa`}
                                        className={cn(
                                            "object-cover transition-opacity duration-500",
                                            isHovering ? "opacity-100" : "opacity-0"
                                        )}
                                        fill
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                    />
                                )}
                            </>
                        )}
                    </div>



                    {/* Admin Controls */}
                    {isAdminView && (
                        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => { e.preventDefault(); onEdit?.(product); }}
                                className="bg-white/90 backdrop-blur-sm hover:bg-white"
                            >
                                <Edit className="h-4 w-4 text-blue-600" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                    e.preventDefault();
                                    confirm('¿Eliminar producto?') && onDelete?.(product._id);
                                }}
                                className="bg-white/90 backdrop-blur-sm hover:bg-white"
                            >
                                <Trash className="h-4 w-4 text-red-600" />
                            </Button>
                        </div>
                    )}

                    {/* Add to Cart */}
                    {!isAdminView && product.stock > 0 && (
                        <div className={cn(
                            "absolute bottom-4 inset-x-4 transition-transform duration-300",
                            isHovering ? "translate-y-0" : "translate-y-20"
                        )}>
                            <Link rel="stylesheet" href={`/product/${product._id}`} >
                                <Button
                                    onClick={(e) => { e.preventDefault(); }}
                                    className="w-full bg-white/90 text-gray-500 backdrop-blur-sm hover:bg-black hover:text-white font-zentry"
                                >
                                    Seleccionar opciones
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>


                {/* Product Badges */}
                <div className="relative top-4 left-1 flex gap-2">
                    <div className="flex -space-x-1">
                        {product.colores?.map((color, i) => (
                            <div
                                key={i}
                                className={cn(
                                    "w-5 h-5 rounded-full border-2 border-white shadow-sm",
                                    COLOR_MAP[color as keyof typeof COLOR_MAP] === '#fff' && "ring-1 ring-gray-200"
                                )}
                                style={{ backgroundColor: COLOR_MAP[color as keyof typeof COLOR_MAP] || color }}
                            />
                        ))}
                    </div>

                </div>
                <div className="absolute top-4 right-4 flex gap-2">
                    {discount > 0 && (
                        <Badge variant="destructive" className="animate-fade-in">
                            -{discount}%
                        </Badge>
                    )}
                </div>


                {/* Product Info */}
                <div className="pb-4 md:py-6 text-start">
                    {/* Nombre */}
                    <h3 className="px-1 font-zentry text-base  text-gray-900 line-clamp-1 transition-colors hover:text-gray-500">
                        {product.nombre}
                    </h3>

                    {/* Precios */}
                    <div className="px-1 py-1 flex gap-3">
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

                    {isAdminView && (
                        <div className="p-3 border-t border-gray-100">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-500">Disponibilidad:</span>
                                <StockStatus stock={product.stock} />
                            </div>
                            <div className="flex flex-wrap gap-1 mt-2">
                                {product.tallas?.map(talla => (
                                    <Badge key={talla} variant="outline" className="text-xs bg-gray-100">
                                        {talla}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </Link>
        </article>
    );
});

ProductCard.displayName = 'ProductCard';
StockStatus.displayName = 'StockStatus';
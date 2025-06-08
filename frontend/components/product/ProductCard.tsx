import { useCart } from '@/hooks/cart/useCart';
import { Product } from '@/types';
import { getProductImages } from '@/utils/imageUtils';
import { Edit, ShoppingBag, Trash } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';

interface ProductCardProps {
    readonly product: Product;
    readonly onEdit?: (product: Product) => void;
    readonly onDelete?: (id: string) => Promise<void>;
    readonly isAdminView?: boolean;
    readonly variant?: 'grid' | 'list';
}

const formatPrice = (price: number) => `${price.toLocaleString()} COP`;

const COLOR_MAP: Record<string, string> = {
    Negro: '#000', Blanco: '#fff', Azul: '#2563EB', Rojo: '#DC2626',
    Verde: '#059669', Amarillo: '#CA8A04', Morado: '#7C3AED', Rosa: '#DB2777',
    Gris: '#4B5563', Beige: '#D4B89C'
};

export const ProductCard = ({ product, onEdit, onDelete, isAdminView = false, variant = 'grid' }: ProductCardProps) => {
    const [imageError, setImageError] = useState(false);
    const { addItem } = useCart();
    const { primary, hover } = getProductImages(product);

    const discount = product.enOferta && product.precioOferta
        ? Math.round(((product.precio - product.precioOferta) / product.precio) * 100)
        : 0;

    // QUICK ADD simplificado
    const handleQuickAdd = (size?: string) => {
        if (product.stock <= 0) {
            toast.error('Producto agotado');
            return;
        }
        addItem(product, { size, quantity: 1 });
    };

    // ADMIN ACTIONS simplificadas
    const handleEdit = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onEdit?.(product);
    };

    const handleDelete = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (confirm('¿Eliminar este producto?')) {
            await onDelete?.(product._id);
        }
    };

    if (variant === 'list') {
        return (
            <div className="flex items-center p-4 hover:bg-gray-50 transition-colors border-b">
                <div className="w-16 h-16 relative bg-gray-100 mr-4">
                    <Image
                        src={imageError ? '/assets/images/demo/default-product.jpg' : primary}
                        alt={product.nombre}
                        fill
                        className="object-cover"
                        onError={() => setImageError(true)}
                    />
                </div>

                <div className="flex-1 min-w-0">
                    <h4 className="font-medium truncate">{product.nombre}</h4>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                        <span>{formatPrice(product.precio)}</span>
                        <span className="mx-2">•</span>
                        <span>{product.categoria}</span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <span className={`text-sm px-2 py-1 rounded ${product.stock <= 0 ? 'text-red-700 bg-red-50' :
                            product.stock <= 5 ? 'text-amber-700 bg-amber-50' :
                                'text-green-700 bg-green-50'
                        }`}>
                        {product.stock <= 0 ? 'Sin stock' :
                            product.stock <= 5 ? 'Bajo stock' : 'En stock'}
                    </span>

                    {isAdminView && (
                        <div className="flex gap-1">
                            <button
                                onClick={handleEdit}
                                className="p-2 hover:bg-gray-100 rounded"
                                aria-label="Editar producto"
                            >
                                <Edit className="h-4 w-4" />
                            </button>
                            <button
                                onClick={handleDelete}
                                className="p-2 hover:bg-red-50 hover:text-red-600 rounded"
                                aria-label="Eliminar producto"
                            >
                                <Trash className="h-4 w-4" />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // GRID LAYOUT (default)
    return (
        <article className="group relative bg-white">
            <Link
                href={`/product/${product._id}`}
                className="block"
                aria-label={`Ver ${product.nombre}`}
            >
                <div className="aspect-[3/4] relative overflow-hidden bg-gray-50">
                    <Image
                        src={imageError ? '/assets/images/demo/default-product.jpg' : primary}
                        alt={product.nombre}
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        fill
                        sizes="(max-width: 768px) 50vw, 33vw"
                        onError={() => setImageError(true)}
                    />

                    {/* HOVER IMAGE - Solo desktop */}
                    {hover !== primary && (
                        <Image
                            src={hover}
                            alt={`${product.nombre} alternativa`}
                            className="object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:block"
                            fill
                            sizes="33vw"
                        />
                    )}

                    {/* BADGES */}
                    {discount > 0 && (
                        <div className="absolute top-2 left-2 bg-black text-white px-2 py-1 text-xs font-bold">
                            -{discount}%
                        </div>
                    )}

                    {/* Admin Controls */}
                    {isAdminView && (
                        <div className="absolute top-2 right-2 flex gap-1 bg-white/90 rounded p-1">
                            <button
                                onClick={handleEdit}
                                className="p-1 hover:bg-gray-100 rounded"
                                aria-label="Editar"
                            >
                                <Edit className="h-4 w-4" />
                            </button>
                            <button
                                onClick={handleDelete}
                                className="p-1 hover:bg-red-50 hover:text-red-600 rounded"
                                aria-label="Eliminar"
                            >
                                <Trash className="h-4 w-4" />
                            </button>
                        </div>
                    )}

                    {/* QUICK ADD - Solo clientes */}
                    {!isAdminView && product.stock > 0 && (
                        <>
                            {/* Mobile: Botón fijo */}
                            <button
                                className="md:hidden absolute bottom-2 right-2 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleQuickAdd();
                                }}
                            >
                                <ShoppingBag className="w-4 h-4" />
                            </button>

                            {/* Desktop: Panel de tallas en hover */}
                            <div className="hidden md:block absolute inset-x-2 bottom-2 bg-white/95 backdrop-blur-sm rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="p-3">
                                    {product.tallas?.length ? (
                                        <div className="space-y-2">
                                            <p className="text-xs font-medium text-center">Talla rápida</p>
                                            <div className="flex gap-1 justify-center">
                                                {product.tallas.slice(0, 4).map((talla) => (
                                                    <button
                                                        key={talla}
                                                        className="px-2 py-1 text-xs border hover:bg-black hover:text-white transition-colors"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            e.stopPropagation();
                                                            handleQuickAdd(talla);
                                                        }}
                                                    >
                                                        {talla}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        <button
                                            className="w-full bg-black text-white text-xs py-2 hover:bg-gray-800 transition-colors"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                handleQuickAdd();
                                            }}
                                        >
                                            Añadir al carrito
                                        </button>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Product Info */}
                <div className="p-3">
                    <h3 className="text-xs font-robert-regular text-gray-700 line-clamp-2 mb-1">
                        {product.nombre}
                    </h3>

                    <div className="flex items-center justify-between">
                        <div>
                            {discount > 0 ? (
                                <div className="space-y-1">
                                    <span className="text-xs font-robert-medium text-red-700 font-medium">
                                        {formatPrice(product.precioOferta!)}
                                    </span>
                                    <span className="text-xs font-robert-medium text-gray-500 line-through block">
                                        {formatPrice(product.precio)}
                                    </span>
                                </div>
                            ) : (
                                <span className="text-xs font-robert-medium">
                                    {formatPrice(product.precio)}
                                </span>
                            )}
                        </div>

                        {product.colores?.length && (
                            <div className="flex items-center gap-1">
                                {/*  Contador de colores */}
                                <div className="group-hover:hidden flex items-center">
                                    <span className="text-xs text-gray-500">
                                        + {product.colores.length} colores
                                    </span>
                                </div>

                                {/* Con hover: Paleta de colores */}
                                <div className="hidden group-hover:flex gap-1">
                                    {product.colores.slice(0, 4).map((color) => (
                                        <div
                                            key={color}
                                            className="w-3 h-3 rounded-full border border-gray-300"
                                            style={{ backgroundColor: COLOR_MAP[color] || '#CCCCCC' }}
                                            title={color}
                                        />
                                    ))}
                                    {product.colores.length > 4 && (
                                        <span className="text-xs text-gray-500">
                                            +{product.colores.length - 4}
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {isAdminView && (
                        <div className="text-xs text-gray-500 mt-1">
                            Stock: {product.stock}
                        </div>
                    )}
                </div>
            </Link>
        </article>
    );
};
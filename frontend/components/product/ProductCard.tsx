// components/product/ProductCard.tsx
import { cn } from '@/lib/utils';
import { ProductCardProps } from '@/types';
import { getImageUrl } from '@/utils/demoImages';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

const COLOR_MAP: Record<string, string> = {
    Negro: '#000', Blanco: '#fff', Azul: '#2563EB', Rojo: '#DC2626',
    Verde: '#059669', Amarillo: '#CA8A04', Morado: '#7C3AED', Rosa: '#DB2777',
    Gris: '#4B5563', Beige: '#D4B89C'
};

export const ProductCard = ({ product, onEdit, onDelete, isAdminView = false }: ProductCardProps) => {
    const [isHovering, setIsHovering] = useState(false);

    // Datos calculados inline
    const img1 = getImageUrl(product.imagenes?.[0] || `default/${product.categoria.toLowerCase()}.jpg`);
    const img2 = product.imagenes?.[1] ? getImageUrl(product.imagenes[1]) : img1;
    const discount = product.enOferta && product.precioOferta
        ? Math.round(((product.precio - product.precioOferta) / product.precio) * 100)
        : 0;

    const handleEdit = (e: React.MouseEvent) => {
        e.preventDefault();
        onEdit?.(product);
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.preventDefault();
        if (confirm('¿Eliminar producto?')) onDelete?.(product._id);
    };

    return (
        <article className="group relative bg-white border-b hover:border-black transition-colors">
            <Link href={`/product/${product._id}`}>
                <div
                    className="relative aspect-[3/4] overflow-hidden"
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                >
                    <Image
                        src={img1}
                        alt={product.nombre}
                        fill
                        sizes="(max-width: 768px) 50vw, 25vw"
                        className={cn(
                            "object-cover transition-opacity duration-500",
                            isHovering && product.imagenes?.length > 1 && "opacity-0"
                        )}
                    />

                    {product.imagenes?.length > 1 && (
                        <Image
                            src={img2}
                            alt={`${product.nombre} - alt`}
                            fill
                            sizes="(max-width: 768px) 50vw, 25vw"
                            className={cn(
                                "object-cover transition-opacity duration-500",
                                isHovering ? "opacity-100" : "opacity-0"
                            )}
                            loading="lazy"
                        />
                    )}

                    {/* Discount Badge */}
                    {discount > 0 && (
                        <div className="absolute top-2 right-2 z-10">
                            <span className="bg-black font-general text-white text-xs px-2 py-1">-{discount}%</span>
                        </div>
                    )}

                    {/* Admin Controls */}
                    {isAdminView && (
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/5 z-10">
                            <div className="flex gap-2">
                                <button onClick={handleEdit} className="p-2 bg-white rounded-full hover:bg-blue-50">
                                    ✏️
                                </button>
                                <button onClick={handleDelete} className="p-2 bg-white rounded-full hover:bg-red-50">
                                    🗑️
                                </button>
                            </div>
                        </div>
                    )}

                    {/* CTA Button */}
                    {!isAdminView && product.stock > 0 && (
                        <div className={cn(
                            "absolute inset-x-0 bottom-0 z-10 p-4 transition-transform duration-300",
                            isHovering ? "translate-y-0" : "translate-y-full"
                        )}>
                            <button
                                onClick={(e) => e.preventDefault()}
                                className="w-full py-2 border font-general border-black bg-white hover:bg-black hover:text-white transition-colors"
                            >
                                Ver detalles
                            </button>
                        </div>
                    )}
                </div>

                {/* Product Info */}
                <div className="p-4">
                    <div className="flex -space-x-1 mb-2 font-general">
                        {product.colores?.slice(0, 3).map((color, i) => (
                            <div
                                key={i}
                                className={cn(
                                    "w-4 h-4 rounded-full border border-gray-500",
                                    color === 'Blanco' && "ring-1 ring-gray-200"
                                )}
                                style={{ backgroundColor: COLOR_MAP[color] || color }}
                                title={color}
                            />
                        ))}
                        {(product.colores?.length || 0) > 3 && (
                            <div className="w-4 h-4 flex items-center justify-center text-xs bg-gray-100 rounded-full border border-white">
                                +{product.colores!.length - 3}
                            </div>
                        )}
                    </div>

                    <h3 className="font-medium font-robert-regulartext-sm text-gray-900 truncate">{product.nombre}</h3>

                    <div className="mt-1 flex items-center gap-2 font-general">
                        {product.enOferta && product.precioOferta ? (
                            <>
                                <span className="font-medium text-black">${product.precioOferta}</span>
                                <span className="text-xs text-gray-500 line-through">${product.precio}</span>
                            </>
                        ) : (
                            <span className="font-medium">${product.precio}</span>
                        )}
                    </div>

                    {/* Admin Stock Info */}
                    {isAdminView && (
                        <div className="mt-2 font-robert-regular">
                            <span className={cn(
                                "text-xs px-1.5 py-0.5 rounded-sm",
                                product.stock === 0 ? "bg-red-100 text-red-800" :
                                    product.stock <= 5 ? "bg-yellow-100 text-yellow-800" :
                                        "bg-green-100 text-green-800"
                            )}>
                                {product.stock === 0 ? 'Sin stock' :
                                    product.stock <= 5 ? `Stock bajo (${product.stock})` :
                                        'En stock'}
                            </span>
                        </div>
                    )}
                </div>
            </Link>
        </article>
    );
};
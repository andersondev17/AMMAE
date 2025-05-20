import { cn } from '@/lib/utils';
import { ProductCardProps } from '@/types';
import { getImageUrl } from '@/utils/demoImages';
import Image from 'next/image';
import Link from 'next/link';
import { memo, useMemo, useState } from 'react';

// Mapa de colores como constante fuera del componente para mejor rendimiento
const COLOR_MAP = {
    Negro: '#000', Blanco: '#fff', Azul: '#2563EB',
    Rojo: '#DC2626', Verde: '#059669', Amarillo: '#CA8A04',
    Morado: '#7C3AED', Rosa: '#DB2777', Gris: '#4B5563',
    Beige: '#D4B89C'
};

export const ProductCard = memo(({ product, onEdit, onDelete, isAdminView = false }: ProductCardProps) => {
    const [isHovering, setIsHovering] = useState(false);

    // Procesamiento de datos optimizado con useMemo
    const { primaryImage, secondaryImage, discount, price } = useMemo(() => {
        // Gestión principal y secundaria de imágenes
        const imgPath = product.imagenes?.length > 0
            ? getImageUrl(product.imagenes[0])
            : getImageUrl(`default/${product.categoria.toLowerCase()}.jpg`);

        const secondImg = product.imagenes?.length > 1
            ? getImageUrl(product.imagenes[1])
            : imgPath;

        // Cálculo de descuento
        const disc = product.enOferta && product.precioOferta
            ? Math.round(((product.precio - product.precioOferta) / product.precio) * 100)
            : 0;

        // Formateo de precios
        const priceData = product.enOferta && product.precioOferta
            ? { sale: product.precioOferta.toFixed(2), regular: product.precio.toFixed(2) }
            : { regular: product.precio.toFixed(2) };

        return { 
            primaryImage: imgPath, 
            secondaryImage: secondImg,
            discount: disc, 
            price: priceData 
        };
    }, [product]);

    // Handlers para acciones administrativas
    const handleEdit = (e: React.MouseEvent) => {
        e.preventDefault();
        onEdit?.(product);
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.preventDefault();
        if (confirm('¿Estás seguro de eliminar este producto?')) {
            onDelete?.(product._id);
        }
    };

    return (
        <article className="group relative bg-white border-b hover:border-black transition-colors duration-300">
            <Link href={`/product/${product._id}`} className="block">
                {/* Contenedor de imagen con efecto de hover */}
                <div
                    className="relative aspect-[3/4] overflow-hidden"
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                >
                    {/* Imagen principal */}
                    <Image
                        src={primaryImage}
                        alt={product.nombre}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                        className={cn(
                            "object-cover transition-opacity duration-500",
                            isHovering && product.imagenes?.length > 1 ? "opacity-0" : "opacity-100"
                        )}
                        loading="lazy"
                    />

                    {/* Imagen secundaria (visible en hover) */}
                    {product.imagenes?.length > 1 && (
                        <Image
                            src={secondaryImage}
                            alt={`${product.nombre} - vista alternativa`}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                            className={cn(
                                "object-cover transition-opacity duration-500",
                                isHovering ? "opacity-100" : "opacity-0"
                            )}
                            loading="lazy"
                        />
                    )}

                    {/* Etiqueta de descuento */}
                    {discount > 0 && (
                        <div className="absolute top-0 right-0 z-10 m-2">
                            <span className="inline-block bg-black text-white text-xs font-medium px-2 py-1">
                                -{discount}%
                            </span>
                        </div>
                    )}

                    {/* Controles admin */}
                    {isAdminView && (
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/5 z-10">
                            <div className="flex gap-2">
                                <button
                                    onClick={handleEdit}
                                    className="p-2 bg-white rounded-full shadow-sm hover:bg-blue-50 transition-colors"
                                    aria-label="Editar"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /></svg>
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="p-2 bg-white rounded-full shadow-sm hover:bg-red-50 transition-colors"
                                    aria-label="Eliminar"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
                                </button>
                            </div>
                        </div>
                    )}

                    {/* CTA para usuario */}
                    {!isAdminView && product.stock > 0 && (
                        <div className={cn(
                            "absolute inset-x-0 bottom-0 z-10 p-4 transition-transform duration-300",
                            isHovering ? "translate-y-0" : "translate-y-full"
                        )}>
                            <button
                                onClick={(e) => e.preventDefault()}
                                className="w-full py-2 border border-black bg-white hover:bg-black hover:text-white transition-colors duration-300"
                                aria-label="Ver detalles"
                            >
                                Ver detalles
                            </button>
                        </div>
                    )}
                </div>

                {/* Información del producto */}
                <div className="p-4">
                    <div className="flex -space-x-1 mb-2">
                        {product.colores?.slice(0, 3).map((color, i) => (
                            <div
                                key={i}
                                className={cn(
                                    "w-4 h-4 rounded-full border border-white",
                                    color === 'Blanco' && "ring-1 ring-gray-200"
                                )}
                                style={{ backgroundColor: COLOR_MAP[color as keyof typeof COLOR_MAP] || color }}
                                title={color}
                            />
                        ))}
                        {(product.colores?.length || 0) > 3 && (
                            <div className="w-4 h-4 flex items-center justify-center text-xs bg-gray-100 rounded-full border border-white">
                                +{product.colores!.length - 3}
                            </div>
                        )}
                    </div>

                   <h3 className="font-normal text-sm text-gray-900 truncate">
                        {product.nombre}
                    </h3>

                    <div className="mt-1 flex items-center gap-2">
                        {price.sale ? (
                            <>
                                <span className="font-medium text-black">${price.sale}</span>
                                <span className="text-xs text-gray-500 line-through">${price.regular}</span>
                            </>
                        ) : (
                            <span className="font-medium">${price.regular}</span>
                        )}
                    </div>

                    {isAdminView && (
                        <div className="mt-2 flex items-center gap-2 text-xs">
                            <span className={cn(
                                "px-1.5 py-0.5 rounded-sm",
                                product.stock === 0 ? "bg-red-100 text-red-800" :
                                    product.stock <= 5 ? "bg-yellow-100 text-yellow-800" :
                                        "bg-green-100 text-green-800"
                            )}>
                                {product.stock === 0 ? 'Sin stock' :
                                    product.stock <= 5 ? `Stock bajo (${product.stock})` :
                                        `En stock`}
                            </span>
                        </div>
                    )}
                </div>
            </Link>
        </article>
    );
});

ProductCard.displayName = 'ProductCard';
import { cn } from '@/lib/utils';
import { ProductCardProps } from '@/types';
import { getImageUrl } from '@/utils/demoImages';
import Image from 'next/image';
import Link from 'next/link';
import { memo, useMemo, useState } from 'react';

// Mapa de colores como constante fuera del componente
const COLOR_MAP = {
    Negro: '#000', Blanco: '#fff', Azul: '#2563EB',
    Rojo: '#DC2626', Verde: '#059669', Amarillo: '#CA8A04',
    Morado: '#7C3AED', Rosa: '#DB2777', Gris: '#4B5563',
    Beige: '#D4B89C'
};

export const ProductCard = memo(({
    product,
    onEdit,
    onDelete,
    isAdminView = false
}: ProductCardProps) => {
    // Solo mantenemos un estado para controlar el hover
    const [isHovering, setIsHovering] = useState(false);

    // Cálculos memoizados para evitar recálculos innecesarios
    const { primaryImage, discount, price } = useMemo(() => {
        // Imagen principal usando getImageUrl para mantener consistencia
        const imgPath = product.imagenes?.length
            ? getImageUrl(product.imagenes[0])
            : getImageUrl(`default/${product.categoria.toLowerCase()}.jpg`);

        // Cálculo de descuento optimizado
        const disc = product.enOferta && product.precioOferta
            ? Math.round(((product.precio - product.precioOferta) / product.precio) * 100)
            : 0;

        // Formato de precio
        const priceData = product.enOferta && product.precioOferta
            ? { sale: product.precioOferta.toFixed(2), regular: product.precio.toFixed(2) }
            : { regular: product.precio.toFixed(2) };

        return { primaryImage: imgPath, discount: disc, price: priceData };
    }, [product]);

    // Handlers simplificados
    const handleEdit = (e: React.MouseEvent) => {
        e.preventDefault();
        onEdit?.(product);
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.preventDefault();
        if (confirm('¿Eliminar este producto?')) {
            onDelete?.(product._id);
        }
    };

    return (
        <article className="group relative bg-white border-b hover:shadow-sm transition-shadow">
            <Link href={`/product/${product._id}`} className="block">
                {/* Contenedor de imagen con hover state */}
                <div
                    className="relative aspect-[3/4] bg-gray-50 overflow-hidden"
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                >
                    <Image
                        src={primaryImage}
                        alt={product.nombre}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                        className="object-cover"
                        loading="lazy"
                    />

                    {/* Insignia de descuento */}
                    {discount > 0 && (
                        <div className="absolute top-2 right-2 z-10">
                            <span className="inline-block bg-red-600 text-white text-xs font-medium px-2 py-1 rounded">
                                -{discount}%
                            </span>
                        </div>
                    )}

                    {/* Admin controls - simplificados */}
                    {isAdminView && (
                        <div className="absolute top-2 left-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                            <button
                                onClick={handleEdit}
                                className="p-1.5 bg-white rounded-full shadow-sm hover:bg-blue-50"
                                aria-label="Editar"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /></svg>
                            </button>
                            <button
                                onClick={handleDelete}
                                className="p-1.5 bg-white rounded-full shadow-sm hover:bg-red-50"
                                aria-label="Eliminar"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
                            </button>
                        </div>
                    )}

                    {/* Botón de acción en hover - solo para vista de usuario y productos en stock */}
                    {!isAdminView && product.stock > 0 && (
                        <div className={cn(
                            "absolute inset-x-4 bottom-4 z-10 transition-transform duration-200",
                            isHovering ? "translate-y-0" : "translate-y-16"
                        )}>
                            <button
                                onClick={(e) => e.preventDefault()}
                                className="w-full py-2 bg-white/90 text-gray-700 text-sm font-medium rounded shadow-sm
                          backdrop-blur-sm hover:bg-black hover:text-white transition-colors"
                            >
                                Seleccionar opciones
                            </button>
                        </div>
                    )}
                </div>

                {/* Colores del producto - simplificados */}
                <div className="flex -space-x-1 mt-3 ml-3">
                    {product.colores?.slice(0, 4).map((color, i) => (
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
                    {(product.colores?.length || 0) > 4 && (
                        <div className="w-4 h-4 flex items-center justify-center text-xs bg-gray-100 rounded-full border border-white">
                            +{product.colores!.length - 4}
                        </div>
                    )}
                </div>

                {/* Información del producto */}
                <div className="px-3 pb-3">
                    {/* Nombre */}
                    <h3 className="font-medium text-gray-900 mt-2 line-clamp-1">
                        {product.nombre}
                    </h3>

                    {/* Precio */}
                    <div className="mt-1 flex items-center gap-2">
                        {price.sale ? (
                            <>
                                <span className="font-medium text-red-600">${price.sale}</span>
                                <span className="text-xs text-gray-500 line-through">${price.regular}</span>
                                {product.enOferta && (
                                    <span className="text-xs px-1.5 py-0.5 text-red-600 border border-red-200 rounded">
                                        SALE
                                    </span>
                                )}
                            </>
                        ) : (
                            <span className="font-medium">${price.regular}</span>
                        )}
                    </div>

                    {/* Stock info - solo para admin */}
                    {isAdminView && (
                        <div className="mt-2 flex flex-wrap gap-2 text-xs">
                            <span className={cn(
                                "px-1.5 py-0.5 rounded",
                                product.stock === 0 ? "bg-red-100 text-red-800" :
                                    product.stock <= 5 ? "bg-yellow-100 text-yellow-800" :
                                        "bg-green-100 text-green-800"
                            )}>
                                {product.stock === 0 ? 'Sin stock' :
                                    product.stock <= 5 ? `Stock bajo (${product.stock})` :
                                        `En stock (${product.stock})`}
                            </span>

                            {/* Tallas disponibles */}
                            {product.tallas?.length > 0 && (
                                <div className="flex flex-wrap gap-1">
                                    {product.tallas.map(talla => (
                                        <span key={talla} className="bg-gray-100 px-1 rounded">
                                            {talla}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </Link>
        </article>
    );
});

ProductCard.displayName = 'ProductCard';
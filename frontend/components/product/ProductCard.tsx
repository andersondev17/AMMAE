import { ProductCardProps } from '@/types';
import { Edit, Trash } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Button } from '../ui/button';

const IMAGE_DOMAIN = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

export const ProductCard: React.FC<ProductCardProps> = ({
    product,
    onEdit,
    onDelete,
    isAdminView = false
}) => {
    const [isHovering, setIsHovering] = useState(false);

    const getImageUrl = (imageUrl: string) => {
        if (imageUrl.startsWith('http')) return imageUrl;
        if (imageUrl.startsWith('/')) return imageUrl;
        // Si es una ruta relativa, construimos la URL completa
        return `${IMAGE_DOMAIN}/images/${imageUrl}`;
    };

    // Imagen de respaldo por si no hay imágenes disponibles
    const fallbackImage = '/placeholder.jpg';

    const handleDelete = (e: React.MouseEvent) => {
        e.preventDefault();
        if (onDelete && window.confirm('¿Estás seguro de que deseas eliminar este producto?')) {
            onDelete(product._id);
        }
    };

    const handleEdit = (e: React.MouseEvent) => {
        e.preventDefault();
        if (onEdit) onEdit(product);
    };

    return (
        <div
            className="border-b border-r border-gray-200 relative group"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
        >
            <Link href={`/product/${product._id}`} className="block p-4">
                <div className="aspect-square relative overflow-hidden mb-2">
                    <div className="relative w-full h-full">
                        <Image
                            src={getImageUrl(product.imagenes[0] || fallbackImage)}
                            alt={product.nombre}
                            className={`object-cover transition-opacity duration-300 ${
                                isHovering ? 'opacity-0' : 'opacity-100'
                            }`}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            priority={true}
                        />
                        {product.imagenes[1] && (
                            <Image
                                src={getImageUrl(product.imagenes[1])}
                                alt={`${product.nombre} - vista alternativa`}
                                className={`object-cover transition-opacity duration-300 ${
                                    isHovering ? 'opacity-100' : 'opacity-0'
                                }`}
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                        )}
                        {product.enOferta && (
                            <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 text-xs font-semibold">
                                SALE
                            </div>
                        )}
                        {isAdminView && (
                            <div className="absolute top-2 left-2 flex gap-2">
                                <Button
                                    size="icon"
                                    variant="secondary"
                                    onClick={handleEdit}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                    size="icon"
                                    variant="destructive"
                                    onClick={handleDelete}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <Trash className="h-4 w-4" />
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
                <div className="min-h-[4rem]">
                    <h3 className="text-sm font-medium text-gray-900">{product.nombre}</h3>
                    <p className="text-sm text-gray-500 mt-1">{product.estilo}</p>
                    <p className="text-sm font-medium text-gray-900 mt-1">
                        ${product.precio.toFixed(2)}
                        {product.enOferta && product.precioOferta && (
                            <span className="ml-2 text-red-500 line-through">
                                ${product.precioOferta.toFixed(2)}
                            </span>
                        )}
                    </p>
                    {isAdminView && (
                        <p className="text-sm text-gray-500 mt-1">
                            Stock: {product.stock} unidades
                        </p>
                    )}
                </div>
            </Link>
            {!isAdminView && (
                <div
                    className={`absolute bottom-4 left-4 right-4 flex items-center transition-opacity duration-300 bg-white bg-opacity-90 p-4 ${
                        isHovering ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                    }`}
                >
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></span>
                    <button className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-300">
                        Quick add
                    </button>
                </div>
            )}
        </div>
    );
};
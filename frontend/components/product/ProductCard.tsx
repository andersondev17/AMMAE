import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Product } from '../../types';

interface ProductCardProps {
    product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const [isHovering, setIsHovering] = useState(false);

    return (
        <div 
            className="border-b border-r border-gray-200 relative group"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
        >
            <Link href={`/product/${product._id}`} className="block p-4">
                <div className="aspect-square relative overflow-hidden mb-2">
                    <Image
                        src={product.imagenes[0].startsWith('http') ? product.imagenes[0] : `/${product.imagenes[0]}`}
                        alt={product.nombre}
                        layout="fill"
                        objectFit="cover"
                        className={`transition-opacity duration-300 ${isHovering ? 'opacity-0' : 'opacity-100'}`}
                    />
                    {product.imagenes[1] && (
                        <Image
                            src={product.imagenes[1].startsWith('http') ? product.imagenes[1] : `/${product.imagenes[1]}`}
                            alt={`${product.nombre} - vista alternativa`}
                            layout="fill"
                            objectFit="cover"
                            className={`transition-opacity duration-300 ${isHovering ? 'opacity-100' : 'opacity-0'}`}
                        />
                    )}
                    {product.enOferta && (
                        <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 text-xs font-semibold">
                            SALE
                        </div>
                    )}
                </div>
                <div className="min-h-[4rem]"> {/* Espacio fijo para el contenido */}
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
                </div>
            </Link>
            <div 
                className={`absolute bottom-4 left-4 right-4 flex items-center transition-opacity duration-300 bg-white bg-opacity-90 p-4 ${isHovering ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 '}`}
            >
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></span>
                <button className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-300">
                    Quick add
                </button>
            </div>
        </div>
    );
};
'use client';

import { Product } from '@/types';
import { getImageUrl } from '@/utils/demoImages';
import Image from 'next/image';
import { memo, useState } from 'react';

const ProductGallery = memo(({ product }: { product: Product }) => {
    const [mainImage, setMainImage] = useState(getImageUrl(product.imagenes[0]));
    const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
    const [isZoomed, setIsZoomed] = useState(false);

    const handleImageMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isZoomed) return;

        const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - left) / width) * 100;
        const y = ((e.clientY - top) / height) * 100;

        setZoomPosition({ x, y });
    };

    return (
        <div className="space-y-4">
            {/* Main image */}
            <div
                className="aspect-[3/4] relative bg-gray-50 rounded-lg overflow-hidden"
                onMouseEnter={() => setIsZoomed(true)}
                onMouseLeave={() => setIsZoomed(false)}
                onMouseMove={handleImageMouseMove}
            >
                <Image
                    src={mainImage}
                    alt={product.nombre}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className={`object-cover transition-transform duration-200 ${isZoomed ? 'scale-150' : 'scale-100'
                        }`}
                    style={{ transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%` }}
                    priority
                />
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-5 gap-2">
                {product.imagenes.map((img, idx) => (
                    <button
                        key={idx}
                        onClick={() => setMainImage(getImageUrl(img))}
                        className={`relative aspect-square rounded-md overflow-hidden ${mainImage === getImageUrl(img)
                                ? 'ring-2 ring-primary'
                                : 'opacity-75 hover:opacity-100'
                            }`}
                        aria-label={`Vista previa ${idx + 1}`}
                    >
                        <Image
                            src={getImageUrl(img)}
                            alt={`${product.nombre} - Vista ${idx + 1}`}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 20vw, 10vw"
                        />
                    </button>
                ))}
            </div>
        </div>
    );
});

ProductGallery.displayName = 'ProductGallery';

export default ProductGallery;
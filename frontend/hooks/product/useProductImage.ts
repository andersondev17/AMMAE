// hooks/useProductImages.ts
import { UploadService } from '@/services/uploadService';
import { Product } from '@/types';
import { useEffect, useMemo, useState } from 'react';

interface ProductImages {
    primary: string;
    hover: string;
    allImages: string[];
}

interface UseProductImagesReturn {
    images: ProductImages;
    isLoading: boolean;
    error: boolean;
}

export const useProductImages = (product: Product): UseProductImagesReturn => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);

    const images = useMemo(() => {
        try {
            const processedImages = product.imagenes
                ?.map(img => UploadService.getImageUrl(img))
                .filter(Boolean) || [];

            const defaultImage = `/assets/images/demo/${product.categoria.toLowerCase()}/default.jpg`;

            return {
                primary: processedImages[0] || defaultImage,
                hover: processedImages[1] || processedImages[0] || defaultImage,
                allImages: processedImages.length ? processedImages : [defaultImage]
            };
        } catch (err) {
            console.error('Error processing product images:', err);
            return {
                primary: '/assets/images/demo/default-product.jpg',
                hover: '/assets/images/demo/default-product.jpg',
                allImages: ['/assets/images/demo/default-product.jpg']
            };
        }
    }, [product]);

    useEffect(() => {
        let mounted = true;

        const preloadImages = async () => {
            try {
                setIsLoading(true);
                await Promise.all(
                    images.allImages.map(src => new Promise((resolve, reject) => {
                        const img = new Image();
                        img.onload = resolve;
                        img.onerror = reject;
                        img.src = src;
                    }))
                );
                if (mounted) setIsLoading(false);
            } catch (err) {
                console.error('Error preloading images:', err);
                if (mounted) {
                    setError(true);
                    setIsLoading(false);
                }
            }
        };

        preloadImages();

        return () => {
            mounted = false;
        };
    }, [images.allImages]);

    return { images, isLoading, error };
};
// hooks/useProductImage.ts
import type { Product } from '@/types';
import { getProductImages, preloadImage } from '@/utils/demoImages';
import { useEffect, useState } from 'react';

export const useProductImage = (product: Product) => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);
    const [images, setImages] = useState(() => getProductImages(product));

    useEffect(() => {
        const loadImages = async () => {
            try {
                setIsLoading(true);
                await Promise.all([
                    preloadImage(images.primary),
                    preloadImage(images.hover)
                ]);
                setIsLoading(false);
            } catch (err) {
                setError(true);
                setIsLoading(false);
            }
        };

        loadImages();
    }, [images.primary, images.hover]);

    return {
        isLoading,
        error,
        images
    };
};
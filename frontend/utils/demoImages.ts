// utils/demoImages.ts
import { Product } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

export const demoImages = {
    blusas: ['/assets/images/demo/blusa-floral-1.jpg', '/assets/images/demo/blusa-floral-2.jpg'],
    jeans: ['/assets/images/demo/jean-skinny-1.jpg', '/assets/images/demo/jean-slim-1.jpg'],
    placeholder: '/assets/images/demo/product-placeholder.jpg',
    default: '/assets/images/demo/blusa-floral-1.jpg'
};

interface CategoryImages {
    [key: string]: {
        primary: string[];
        hover: string[];
    };
}

export const CATEGORY_IMAGES: CategoryImages = {
    Jeans: {
        primary: [
            '/assets/images/demo/jeans/jean-1.jpg',
            '/assets/images/demo/jeans/jean-2.jpg',
            '/assets/images/demo/jeans/jean-slim-1.jpg'
        ],
        hover: [
           '/assets/images/demo/jeans/jean-2.jpg',
            '/assets/images/demo/jeans/jean-slim-1.jpg',
            '/assets/images/demo/jeans/jean-1.jpg'
        ]
    },
    Blusas: {
        primary: [
             '/assets/images/demo/blusas/blusa-floral-1.jpg',
            '/assets/images/demo/blusas/blusa-floral-2.jpg'
        ],
        hover: [
           '/assets/images/demo/blusas/blusa-floral-2.jpg',
            '/assets/images/demo/blusas/blusa-floral-1.jpg'
        ]
    },
    Vestidos: {
        primary: [
           '/assets/images/demo/vestidos/vestido-1.png',
            '/assets/images/demo/vestidos/vestido-2.png'
        ],
        hover: [
            '/assets/images/demo/vestidos/vestido-2.png',
            '/assets/images/demo/vestidos/vestido-1.png'
        ]
    },
    Accesorios: {
        primary: [
            '/assets/images/demo/accesorios/accesorio-1.png',
            '/assets/images/demo/accesorios/accesorio-2.png'
        ],
        hover: [
            '/assets/images/demo/accesorios/accesorio-2.png',
            '/assets/images/demo/accesorios/accesorio-1.png'
        ]
    }

};

export const DEFAULT_IMAGES = {
    primary: '/assets/images/demo/default-product.jpg',
    hover: '/assets/images/demo/default-product.jpg'
};
const processImageUrl = (url: string): string => {
    if (!url) return `${API_URL}${DEFAULT_IMAGES.primary}`;

    // Si la URL ya es absoluta, la devolvemos tal cual
    if (url.startsWith('http')) return url;

    // Si empieza con /assets, agregamos la URL base
    if (url.startsWith('/assets')) {
        return `${API_URL}${url}`;
    }

    // Para imágenes subidas desde el backend
    if (url.includes('image-')) {
        return `${API_URL}/assets/images/demo/${url}`;
    }

    // Para imágenes demo
    return `${API_URL}/assets/images/demo/${url}`;
};
export const getProductImages = (product: Product): { primary: string; hover: string } => {
    try {
        // Si el producto tiene imágenes subidas
        if (product.imagenes?.length) {
            const processedImages = product.imagenes.map(processImageUrl);
            return {
                primary: processedImages[0] || processImageUrl(DEFAULT_IMAGES.primary),
                hover: processedImages[1] || processedImages[0] || processImageUrl(DEFAULT_IMAGES.hover)
            };
        }

        // Usar imágenes de demo según la categoría
        const categoryImages = CATEGORY_IMAGES[product.categoria];
        if (categoryImages) {
            const randomIndex = Math.floor(Math.random() * categoryImages.primary.length);
            return {
                primary: processImageUrl(categoryImages.primary[randomIndex]),
                hover: processImageUrl(categoryImages.hover[randomIndex])
            };
        }

        return {
            primary: processImageUrl(DEFAULT_IMAGES.primary),
            hover: processImageUrl(DEFAULT_IMAGES.hover)
        };
    } catch (error) {
        console.error('Error processing product images:', error);
        return {
            primary: processImageUrl(DEFAULT_IMAGES.primary),
            hover: processImageUrl(DEFAULT_IMAGES.hover)
        };
    }
};
export const getImageUrl = (imageUrl: string): string => {
    try {
        if (!imageUrl) return DEFAULT_IMAGES.primary;
        
        const cleanUrl = imageUrl.trim();

        if (cleanUrl.startsWith('/assets')) return cleanUrl;
        if (cleanUrl.startsWith('http')) return cleanUrl;
        
        return `/assets/images/demo/${cleanUrl}`;
    } catch (error) {
        console.error('Error in getImageUrl:', error);
        return DEFAULT_IMAGES.primary;
    }
};
export const getCategoryImage = (category: string, index: number = 0): string => {
    const categoryImages = demoImages[category.toLowerCase() as keyof typeof demoImages];
    if (Array.isArray(categoryImages) && categoryImages[index]) {
        return categoryImages[index];
    }
    return demoImages.placeholder;
};
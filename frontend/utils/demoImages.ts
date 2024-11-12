// utils/demoImages.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

export const demoImages = {
    blusas: ['/assets/images/demo/blusa-floral-1.jpg', '/assets/images/demo/blusa-floral-2.jpg'],
    jeans: ['/assets/images/demo/jean-skinny-1.jpg', '/assets/images/demo/jean-slim-1.jpg'],
    placeholder: '/assets/images/demo/product-placeholder.jpg',
    default: '/assets/images/demo/default-product.jpg'
};

export const getImageUrl = (imageUrl: string): string => {
    if (!imageUrl) return demoImages.placeholder;

    // Limpiamos la URL
    const cleanUrl = imageUrl.trim();

    // Validamos diferentes casos
    if (cleanUrl.startsWith('http')) {
        return cleanUrl;
    }

    if (cleanUrl.startsWith('/assets')) {
        return cleanUrl;
    }

    // Si es una imagen de demo
    if (cleanUrl.includes('blusa_') || cleanUrl.includes('jean_')) {
        return `/assets/images/demo/${cleanUrl}`;
    }

    // Si es una imagen del backend
    if (cleanUrl.includes('images/')) {
        return `${API_URL}/${cleanUrl}`;
    }

    // Para cualquier otro caso, asumimos que está en demo
    return `/assets/images/demo/${cleanUrl}`;
};
// Helper para obtener imagen por categoría
export const getCategoryImage = (category: string, index: number = 0): string => {
    const categoryImages = demoImages[category.toLowerCase() as keyof typeof demoImages];
    if (Array.isArray(categoryImages) && categoryImages[index]) {
        return categoryImages[index];
    }
    return demoImages.placeholder;
};
const DEFAULT_IMAGE = '/assets/images/demo/default-product.jpg';

export const getImageUrl = (imageUrl?: string): string => {
    if (!imageUrl?.trim()) return DEFAULT_IMAGE;
    
    const cleanUrl = imageUrl.trim();
    
    // Next.js requiere paths absolutos
    if (cleanUrl.startsWith('assets/')) {
        return `/${cleanUrl}`;
    }
    
    if (cleanUrl.startsWith('/assets/') || cleanUrl.startsWith('http')) {
        return cleanUrl;
    }
    
    return `/assets/images/demo/${cleanUrl}`;
};

export const getProductImages = (product: { imagenes?: string[] }) => {
    const images = product.imagenes?.filter(Boolean) || [];
    
    if (images.length === 0) {
        return { primary: DEFAULT_IMAGE, hover: DEFAULT_IMAGE };
    }
    
    return {
        primary: getImageUrl(images[0]),
        hover: getImageUrl(images[1] || images[0])
    };
};
// src/config/imageConfig.js
const demoImages = {
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

const defaultImages = {
    primary: '/assets/images/demo/default-product.jpg',
    hover: '/assets/images/demo/default-product.jpg'
};

const getProductImages = (categoria) => {
    const images = demoImages[categoria];
    if (!images) return defaultImages;

    const randomIndex = Math.floor(Math.random() * images.primary.length);
    return {
        primary: images.primary[randomIndex],
        hover: images.hover[randomIndex]
    };
};

module.exports = {
    demoImages,
    defaultImages,
    getProductImages
};
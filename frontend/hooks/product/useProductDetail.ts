// hooks/product/useProductDetail.ts - OPTIMIZADO SEGÚN TU ANÁLISIS
import { useCart } from '@/hooks/cart/useCart';
import { Product } from '@/types';
import { getImageUrl } from '@/utils/imageUtils';
import { calculateProductPrice } from '@/utils/price';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

export function useProductDetail(product: Product) {
    // ✅ Estados simples
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedColor, setSelectedColor] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [mainImage, setMainImage] = useState(() => getImageUrl(product.imagenes[0]));
    const [isWishlist, setIsWishlist] = useState(false);
    const [expandedAccordion, setExpandedAccordion] = useState('details');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { addItem } = useCart();

    const pricing = useMemo(() => calculateProductPrice(product), [product.precio, product.precioOferta, product.enOferta]);

    const optimizedImages = useMemo(() =>
        product.imagenes.map(getImageUrl),
        [product.imagenes]
    );

    const stockStatus = useMemo(() => {
        if (product.stock === 0) return { text: 'Agotado', color: 'text-red-600' };
        if (product.stock <= 5) return { text: `¡Solo ${product.stock} en stock!`, color: 'text-amber-600' };
        return { text: 'En stock', color: 'text-green-600' };
    }, [product.stock]);

    const validation = useMemo(() => {
        if (!selectedSize && product.tallas?.length) {
            return { isValid: false, message: 'Selecciona una talla' };
        }
        if (!selectedColor && product.colores?.length) {
            return { isValid: false, message: 'Selecciona un color' };
        }
        return { isValid: true, message: '' };
    }, [selectedSize, selectedColor, product]);
    const adjustQuantity = (delta: number) => {
        setQuantity(prev => Math.max(1, Math.min(product.stock, prev + delta)));
    };

    const handleAddToCart = () => {
        if (!validation.isValid) {
            toast.error(validation.message);
            return;
        }
        addItem(product, { size: selectedSize, color: selectedColor, quantity });
    };

    const toggleWishlist = () => setIsWishlist(prev => !prev);
    const toggleModal = () => setIsModalOpen(prev => !prev);
    const toggleAccordion = (value: string) => setExpandedAccordion(prev => prev === value ? '' : value);

    return {
        // Estado
        selectedSize,
        selectedColor,
        quantity,
        mainImage,
        isWishlist,
        expandedAccordion,
        isModalOpen,

        // Computado
        pricing,
        validation,
        optimizedImages,
        stockStatus,

        setSelectedSize,
        setSelectedColor,
        setMainImage,
        adjustQuantity,
        toggleWishlist,
        toggleModal,
        toggleAccordion,
        handleAddToCart
    };
}

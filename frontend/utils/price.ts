const formatter = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0
});

export const formatPrice = (price: number | string): string => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return formatter.format(isNaN(numPrice) ? 0 : numPrice);
};

export const getProductPrice = (product: {
    precio: number;
    enOferta?: boolean;
    precioOferta?: number;
}) => {
    return product.enOferta && product.precioOferta 
        ? product.precioOferta 
        : product.precio;
};
//  CALCULADORA DE PRECIOS PARA PRODUCTOS
export const calculateProductPrice = (product: {
    precio: number;
    enOferta?: boolean;
    precioOferta?: number;
}) => {
    const finalPrice = getProductPrice(product);
    
    return {
        finalPrice,
        originalPrice: product.precio,
        isOnSale: product.enOferta && product.precioOferta,
        discount: product.enOferta && product.precioOferta 
            ? Math.round(((product.precio - product.precioOferta) / product.precio) * 100)
            : 0,
        formatted: {
            final: formatPrice(finalPrice),
            original: formatPrice(product.precio)
        }
    };
};

// CALCULADORA DE SUBTOTAL PARA CART
export const calculateCartSubtotal = (items: Array<{
    precio: number;
    quantity: number;
    enOferta?: boolean;
    precioOferta?: number;
}>) => {
    return items.reduce((total, item) => {
        const finalPrice = getProductPrice(item);
        return total + (finalPrice * item.quantity);
    }, 0);
};
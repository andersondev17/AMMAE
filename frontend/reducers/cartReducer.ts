// reducers/cartReducer.ts
import { calculateCartTotal, calculateItemTotal } from '@/lib/utils';
import { CartAction, CartState } from '@/types/cart.types';

export const cartReducer = (state: CartState, action: CartAction): CartState => {
    switch (action.type) {
        case 'ADD_TO_CART': {
            const { product, options } = action.payload;

            const existingItemIndex = state.items.findIndex(item =>
                item._id === product._id &&
                item.selectedSize === options?.size &&
                item.selectedColor === options?.color
            );

            if (existingItemIndex >= 0) {
                const updatedItems = state.items.map((item, index) => {
                    if (index === existingItemIndex) {
                        const newQuantity = item.quantity + (options?.quantity || 1);
                        return {
                            ...item,
                            quantity: Math.min(newQuantity, item.stock),
                            itemTotal: calculateItemTotal(item.precio, newQuantity)
                        };
                    }
                    return item;
                });

                return {
                    ...state,
                    items: updatedItems,
                    total: calculateCartTotal(updatedItems)
                };
            }

            const newItem = {
                ...product,
                quantity: options?.quantity || 1,
                selectedSize: options?.size,
                selectedColor: options?.color,
                itemTotal: calculateItemTotal(product.precio, options?.quantity || 1),
                price: product.precio
            };

            return {
                ...state,
                items: [...state.items, newItem],
                total: calculateCartTotal([...state.items, newItem]),
            };
        }
        default:
            return state;
    }
};
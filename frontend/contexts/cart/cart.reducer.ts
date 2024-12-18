import { CartItem, CartState } from '../../types/cart.types';
import { Product } from '../../types/product.types';

type CartAction =
    | { type: 'ADD_ITEM'; payload: Product }
    | { type: 'REMOVE_ITEM'; payload: string }
    | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
    | { type: 'CLEAR_CART' };

const calculateTotal = (items: CartItem[]): number => {
    return items.reduce((total, item) => {
        const price = item.enOferta && item.precioOferta
            ? item.precioOferta
            : item.precio;
        return total + (price * item.quantity);
    }, 0);
};

export const cartReducer = (state: CartState, action: CartAction): CartState => {
    switch (action.type) {
        case 'ADD_ITEM': {
            const existingItemIndex = state.items.findIndex(
                item => item._id === action.payload._id
            );

            if (existingItemIndex > -1) {
                const updatedItems = [...state.items];
                updatedItems[existingItemIndex].quantity += 1;
                return {
                    items: updatedItems,
                    total: calculateTotal(updatedItems)
                };
            }

            const newItems = [...state.items, { ...action.payload, quantity: 1 }];
            return {
                items: newItems,
                total: calculateTotal(newItems)
            };
        }

        case 'REMOVE_ITEM': {
            const filteredItems = state.items.filter(item => item._id !== action.payload);
            return {
                items: filteredItems,
                total: calculateTotal(filteredItems)
            };
        }

        case 'UPDATE_QUANTITY': {
            const updatedItems = state.items.map(item =>
                item._id === action.payload.id
                    ? { ...item, quantity: action.payload.quantity }
                    : item
            );
            return {
                items: updatedItems,
                total: calculateTotal(updatedItems)
            };
        }

        case 'CLEAR_CART':
            return {
                items: [],
                total: 0
            };

        default:
            return state;
    }
};
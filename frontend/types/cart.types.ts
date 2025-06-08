// types/cart.types.ts - TIPOS DE CARRITO CORREGIDOS
import { Product } from './index'; // SINGLE SOURCE OF TRUTH

export interface CartItem extends Product {
    quantity: number;
    selectedSize?: string;
    selectedColor?: string;
    itemTotal: number;
    price: number;
}

export interface CartOptions {
    size?: string;
    color?: string;
    quantity?: number;
}

export interface CartStore {
    items: CartItem[];
    total: number;
    itemCount: number;
    shipping: number;
    isOpen: boolean;
    
    // FUNCIÓN CORREGIDA - USA Product DE INDEX.TS
    addItem: (product: Product, options?: CartOptions) => void;
    removeItem: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    onClose: () => void;
    onOpen: () => void;
}

export interface CartState {
    items: CartItem[];
    total: number;
    isOpen: boolean;
}

export type CartAction =
    | { type: 'ADD_TO_CART'; payload: { product: Product; options?: CartOptions } }
    | { type: 'REMOVE_FROM_CART'; payload: string }
    | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
    | { type: 'CLEAR_CART' };
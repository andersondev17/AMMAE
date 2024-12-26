// types/cart.types.ts
import type { Dispatch } from 'react';
import type { Product, ProductSize } from './product.types';

export interface CartItem extends Product {
    quantity: number;
    selectedSize?: ProductSize;
    selectedColor?: string;
    itemTotal: number;
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

export interface CartOptions {
    size?: ProductSize;
    color?: string;
    quantity?: number;
}

export interface CartContextType {
    state: CartState;
    dispatch: Dispatch<CartAction>;
}
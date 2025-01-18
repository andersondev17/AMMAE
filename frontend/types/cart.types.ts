// types/cart.types.ts
import type { Dispatch } from 'react';
import type { Product } from './product.types';


export interface CartItem extends Product {
    quantity: number;
    selectedSize?: string;
    selectedColor?: string;
    itemTotal: number;
}

export interface WhatsAppOrderItem {
    _id: string;
    nombre: string;
    precio: number;
    quantity: number;
    itemTotal: number;
}


export interface CartStore {
    items: CartItem[];
    total: number;
    itemCount: number;
    shipping: number
    isOpen: boolean;
    addItem: (product: Product, options?: CartOptions) => void;
    removeItem: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    onClose: () => void;
    onOpen: () => void;
}

export interface CustomerDetails {
    name: string;
    phone: string;
    address: string;
    shippingMethod: string;
    orderNumber?: string; 
}

export interface CartOptions {
    size?: string;
    color?: string;
    quantity?: number;
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


export interface CartContextType {
    state: CartState;
    dispatch: Dispatch<CartAction>;
}
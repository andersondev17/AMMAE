// types/cart.types.ts - CLEAN & COMPLETE
import { Product } from './index';

// ===== CORE CART TYPES =====
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

// ===== CUSTOMER & ORDER TYPES =====
export interface CustomerDetails {
    name: string;
    phone: string;
    address: string;
    shippingMethod: string;
    orderNumber?: string;
    paymentMethod?: string;
}

export interface WhatsAppOrderItem {
    _id: string;
    nombre: string;
    precio: number;
    quantity: number;
    itemTotal: number;
    selectedSize?: string;
    selectedColor?: string;
}
// types/checkout.types.ts
import { CartItem } from '@/types/cart.types';

export enum PaymentMethod {
    CONTRA_ENTREGA = 'CONTRA_ENTREGA',
    TRANSFERENCIA = 'TRANSFERENCIA',
    QR = 'QR',
}


export interface PaymentSelectorProps {
    selectedMethod: PaymentMethod | null;
    onSelect: (method: PaymentMethod) => Promise<void>;
    orderNumber?: string | null; // Opcional
    isProcessing?: boolean;
}

export interface CheckoutOrderData {
    customerData: {
        nombre: string;
        email: string;
        telefono: string;
        direccion: string;
    };
    productos: Array<{
        producto: string;
        cantidad: number;
        talla: string;
        color: string;
    }>;
    metodoPago: string;
    totalPagado: number;
    direccionEnvio: {
        calle: string;
        ciudad: string;
        codigoPostal: string;
        pais: string;
    };
}
export interface OrderDetailsData {
    orderId: string;
    orderNumber: string;
    customerDetails: {
        name: string;
        phone: string;
        address: string;
        shippingMethod: string;
    };
    items: CartItem[];
    total: number;
    paymentMethod: PaymentMethod;
}


export interface Address {
    street: string;
    city: string;
    state: string;
    zipCode: string;
}

export interface CustomerFormData {
    fullName: string;
    email: string;
    phone: string;
    address: Address;
}

export interface OrderItem {
    productId: string;
    quantity: number;
    price: number;
    name: string;

}


export interface CheckoutFormData extends CustomerFormData {
    paymentMethod: PaymentMethod;
    orderItems: OrderItem[];
    subtotal: number;
    shipping: number;
    total: number;
}

export interface OrderSummaryProps {
    items: {
        _id: string;
        nombre: string;
        precio: number;
        quantity: number;
        imagenes: string[]; 
        itemTotal: number; 

    }[];
    subtotal: number;
    shipping: number;
    total: number;
    showShippingMethod?: boolean;
    shippingMethod?: 'standard' | 'express';
}

export interface CheckoutFormProps {
    onSubmit: (data: CheckoutFormData) => Promise<void>;
    isSubmitting?: boolean;
}
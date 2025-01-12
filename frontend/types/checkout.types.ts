// types/checkout.types.ts

export enum PaymentMethod {
    CONTRA_ENTREGA = 'CONTRA_ENTREGA',
    TRANSFERENCIA = 'TRANSFERENCIA',
    QR = 'QR',
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
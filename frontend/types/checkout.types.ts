// types/checkout.types.ts
import { z } from 'zod';

export enum PaymentMethod {
    CONTRA_ENTREGA = 'CONTRA_ENTREGA',
    TRANSFERENCIA = 'TRANSFERENCIA',
    QR = 'QR'
}

export const checkoutFormSchema = z.object({
    fullName: z.string().min(1, 'El nombre es requerido'),
    email: z.string().email('Email inválido'),
    phone: z.string().min(1, 'El teléfono es requerido'),
    address: z.object({
        street: z.string().min(1, 'La dirección es requerida'),
        city: z.string().min(1, 'La ciudad es requerida'),
        zipCode: z.string().min(1, 'El código postal es requerido')
    })
});

export type CheckoutFormInputs = z.infer<typeof checkoutFormSchema>;

export interface FormFieldError {
    message?: string;
}

export interface AddressFieldErrors {
    street?: FormFieldError;
    city?: FormFieldError;
    zipCode?: FormFieldError;
}

export interface FormErrors {
    fullName?: FormFieldError;
    email?: FormFieldError;
    phone?: FormFieldError;
    address?: AddressFieldErrors;
}

export interface CustomerFormData extends CheckoutFormInputs {
    address: {
        street: string;
        city: string;
        zipCode: string;
    };
}
// lib/validations/checkout.schema.ts
import * as z from 'zod';

const phoneRegex = /^(\+?\d{1,3}[- ]?)?\d{10}$/;
const zipCodeRegex = /^\d{5}(-\d{4})?$/;

export const addressSchema = z.object({
    street: z
        .string()
        .min(5, 'La dirección debe tener al menos 5 caracteres')
        .max(100, 'La dirección no puede exceder 100 caracteres'),
    city: z
        .string()
        .min(2, 'La ciudad debe tener al menos 2 caracteres')
        .max(50, 'La ciudad no puede exceder 50 caracteres'),
    state: z
        .string()
        .min(2, 'El estado debe tener al menos 2 caracteres')
        .max(50, 'El estado no puede exceder 50 caracteres'),
    zipCode: z
        .string()
        .regex(zipCodeRegex, 'Código postal inválido'),
});

export const checkoutFormSchema = z.object({
    fullName: z
        .string()
        .min(2, 'El nombre debe tener al menos 2 caracteres')
        .max(50, 'El nombre no puede exceder 50 caracteres'),
    email: z
        .string()
        .email('Email inválido')
        .min(5, 'El email debe tener al menos 5 caracteres')
        .max(50, 'El email no puede exceder 50 caracteres'),
    phone: z
        .string()
        .regex(phoneRegex, 'Número de teléfono inválido'),
    address: addressSchema,
    shippingMethod: z.enum(['standard', 'express']),
    saveAddress: z.boolean().default(false),
    paymentMethod: z.enum(['CONTRA_ENTREGA', 'TRANSFERENCIA', 'QR']).optional(),
});

export type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;

export const SHIPPING_METHODS = {
    STANDARD: {
        value: 'standard',
        label: 'Estándar (5-7 días)',
        price: 5,
    },
    EXPRESS: {
        value: 'express',
        label: 'Express (2-3 días)',
        price: 15,
    },
} as const;
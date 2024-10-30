import * as z from 'zod';
// lib/validations/product.ts

export const ProductFormSchema = z.object({
    nombre: z.string()
        .min(3, 'El nombre debe tener al menos 3 caracteres')
        .max(100, 'El nombre no puede exceder los 100 caracteres'),
    descripcion: z.string()
        .min(10, 'La descripción debe tener al menos 10 caracteres'),
        precio: z.string()
        .or(z.number())
        .transform(val => Number(val))
        .refine(val => val >= 0, 'El precio no puede ser negativo'),
    categoria: z.enum(['Jeans', 'Blusas', 'Vestidos', 'Faldas', 'Accesorios']),
    tallas: z.array(z.enum(['XS', 'S', 'M', 'L', 'XL', 'XXL'])),
    colores: z.array(z.string()),
    imagenes: z.array(z.string()),
    stock: z.string()
        .or(z.number())
        .transform(val => Number(val))
        .refine(val => val >= 0, 'El stock no puede ser negativo'),
    enOferta: z.boolean().optional(),
    precioOferta: z.string()
    .or(z.number())
    .transform(val => Number(val))
    .refine(val => val >= 0, 'El precio de oferta no puede ser negativo')
    .optional(),
    estilo: z.string(),
    material: z.string()
});
export type ProductFormValues = z.infer<typeof ProductFormSchema>;
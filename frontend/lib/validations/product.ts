import * as z from 'zod';

export const ProductFormSchema = z.object({
    nombre: z.string()
        .min(3, 'El nombre debe tener al menos 3 caracteres')
        .max(100, 'El nombre no puede exceder los 100 caracteres'),
    descripcion: z.string()
        .min(10, 'La descripción debe tener al menos 10 caracteres')
        .max(1000, 'La descripción no puede exceder los 1000 caracteres'),
    precio: z.string()
        .or(z.number())
        .transform(val => Number(val))
        .refine(val => val >= 0, 'El precio no puede ser negativo'),
    categoria: z.enum(['Jeans', 'Blusas', 'Vestidos', 'Faldas', 'Accesorios'], {
        errorMap: () => ({ message: 'Selecciona una categoría válida' })
    }),
    tallas: z.array(z.enum(['XS', 'S', 'M', 'L', 'XL', 'XXL']))
        .min(1, 'Selecciona al menos una talla'),
    colores: z.array(z.string())
        .min(1, 'Selecciona al menos un color'),
    stock: z.string()
        .or(z.number())
        .transform(val => Number(val))
        .refine(val => val >= 0, 'El stock no puede ser negativo'),
    enOferta: z.boolean().default(false),
    precioOferta: z.string()
        .or(z.number())
        .transform(val => Number(val))
        .refine(val => val >= 0, 'El precio de oferta no puede ser negativo')
        .optional(),
    estilo: z.string().min(1, 'El estilo es requerido'),
    material: z.string().min(1, 'El material es requerido'),
    imagenes: z.array(z.string().url('URL de imagen inválida'))
        .min(1, 'Agrega al menos una imagen')
        .max(4, 'No puedes agregar más de 4 imágenes')
});

export type ProductFormValues = z.infer<typeof ProductFormSchema>;
import { ColorPicker } from '@/components/shared/ColorPicker';
import { ImageUpload } from '@/components/shared/ImageUpload';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/form/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProductFormSchema } from '@/lib/validations/product';
import { Product, ProductFormData, ProductFormInput } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface AddProductFormProps {
    initialData?: Product | null;
    onSubmit: (data: ProductFormData) => Promise<void>;
    isSubmitting?: boolean;
}

export const AddProductForm: React.FC<AddProductFormProps> = ({
    initialData,
    onSubmit,
    isSubmitting = false
}) => {
    const [imageUrls, setImageUrls] = useState<string[]>(initialData?.imagenes || []);
    const [submitting, setSubmitting] = useState(false);

    const {
        register,
        control,
        handleSubmit,
        watch,
        setValue,
        reset,
        formState: { errors }
    } = useForm<ProductFormInput>({
        resolver: zodResolver(ProductFormSchema),
        defaultValues: {
            nombre: initialData?.nombre || '',
            descripcion: initialData?.descripcion || '',
            precio: initialData?.precio || 0,
            categoria: initialData?.categoria || '',
            tallas: initialData?.tallas || [],
            colores: initialData?.colores || [],
            stock: initialData?.stock || 0,
            enOferta: initialData?.enOferta || false,
            precioOferta: initialData?.precioOferta || 0,
            estilo: initialData?.estilo || '',
            material: initialData?.material || '',
            imagenes: initialData?.imagenes || [],
        },
        mode: 'onChange'
    });

    const enOfertaValue = watch('enOferta');
    const isButtonDisabled = isSubmitting || submitting;

    // ✅ CLEAN TRANSFORMATION - NO COMPUTED FIELDS
    const handleFormSubmit = async (data: ProductFormInput) => {
        if (!data.nombre?.trim() || !data.descripcion?.trim() || !data.categoria) {
            toast.error('Complete todos los campos requeridos');
            return;
        }

        setSubmitting(true);
        try {
            // ✅ PURE FORM DATA - LET BACKEND/UI HANDLE COMPUTED FIELDS
            const formData: ProductFormData = {
                nombre: data.nombre.trim(),
                descripcion: data.descripcion.trim(),
                precio: Number(data.precio),
                categoria: data.categoria as any,
                tallas: data.tallas.map(talla => talla as any) || [],
                colores: data.colores || [],
                stock: Number(data.stock),
                enOferta: Boolean(data.enOferta),
                precioOferta: data.enOferta ? Number(data.precioOferta) : undefined,
                estilo: data.estilo?.trim() || '',
                material: data.material?.trim() || '',
                imagenes: imageUrls
                // ❌ NO COMPUTED FIELDS - SINGLE RESPONSIBILITY PRINCIPLE
            };

            await onSubmit(formData);

            if (!initialData) {
                reset();
                setImageUrls([]);
            }
        } catch (error) {
            console.error('Form submit error:', error);
            toast.error('Error al guardar el producto');
        } finally {
            setSubmitting(false);
        }
    };

    const CATEGORIES = ['Jeans', 'Blusas', 'Vestidos', 'Faldas', 'Accesorios'] as const;
    const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'] as const;

    return (
        <div className="flex flex-col h-full">
            <form onSubmit={handleSubmit(handleFormSubmit)} className="relative max-h-[calc(100vh-200px)] overflow-y-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
                    {/* LEFT COLUMN - BASIC INFO */}
                    <section className="space-y-6">
                        <div className="space-y-4">
                            {/* Product Name */}
                            <div className="space-y-2">
                                <label htmlFor="nombre" className="text-sm font-medium">
                                    Nombre del Producto
                                </label>
                                <Input
                                    id="nombre"
                                    {...register('nombre')}
                                    placeholder="Ej: Blusa Floral Manga Larga"
                                    disabled={isSubmitting}
                                />
                                {errors.nombre && (
                                    <p className="text-sm text-red-500">{errors.nombre.message}</p>
                                )}
                            </div>

                            {/* Description */}
                            <div className="space-y-2">
                                <label htmlFor="descripcion" className="text-sm font-medium">
                                    Descripción
                                </label>
                                <textarea
                                    id="descripcion"
                                    {...register('descripcion')}
                                    className="w-full min-h-[100px] px-3 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Describe el producto..."
                                    disabled={isSubmitting}
                                />
                                {errors.descripcion && (
                                    <p className="text-sm text-red-500">{errors.descripcion.message}</p>
                                )}
                            </div>

                            {/* Price & Stock Grid */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label htmlFor="precio" className="text-sm font-medium">Precio</label>
                                    <Input
                                        id="precio"
                                        {...register('precio')}
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        disabled={isSubmitting}
                                    />
                                    {errors.precio && (
                                        <p className="text-sm text-red-500">{errors.precio.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="stock" className="text-sm font-medium">Stock</label>
                                    <Input
                                        id="stock"
                                        {...register('stock')}
                                        type="number"
                                        min="0"
                                        disabled={isSubmitting}
                                    />
                                    {errors.stock && (
                                        <p className="text-sm text-red-500">{errors.stock.message}</p>
                                    )}
                                </div>
                            </div>

                            {/* Category */}
                            <Controller
                                name="categoria"
                                control={control}
                                render={({ field }) => (
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Categoría</label>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            disabled={isSubmitting}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecciona categoría" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {CATEGORIES.map(cat => (
                                                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.categoria && (
                                            <p className="text-sm text-red-500">{errors.categoria.message}</p>
                                        )}
                                    </div>
                                )}
                            />

                            {/* Size Selection */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Tallas disponibles</label>
                                <div className="flex flex-wrap gap-2">
                                    {SIZES.map(size => {
                                        const isSelected = watch('tallas').includes(size);
                                        return (
                                            <button
                                                key={size}
                                                type="button"
                                                onClick={() => {
                                                    const current = watch('tallas');
                                                    setValue('tallas',
                                                        isSelected
                                                            ? current.filter(s => s !== size)
                                                            : [...current, size]
                                                    );
                                                }}
                                                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors
                                                    ${isSelected
                                                        ? 'bg-black text-white'
                                                        : 'bg-gray-100 hover:bg-gray-200'
                                                    }`}
                                                disabled={isSubmitting}
                                            >
                                                {size}
                                            </button>
                                        );
                                    })}
                                </div>
                                {errors.tallas && (
                                    <p className="text-sm text-red-500">{errors.tallas.message}</p>
                                )}
                            </div>
                        </div>
                    </section>

                    {/* RIGHT COLUMN - MEDIA & DETAILS */}
                    <section className="space-y-6">
                        {/* Images Upload */}
                        <div className="space-y-4">
                            <h4 className="text-lg font-medium">Imágenes del producto</h4>
                            <ImageUpload
                                value={imageUrls}
                                onChange={setImageUrls}
                                maxImages={4}
                                disabled={isSubmitting}
                            />
                        </div>

                        {/* Additional Details */}
                        <div className="space-y-4">
                            <h4 className="text-lg font-medium">Detalles adicionales</h4>
                            
                            {/* Sale Checkbox */}
                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    {...register('enOferta')}
                                    className="w-4 h-4 rounded border-gray-300"
                                    id="enOferta"
                                    disabled={isSubmitting}
                                />
                                <label htmlFor="enOferta" className="text-sm font-medium">
                                    Producto en oferta
                                </label>
                            </div>

                            {/* Sale Price - Conditional */}
                            {enOfertaValue && (
                                <div className="space-y-2">
                                    <label htmlFor="precioOferta" className="text-sm font-medium">
                                        Precio de oferta
                                    </label>
                                    <Input
                                        id="precioOferta"
                                        {...register('precioOferta')}
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        disabled={isSubmitting}
                                    />
                                    {errors.precioOferta && (
                                        <p className="text-sm text-red-500">{errors.precioOferta.message}</p>
                                    )}
                                </div>
                            )}

                            {/* Style */}
                            <div className="space-y-2">
                                <label htmlFor="estilo" className="text-sm font-medium">Estilo</label>
                                <Input
                                    id="estilo"
                                    {...register('estilo')}
                                    placeholder="Ej: Casual, Formal, etc."
                                    disabled={isSubmitting}
                                />
                                {errors.estilo && (
                                    <p className="text-sm text-red-500">{errors.estilo.message}</p>
                                )}
                            </div>

                            {/* Material */}
                            <div className="space-y-2">
                                <label htmlFor="material" className="text-sm font-medium">Material</label>
                                <Input
                                    id="material"
                                    {...register('material')}
                                    placeholder="Ej: Algodón, Poliéster, etc."
                                    disabled={isSubmitting}
                                />
                                {errors.material && (
                                    <p className="text-sm text-red-500">{errors.material.message}</p>
                                )}
                            </div>

                            {/* Color Picker */}
                            <ColorPicker
                                selected={watch('colores')}
                                onChange={(colors) => setValue('colores', colors)}
                                disabled={isSubmitting}
                            />
                        </div>
                    </section>
                </div>

                {/* STICKY FOOTER - SUBMIT BUTTON */}
                <footer className="sticky bottom-0 left-0 right-0 mt-auto border-t bg-white p-4 shadow-md">
                    <div className="max-w-[1400px] mx-auto flex justify-end">
                        <Button
                            type="submit"
                            disabled={isButtonDisabled}
                            className="min-w-[150px]"
                        >
                            {isButtonDisabled ? (
                                <div className="flex items-center justify-center space-x-2">
                                    <span className="animate-spin">⚪</span>
                                    <span>{initialData ? 'Actualizando...' : 'Creando...'}</span>
                                </div>
                            ) : (
                                <span>{initialData ? 'Guardar cambios' : 'Crear producto'}</span>
                            )}
                        </Button>
                    </div>
                </footer>
            </form>
        </div>
    );
};
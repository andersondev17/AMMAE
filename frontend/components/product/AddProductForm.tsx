import ErrorBoundary from '@/components/ErrorBoundary';
import { ColorPicker } from '@/components/shared/ColorPicker';
import { ImageUpload } from '@/components/shared/ImageUpload';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
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
    const initialImages = initialData?.imagenes?.map(img =>
        img.startsWith('http') || img.startsWith('/assets') ?
            img : `/assets/images/demo/${img}`
    ) || [];

    const [imageUrls, setImageUrls] = useState<string[]>(initialData?.imagenes || []);
    const [submitting, setSubmitting] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadingImages, setUploadingImages] = useState<File[]>([]);

    
    const {
        register,
        control,
        handleSubmit,
        watch,
        setValue,
        reset,
        formState: { errors, isDirty }
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

    const handleFormSubmit = async (data: ProductFormInput) => {
        try {
            setSubmitting(true);
            console.log('AddProductForm handleFormSubmit iniciado con datos:', data);

            if (!data.nombre || !data.descripcion || !data.categoria) {
                toast.error('Por favor complete todos los campos requeridos');
                return;
            }

            const formData: ProductFormData = {
                nombre: data.nombre.trim(),
                descripcion: data.descripcion.trim(),
                precio: Number(data.precio),
                categoria: data.categoria as "Jeans" | "Blusas" | "Vestidos" | "Faldas" | "Accesorios",
                tallas: data.tallas.map(talla => talla as "XS" | "S" | "M" | "L" | "XL" | "XXL") || [],
                colores: data.colores || [],
                stock: Number(data.stock),
                enOferta: Boolean(data.enOferta),
                precioOferta: data.enOferta ? Number(data.precioOferta) : undefined,
                estilo: data.estilo?.trim() || '',
                material: data.material?.trim() || '',
                imagenes: imageUrls.map(url => {
                    if (url.startsWith('/assets/images/demo/')) {
                        return url.split('/').pop() || url;
                    }
                    return url;
                })
            };

            await onSubmit(formData);
            toast.success('Producto creado exitosamente:');

            if (!initialData) {
                reset();
                setImageUrls([]);
            }
        } catch (error) {
            console.error('Error en AddProductForm handleFormSubmit:', error);
            toast.error('Error al crear el producto');
        } finally {
            setSubmitting(false);
        }
    };

    const isButtonDisabled = isSubmitting || submitting;

    return (
        <div className="flex flex-col h-full">
            <form onSubmit={handleSubmit(handleFormSubmit)} className="relative max-h-[calc(100vh-200px)] overflow-y-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
                    <div className="space-y-6">
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium">Información básica</h3>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Nombre del Producto</label>
                                    <Input
                                        {...register('nombre')}
                                        placeholder="Ej: Blusa Floral Manga Larga"
                                        className="w-full"
                                        disabled={isSubmitting}
                                    />
                                    {errors.nombre && (
                                        <p className="text-sm text-red-500">{errors.nombre.message}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Descripción</label>
                                    <textarea
                                        {...register('descripcion')}
                                        className="w-full min-h-[100px] px-3 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Describe el producto..."
                                        disabled={isSubmitting}
                                    />
                                    {errors.descripcion && (
                                        <p className="text-sm text-red-500">{errors.descripcion.message}</p>
                                    )}
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Precio</label>
                                        <Input
                                            {...register('precio')}
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            className="w-full"
                                            disabled={isSubmitting}
                                        />
                                        {errors.precio && (
                                            <p className="text-sm text-red-500">{errors.precio.message}</p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Stock</label>
                                        <Input
                                            {...register('stock')}
                                            type="number"
                                            min="0"
                                            className="w-full"
                                            disabled={isSubmitting}
                                        />
                                        {errors.stock && (
                                            <p className="text-sm text-red-500">{errors.stock.message}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium">Categorización</h3>
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
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Selecciona categoría" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {['Jeans', 'Blusas', 'Vestidos', 'Faldas', 'Accesorios'].map(cat => (
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
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Tallas disponibles</label>
                                <div className="flex flex-wrap gap-2">
                                    {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map(size => {
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
                    </div>
                    <div className="space-y-6">
                        <ErrorBoundary
                            fallback={
                                <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                                    <p className="text-red-600">Esta es una imagen demo</p>
                                </div>
                            }
                        >
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium">Imágenes del producto</h3>
                                <ImageUpload
                                    value={imageUrls}
                                    onChange={setImageUrls}
                                    maxImages={4}
                                    disabled={isSubmitting}
                                />
                                {uploadingImages.length > 0 && (
                                    <div className="mt-2">
                                        <p>Subiendo {uploadingImages.length} imagen(es)...</p>
                                        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                                            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </ErrorBoundary>
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium">Detalles adicionales</h3>
                            <div className="space-y-4">
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
                                {enOfertaValue && (
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Precio de oferta</label>
                                        <Input
                                            {...register('precioOferta')}
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            className="w-full"
                                            disabled={isSubmitting}
                                        />
                                        {errors.precioOferta && (
                                            <p className="text-sm text-red-500">{errors.precioOferta.message}</p>
                                        )}
                                    </div>
                                )}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Estilo</label>
                                    <Input
                                        {...register('estilo')}
                                        placeholder="Ej: Casual, Formal, etc."
                                        className="w-full"
                                        disabled={isSubmitting}
                                    />
                                    {errors.estilo && (
                                        <p className="text-sm text-red-500">{errors.estilo.message}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Material</label>
                                    <Input
                                        {...register('material')}
                                        placeholder="Ej: Algodón, Poliéster, etc."
                                        className="w-full"
                                        disabled={isSubmitting}
                                    />
                                    {errors.material && (
                                        <p className="text-sm text-red-500">{errors.material.message}</p>
                                    )}
                                </div>
                                <ColorPicker
                                    selected={watch('colores')}
                                    onChange={(colors) => setValue('colores', colors)}
                                    disabled={isSubmitting}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="sticky bottom-0 left-0 right-0 mt-auto border-t bg-white p-4 shadow-md">
                    <div className="max-w-[1400px] mx-auto flex justify-end">
                        <Button
                            type="submit"
                            disabled={isButtonDisabled}
                            className="min-w-[150px]"
                        >
                            {(isSubmitting || submitting) ? (
                                <div className="flex items-center justify-center space-x-2">
                                    <span className="animate-spin">⚪</span>
                                    <span>{initialData ? 'Actualizando...' : 'Creando...'}</span>
                                </div>
                            ) : (
                                <span>{initialData ? 'Guardar cambios' : 'Crear producto'}</span>
                            )}
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
};


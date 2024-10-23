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
    const [imageUrls, setImageUrls] = useState<string[]>(initialData?.imagenes || []);

    const defaultValues: ProductFormInput = {
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
    };

    const {
        register,
        control,
        handleSubmit,
        watch,
        setValue,
        formState: { errors }
    } = useForm<ProductFormInput>({
        resolver: zodResolver(ProductFormSchema),
        defaultValues
    });

    const enOfertaValue = watch('enOferta');

    const handleFormSubmit = async (data: ProductFormInput) => {
        try {
            if (imageUrls.length === 0) {
                toast.error('Debes agregar al menos una imagen');
                return;
            }

            const formData: ProductFormData = {
                ...data,
                imagenes: imageUrls,
                precio: Number(data.precio),
                stock: Number(data.stock),
                precioOferta: data.precioOferta ? Number(data.precioOferta) : undefined,
                categoria: data.categoria as ProductFormData['categoria'],
                tallas: data.tallas as ProductFormData['tallas']
            };
            await onSubmit(formData);
        } catch (error) {
            console.error('Error submitting form:', error);
            toast.error('Error al guardar el producto');
        }
    };

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <div>
                        <label className="text-sm font-medium text-gray-700">Nombre del Producto</label>
                        <Input
                            {...register('nombre')}
                            placeholder="Ej: Blusa Floral Manga Larga"
                            disabled={isSubmitting}
                        />
                        {errors.nombre && (
                            <p className="text-sm text-red-500">{errors.nombre.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-700">Descripción</label>
                        <textarea
                            {...register('descripcion')}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            rows={4}
                            placeholder="Describe el producto..."
                            disabled={isSubmitting}
                        />
                        {errors.descripcion && (
                            <p className="text-sm text-red-500">{errors.descripcion.message}</p>
                        )}
                    </div>

                    <Controller
                        name="categoria"
                        control={control}
                        render={({ field }) => (
                            <div>
                                <label className="text-sm font-medium text-gray-700">Categoría</label>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    disabled={isSubmitting}
                                >
                                    <SelectTrigger>
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

                    <Controller
                        name="tallas"
                        control={control}
                        render={({ field }) => (
                            <div>
                                <label className="text-sm font-medium text-gray-700">Tallas</label>
                                <Select
                                    onValueChange={(value) => field.onChange([...field.value, value])}
                                    value={undefined}
                                    disabled={isSubmitting}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Agregar talla" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map(talla => (
                                            <SelectItem key={talla} value={talla}>{talla}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {field.value.map((talla) => (
                                        <div key={talla} className="bg-gray-100 px-2 py-1 rounded-md flex items-center">
                                            <span>{talla}</span>
                                            <button
                                                type="button"
                                                onClick={() => field.onChange(field.value.filter(t => t !== talla))}
                                                className="ml-2 text-red-500"
                                                disabled={isSubmitting}
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                {errors.tallas && (
                                    <p className="text-sm text-red-500">{errors.tallas.message}</p>
                                )}
                            </div>
                        )}
                    />
                </div>

                <div className="space-y-4">
                    <ImageUpload
                        value={imageUrls}
                        onChange={setImageUrls}
                        maxImages={4}
                        disabled={isSubmitting}
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium text-gray-700">Precio</label>
                            <Input
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

                        <div>
                            <label className="text-sm font-medium text-gray-700">Stock</label>
                            <Input
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

                    <div>
                        <label className="flex items-center space-x-2">
                            <Input
                                type="checkbox"
                                {...register('enOferta')}
                                className="w-4 h-4"
                                disabled={isSubmitting}
                            />
                            <span className="text-sm font-medium text-gray-700">En oferta</span>
                        </label>
                    </div>

                    {enOfertaValue && (
                        <div>
                            <label className="text-sm font-medium text-gray-700">Precio de oferta</label>
                            <Input
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

                    <div>
                        <label className="text-sm font-medium text-gray-700">Estilo</label>
                        <Input
                            {...register('estilo')}
                            placeholder="Ej: Casual, Formal, etc."
                            disabled={isSubmitting}
                        />
                        {errors.estilo && (
                            <p className="text-sm text-red-500">{errors.estilo.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-700">Material</label>
                        <Input
                            {...register('material')}
                            placeholder="Ej: Algodón, Poliéster, etc."
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

            <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full md:w-auto"
            >
                {isSubmitting ? 'Guardando...' : initialData ? 'Actualizar Producto' : 'Crear Producto'}
            </Button>
        </form>
    );
};
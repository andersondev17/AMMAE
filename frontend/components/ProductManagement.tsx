// LOGICA DE PRESENTACION
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useProducts } from '@/hooks/product/useProducts';
import { Product, ProductFilters, ProductFormData } from '@/types';
import { useState } from 'react';
import { toast } from 'sonner';
import { AddProductForm } from './admin/AddProductForm';
import { ProductList } from './product/ProductList';

/**
 * Filtros por defecto para la gestión de productos
 */
const DEFAULT_FILTERS: ProductFilters = {
    fields: '',
    sortBy: '',
    page: 1,
    limit: 10,
    search: '',
    categoria: '',
    tallas: '',
    color: '',
    precioMin: '',
    precioMax: '',
    enOferta: false,
    stock: 'inStock'
};

interface ProductManagementProps {
    initialFilters?: Partial<ProductFilters>;
}

/**
 * Componente para la gestión de productos
 * Permite crear, editar, eliminar y listar productos
 */
export const ProductManagement: React.FC<ProductManagementProps> = ({
    initialFilters = {}
}) => {
    // Estado local para el formulario y producto en edición
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    // Hook personalizado para la gestión de productos
    const {
        products,
        isLoading,
        error,
        mutations,
        totalCount,
        pagination
    } = useProducts({
        ...DEFAULT_FILTERS,
        ...initialFilters
    });

    /**
     * Maneja la creación o actualización de un producto
     */
    const handleSubmit = async (data: ProductFormData) => {
        try {
            if (editingProduct) {
                await mutations.update.mutateAsync({
                    id: editingProduct._id,
                    data
                });
                toast.success('Producto actualizado exitosamente');
            } else {
                await mutations.create.mutateAsync(data);
                toast.success('Producto creado exitosamente');
            }
            setIsFormOpen(false);
            setEditingProduct(null);
        } catch (error) {
            toast.error('Error al guardar el producto');
            console.error('Error en la operación:', error);
        }
    };

    const handleEdit = (product: Product) => {
        setEditingProduct(product);
        setIsFormOpen(true);
    };
    const handleDelete = async (id: string) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este producto?')) {
            try {
                await mutations.delete.mutateAsync(id);
                toast.success('Producto eliminado exitosamente');
            } catch (error) {
                toast.error('Error al eliminar el producto');
            }
        }
    };

    /**
     * Maneja el cierre del diálogo de formulario
     */
    const handleDialogChange = (open: boolean) => {
        setIsFormOpen(open);
        if (!open) setEditingProduct(null);
    };

    return (
        <div className="space-y-9">
            <ProductList
                products={products || []}
                isLoading={isLoading}
                error={error instanceof Error ? error : null}
                onEdit={handleEdit}
                onDelete={handleDelete}
                isDeleting={mutations.delete.isPending}
                isAdminView={true}
            />

            <Dialog
                open={isFormOpen}
                onOpenChange={handleDialogChange}
            >
                <DialogContent aria-describedby='dialog-description' className="max-w-4xl">
                    <AddProductForm
                        initialData={editingProduct}
                        onSubmit={handleSubmit}
                        isSubmitting={mutations.create.isPending || mutations.update.isPending}
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
};
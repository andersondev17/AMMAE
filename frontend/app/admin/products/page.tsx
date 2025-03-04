'use client';
// App Router de Next.js 14 con Server Components

import { AddProductForm } from '@/components/product/AddProductForm';
import { ProductList } from '@/components/product/ProductList';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useProducts } from '@/hooks/product/useProducts';
import { Product, ProductFilters, ProductFormData } from '@/types';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function AdminProductsPage() {
  const [filters, setFilters] = useState<ProductFilters>({
    fields:'',
    limit: 12,
    page: 1
  });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const {
    products,
    isLoading,
    error,
    totalCount,
    mutations,
    pagination,
    refresh
  } = useProducts({
    ...filters
  });


  const handleFilterChange = (filter: string) => {
    setFilters((prev: any) => {
      const newFilters = { ...prev };
      delete newFilters.stock;
      delete newFilters.enOferta;

      switch (filter) {
        case 'inStock':
          newFilters.stock = 'inStock';
          break;
        case 'lowStock':
          newFilters.stock = 'lowStock';
          break;
        case 'outOfStock':
          newFilters.stock = 'outOfStock';
          break;
        case 'onSale':
          newFilters.enOferta = true;
          break;
        default:
          return { limit: 12, page: 1 };
      }

      return newFilters;
    });
  };

  const handleSubmit = async (data: ProductFormData) => {
    try {
      console.log('AdminPage - Iniciando handleSubmit con datos:', data);

      const productData: ProductFormData = {
        ...data,
        precio: Number(data.precio),
        stock: Number(data.stock),
        precioOferta: data.enOferta ? Number(data.precioOferta) : undefined,
        tallas: data.tallas || [],
        colores: data.colores || [],
        imagenes: data.imagenes || []
      };

      if (editingProduct) {
        console.log('AdminPage - Actualizando producto:', {
          id: editingProduct._id,
          data: productData
        });

        await mutations.update.mutateAsync({
          id: editingProduct._id,
          data: productData
        });
      } else {
        await mutations.create.mutateAsync(productData);
      }
      setIsFormOpen(false);
      setEditingProduct(null);
      await refresh();

    } catch (error: any) {
      console.error('Error en handleSubmit:', error);
      toast.error(error.response?.data?.message || 'Error al guardar el producto');
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await mutations.delete.mutateAsync(id);
      toast.success('Producto eliminado exitosamente');
      refresh();
    } catch (error) {
      toast.error('Error al eliminar el producto');
      console.error('Error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-zentry tracking-wider transition-colors">
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">Gestión de Productos</h1>
              <p className="text-sm text-gray-500 mt-1">
                Administra tu catálogo de productos AMMAE ({totalCount} productos)
              </p>
            </div>

            <div className="flex items-center gap-4">

              <Button
                onClick={() => {
                  setEditingProduct(null);
                  setIsFormOpen(true);
                }}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                <span>Nuevo Producto</span>
              </Button>
            </div>
          </div>

          <div className="mt-6 flex gap-4 overflow-x-auto pb-2">
            <Button
              variant={!filters.stock && !filters.enOferta ? "default" : "ghost"}
              className="whitespace-nowrap"
              onClick={() => handleFilterChange('all')}
            >
              Todos los productos
            </Button>
            <Button
              variant={filters.stock === 'inStock' ? "default" : "ghost"}
              className="whitespace-nowrap"
              onClick={() => handleFilterChange('inStock')}
            >
              En stock
            </Button>
            <Button
              variant={filters.stock === 'lowStock' ? "default" : "ghost"}
              className="whitespace-nowrap"
              onClick={() => handleFilterChange('lowStock')}
            >
              Bajo stock
            </Button>
            <Button
              variant={filters.stock === 'outOfStock' ? "default" : "ghost"}
              className="whitespace-nowrap"
              onClick={() => handleFilterChange('outOfStock')}
            >
              Sin stock
            </Button>
            <Button
              variant={filters.enOferta ? "default" : "ghost"}
              className="whitespace-nowrap"
              onClick={() => handleFilterChange('onSale')}
            >
              En oferta
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <ProductList
          products={products}
          isLoading={isLoading}
          error={error}
          onDelete={handleDelete}
          onEdit={handleEdit}
          isAdminView
        />
      </div>

      <Dialog
        open={isFormOpen}
        onOpenChange={(open) => {
          setIsFormOpen(open);
          if (!open) setEditingProduct(null);
        }}
      >
          <DialogContent className="w-[95vw] max-w-4xl max-h-[90vh] overflow-y-auto">
    <DialogHeader>
      <DialogTitle>
        {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
      </DialogTitle>
      <DialogDescription>
        {editingProduct 
          ? 'Actualiza los detalles del producto.' 
          : 'Añade un nuevo producto al catálogo.'}
      </DialogDescription>
    </DialogHeader>
    <div className="mt-4">
      <AddProductForm
        initialData={editingProduct}
        onSubmit={handleSubmit}
        
      />
    </div>
  </DialogContent>
      </Dialog>
    </div>
  );
}
'use client';

import { AddProductForm } from '@/components/product/AddProductForm';
import { ProductList } from '@/components/product/ProductList';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useDebounce } from '@/hooks/useDebounce';
import { useProducts } from '@/hooks/useProducts';
import { Product, ProductFilters, ProductFormData } from '@/types';
import { Plus, Search } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function AdminProductsPage() {
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<ProductFilters>({
    limit: 12,
    page: 1
  });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const debouncedSearch = useDebounce(search, 500);
  const {
    products,
    isLoading,
    error,
    totalCount,
    mutations,
    pagination,
    refresh
  } = useProducts({
    ...filters,
    search: debouncedSearch
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
      if (editingProduct) {
        await mutations.update.mutateAsync({ id: editingProduct._id, data });
      } else {
        await mutations.create.mutateAsync(data);
      }
      setIsFormOpen(false);
      setEditingProduct(null);
      await refresh(); // Usar refresh después de operaciones exitosas
    } catch (error) {
      toast.error('Error al guardar el producto');
      console.error('Error:', error);
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
    <div className="min-h-screen bg-gray-50">
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
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Buscar productos..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 pr-4 w-full md:w-[300px]"
                />
              </div>
              
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
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
            </DialogTitle>
          </DialogHeader>
          <AddProductForm
            initialData={editingProduct}
            onSubmit={handleSubmit}
           /*  isSubmitting={isSubmitting} */
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
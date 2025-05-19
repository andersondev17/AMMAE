'use client';

import { AddProductForm } from '@/components/admin/AddProductForm';
import { ProductList } from '@/components/product/ProductList';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/form/input';
import { FILTERS } from '@/constants';
import { useProducts } from '@/hooks/product/useProducts';
import { useDebounce } from '@/hooks/useDebounce';
import { Product, ProductFormData } from '@/types';
import { Plus, Search } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function AdminProductsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const filter = searchParams.get('filter');
  const editId = searchParams.get('edit');
  const isNew = searchParams.get('new') === 'true';

  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');
  const debouncedSearch = useDebounce(searchInput, 500);

  const { products, isLoading, totalCount, mutations } = useProducts({
    search: debouncedSearch,
    stock: filter as any,
    enOferta: filter === 'onSale',
    fields: '',
    limit: 12
  });

  // Sincronizar búsqueda con URL
  useEffect(() => {
    updateUrl({ search: debouncedSearch || null });
  }, [debouncedSearch]);

  const updateUrl = (params: Record<string, string | null>) => {
    const urlParams = new URLSearchParams(searchParams);
    Object.entries(params).forEach(([key, value]) =>
      value ? urlParams.set(key, value) : urlParams.delete(key)
    );
    router.push(`?${urlParams}`, { scroll: false });
  };

  // Encontrar el producto a editar
  const productToEdit = editId 
    ? products.find((p: Product) => p._id === editId) || null
    : null;

  // Handlers
  const handleFilterChange = (filterId: string | null) =>
    updateUrl({ filter: filterId, page: '1' });

  const handleEdit = (productId: string) =>
    updateUrl({ edit: productId });

  const handleNewProduct = () =>
    updateUrl({ new: 'true' });

  const handleCloseModal = () =>
    updateUrl({ edit: null, new: null });

  const handleSaveProduct = async (data: ProductFormData) => {
    try {
      if (editId) {
        await mutations.update.mutateAsync({ id: editId, data });
        toast.success("Producto actualizado");
      } else {
        await mutations.create.mutateAsync(data);
      }
      handleCloseModal();
    } catch (error: any) {
      toast.error(error.message || "Error al guardar");
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("¿Eliminar este producto?")) return;

    try {
      await mutations.delete.mutateAsync(id);
      toast.success("Producto eliminado");
    } catch {
      toast.error("Error al eliminar");
    }
  };

  return (
    <div className="space-y-6">
      {/* Cabecera */}
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-3xl font-medium tracking-tight">
            {FILTERS.find(f => f.id === filter)?.label || 'Todos los productos'}
          </h1>
          <p className="text-sm text-gray-500 mt-1">{totalCount} productos</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar productos..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-10"
            />
          </div>

          <Button onClick={handleNewProduct} className="gap-2">
            <Plus className="h-4 w-4" />
            <span>Nuevo Producto</span>
          </Button>
        </div>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2">
        {FILTERS.map(({ id, label }) => (
          <Button
            key={id || 'all'}
            variant={filter === id ? "default" : "ghost"}
            className="whitespace-nowrap"
            onClick={() => handleFilterChange(id)}
          >
            {label}
          </Button>
        ))}
      </div>

      <ProductList
        products={products}
        isLoading={isLoading}
        error={null}
        onDelete={handleDeleteProduct}
        onEdit={(product) => handleEdit(product._id)}
        isAdminView
      />

      <Dialog
        open={isNew || !!editId}
        onOpenChange={(open) => !open && handleCloseModal()}
      >
        <DialogContent className="w-[95vw] max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editId ? 'Editar Producto' : 'Nuevo Producto'}
            </DialogTitle>
          </DialogHeader>
          <AddProductForm
            initialData={productToEdit}
            onSubmit={handleSaveProduct}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
// components/admin/products/ProductsManagementPage.tsx
'use client';

import { AddProductForm } from "@/components/admin/AddProductForm";
import { ProductTable } from "@/components/admin/ProductTable";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/form/input";
import { Heading } from "@/components/ui/heading";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useDebounce } from "@/hooks/useDebounce";
import { Product, ProductFilters, ProductFormData } from "@/types";
import { Filter, Plus, RefreshCcw, Search } from "lucide-react";
import React, { useState } from "react";

export default function ProductsManagementPage() {
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 500);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [filters, setFilters] = useState<ProductFilters>({
        page: 1,
        limit: 10,
        search: "",
        sortBy: "-createdAt",
        fields: ""
    });
    const [editingProduct, setEditingProduct] = useState<Product | null>(null); // Corregimos el tipo

    // Función para actualizar filtros
    const updateFilters = (newFilters: Partial<ProductFilters>) => {
        setFilters(prev => ({ ...prev, ...newFilters }));
    };

    // Actualizar búsqueda con debounce
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        // Actualizamos cuando cambia el valor debounced
    };
    
    // Efecto para actualizar los filtros cuando cambia la búsqueda debounced
    React.useEffect(() => {
        if (debouncedSearch !== filters.search) {
            updateFilters({ search: debouncedSearch, page: 1 });
        }
    }, [debouncedSearch, filters.search]);

    // Función para manejar la adición o edición de productos
    const handleSaveProduct = async (data: ProductFormData) => {
        try {
            if (editingProduct) {
                console.log("Actualizando producto:", data);
            } else {
                console.log("Creando producto:", data);
            }
            
            setIsFormOpen(false);
            setEditingProduct(null);
        } catch (error) {
            console.error("Error al guardar producto:", error);
            // toast.error("Ha ocurrido un error al guardar el producto");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <Heading
                    title="Productos"
                    description="Gestiona los productos de tu tienda"
                />
                <Button onClick={() => setIsFormOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" /> Nuevo producto
                </Button>
            </div>

            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex w-full max-w-lg items-center space-x-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Buscar productos..."
                            value={search}
                            onChange={handleSearchChange}
                            className="pl-10"
                        />
                    </div>
                    <Button variant="outline" size="icon" onClick={() => updateFilters({ page: 1 })}>
                        <RefreshCcw className="h-4 w-4" />
                    </Button>
                </div>

                <div className="flex items-center gap-2">
                    <Select
                        value={filters.sortBy || "-createdAt"}
                        onValueChange={(value) => updateFilters({ sortBy: value })}
                    >
                        <SelectTrigger className="h-10 w-[180px]">
                            <SelectValue placeholder="Ordenar por" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="-createdAt">Más recientes</SelectItem>
                            <SelectItem value="createdAt">Más antiguos</SelectItem>
                            <SelectItem value="-precio">Precio: Mayor a menor</SelectItem>
                            <SelectItem value="precio">Precio: Menor a mayor</SelectItem>
                            <SelectItem value="-stock">Stock: Mayor a menor</SelectItem>
                            <SelectItem value="stock">Stock: Menor a mayor</SelectItem>
                        </SelectContent>
                    </Select>

                    <Button variant="outline" size="sm" aria-label="Filtros" onClick={() => setIsFormOpen(true)}>
                        <Filter className="mr-2 h-4 w-4" />
                        Filtros
                    </Button>
                </div>
            </div>

            <div className="rounded-md border overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead style={{ width: 50 }}>Imagen</TableHead>
                            <TableHead>Producto</TableHead>
                            <TableHead>Precio</TableHead>
                            <TableHead>Stock</TableHead>
                            <TableHead>Tallas</TableHead>
                            <TableHead style={{ width: 50 }}></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <ProductTable
                            filters={filters}
                            onEdit={(product) => {
                                setEditingProduct(product);
                                setIsFormOpen(true);
                            }}
                            onDelete={async (id) => {
                                // Aquí manejar la eliminación
                                if (window.confirm("¿Estás seguro de eliminar este producto?")) {
                                    try {
                                        console.log("Eliminando producto", id);
                                        // await productService.deleteProduct(id);
                                        // toast.success("Producto eliminado con éxito");
                                        // refresh();
                                    } catch (error) {
                                        console.error("Error al eliminar producto:", error);
                                        // toast.error("Ha ocurrido un error al eliminar el producto");
                                    }
                                }
                            }}
                            onView={(id) => {
                                window.open(`/product/${id}`, '_blank');
                            }}
                        />
                    </TableBody>
                </Table>
            </div>

            {/* Modal para añadir/editar producto */}
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
                    </DialogHeader>
                    <AddProductForm
                        initialData={editingProduct}
                        onSubmit={handleSaveProduct}
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
}
// components/product/ProductTable.tsx
'use client';

import { useProducts } from "@/hooks/product/useProducts";
import { Product, ProductFilters } from "@/types";
import { Copy, Edit2, Eye, MoreHorizontal, Plus, Trash } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, } from "../ui/dropdown-menu";
import { Skeleton } from "../ui/skeleton";
import { TableCell, TableRow } from "../ui/table";

interface ProductTableProps {
    onEdit: (product: Product) => void;
    onDelete: (id: string) => void;
    onView?: (id: string) => void;
    onDuplicate?: (product: Product) => void;
    filters: ProductFilters;
}

export function ProductTable({ onEdit, onDelete, onView, onDuplicate, filters }: ProductTableProps) {
    const { products, isLoading, error, totalCount } = useProducts(filters);
    const [deleting, setDeleting] = useState<string | null>(null);

    const handleDelete = async (id: string) => {
        if (confirm('¿Estás seguro de eliminar este producto?')) {
            setDeleting(id);
            try {
                await onDelete(id);
            } finally {
                setDeleting(null);
            }
        }
    };

    if (isLoading) {
        return Array(5).fill(0).map((_, i) => (
            <TableRow key={i}>
                <TableCell><Skeleton className="h-6 w-6 rounded-full" /></TableCell>
                <TableCell><Skeleton className="h-4 w-[250px]" /></TableCell>
                <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                <TableCell><Skeleton className="h-8 w-8" /></TableCell>
            </TableRow>
        ));
    }

    if (error) {
        return (
            <TableRow>
                <TableCell colSpan={6} className="text-center py-4 text-red-500">
                    Error al cargar productos: {error.message}
                </TableCell>
            </TableRow>
        );
    }

    if (!products.length) {
        return (
            <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    <div className="flex flex-col items-center gap-2">
                        <p>No se encontraron productos</p>
                        <Button size="sm" variant="outline" onClick={() => { }}>
                            <Plus className="mr-2 h-4 w-4" /> Agregar producto
                        </Button>
                    </div>
                </TableCell>
            </TableRow>
        );
    }

    return (
        <>
            {products.map((product: Product) => (
                <TableRow key={product._id} className={deleting === product._id ? "opacity-50" : ""}>
                    <TableCell>
                        <div className="w-10 h-10 rounded-md bg-gray-100 overflow-hidden relative">
                            {product.imagenes?.[0] && (
                                <img
                                    src={product.imagenes[0].startsWith('http') ? product.imagenes[0] : `/assets/images/demo/${product.imagenes[0]}`}
                                    alt={product.nombre}
                                    className="w-full h-full object-cover"
                                />
                            )}
                        </div>
                    </TableCell>
                    <TableCell>
                        <div>
                            <div className="font-medium">{product.nombre}</div>
                            <div className="text-sm text-gray-500">{product.categoria}</div>
                        </div>
                    </TableCell>
                    <TableCell>${product.precio.toFixed(2)}</TableCell>
                    <TableCell>{product.stock}</TableCell>
                    <TableCell>
                        <div className="flex flex-wrap gap-1">
                            {product.tallas.slice(0, 3).map(talla => (
                                <span key={talla} className="px-1.5 py-0.5 bg-gray-100 rounded text-xs">{talla}</span>
                            ))}
                            {product.tallas.length > 3 && (
                                <span className="px-1.5 py-0.5 bg-gray-100 rounded text-xs">+{product.tallas.length - 3}</span>
                            )}
                        </div>
                    </TableCell>
                    <TableCell>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" disabled={deleting === product._id}>
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => onEdit(product)}>
                                    <Edit2 className="mr-2 h-4 w-4" /> Editar
                                </DropdownMenuItem>
                                {onView && (
                                    <DropdownMenuItem onClick={() => onView(product._id)}>
                                        <Eye className="mr-2 h-4 w-4" /> Ver detalles
                                    </DropdownMenuItem>
                                )}
                                {onDuplicate && (
                                    <DropdownMenuItem onClick={() => onDuplicate(product)}>
                                        <Copy className="mr-2 h-4 w-4" /> Duplicar
                                    </DropdownMenuItem>
                                )}
                                <DropdownMenuItem
                                    onClick={() => handleDelete(product._id)}
                                    className="text-red-600 focus:text-red-600"
                                >
                                    <Trash className="mr-2 h-4 w-4" /> Eliminar
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
                </TableRow>
            ))}
        </>
    );
}
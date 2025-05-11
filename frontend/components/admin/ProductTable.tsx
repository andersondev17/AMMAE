// components/admin/ProductTable.tsx
'use client';

import { useProducts } from "@/hooks/product/useProducts";
import { Product, ProductFilters } from "@/types";
import { getProductImages } from "@/utils/demoImages";
import { Copy, Edit2, Eye, MoreHorizontal, Trash } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Skeleton } from "../ui/skeleton";
import { TableCell, TableRow } from "../ui/table";

interface ProductTableProps {
  onEdit: (product: Product) => void;
  onDelete: (id: string) => Promise<void>;
  onView?: (id: string) => void;
  onDuplicate?: (product: Product) => void;
  filters: ProductFilters;
}

export function ProductTable({ onEdit, onDelete, onView, onDuplicate, filters }: ProductTableProps) {
  const { products, isLoading, error } = useProducts(filters);
  const [deleting, setDeleting] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setDeleting(id);
    try {
      await onDelete(id);
    } finally {
      setDeleting(null);
    }
  };

  if (isLoading) {
    // Esqueletos para carga
    return Array(5).fill(0).map((_, i) => (
      <TableRow key={`skeleton-${i}`}>
        <TableCell>
          <Skeleton className="h-10 w-10 rounded-md" />
        </TableCell>
        <TableCell>
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-3 w-[150px]" />
          </div>
        </TableCell>
        <TableCell><Skeleton className="h-4 w-16" /></TableCell>
        <TableCell><Skeleton className="h-4 w-16" /></TableCell>
        <TableCell><Skeleton className="h-4 w-20" /></TableCell>
        <TableCell><Skeleton className="h-8 w-8 rounded-full" /></TableCell>
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

  if (!products?.length) {
    return (
      <TableRow>
        <TableCell colSpan={6} className="text-center py-8 text-gray-500">
          <div className="flex flex-col items-center gap-2">
            <p>No se encontraron productos</p>
          </div>
        </TableCell>
      </TableRow>
    );
  }

  return (
    <>
      {products.map((product: Product) => {
        const { primary: imageUrl } = getProductImages(product);
        const isDeleting = deleting === product._id;

        return (
          <TableRow key={product._id} className={isDeleting ? "opacity-50" : ""}>
            <TableCell>
            <div className="w-10 h-10 rounded-md bg-gray-100 overflow-hidden relative">
            <img
                  src={imageUrl}
                  alt={product.nombre}
                  className="w-full h-full object-cover"
                />
              </div>
            </TableCell>
            <TableCell>
              <div>
                <div className="font-medium">{product.nombre}</div>
                <div className="text-xs text-gray-500">{product.categoria}</div>
              </div>
            </TableCell>
            <TableCell>${product.precio.toFixed(2)}</TableCell>
            <TableCell className={product.stock <= 0 ? "text-red-500" : product.stock <= 5 ? "text-amber-500" : ""}>
              {product.stock}
            </TableCell>
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
                  <Button variant="ghost" size="icon" disabled={isDeleting}>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[160px]">
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
                  <DropdownMenuSeparator />
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
        );
      })}
    </>
  );
}
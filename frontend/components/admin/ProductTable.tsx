'use client';

import { Product } from '@/types';
import { getProductImages } from '@/utils/imageUtils';
import { calculateProductPrice } from '@/utils/price';
import { Edit2, MoreHorizontal, Trash } from 'lucide-react';
import { useCallback, useState } from 'react';
import { ProductTableSkeleton } from '../skeletons/ProductSkeleton';
import { Button } from '../ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';

interface ProductTableProps {
  products: Product[];
  isLoading: boolean;
  error?: Error | null;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => Promise<void>;
}

const getStockStatus = (stock: number) => ({
  color: stock <= 0 ? "text-red-500" : stock <= 5 ? "text-amber-500" : "",
  badge: stock <= 0 ? "Sin stock" : stock <= 5 ? "Bajo" : "OK"
});

function ProductRow({ product, onEdit, onDelete, isDeleting }: {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => Promise<void>;
  isDeleting: boolean;
}) {
  const stockStatus = getStockStatus(product.stock);
  
  const { primary } = getProductImages(product);
  const priceInfo = calculateProductPrice(product);

  return (
    <TableRow className={isDeleting ? "opacity-50" : ""}>
      <TableCell>
        <div className="w-10 h-10 rounded bg-gray-100 overflow-hidden">
          <img
            src={primary}
            alt={product.nombre}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      </TableCell>

      <TableCell>
        <div className="font-medium truncate max-w-[200px]">{product.nombre}</div>
        <div className="text-xs text-gray-500">{product.categoria}</div>
      </TableCell>

      <TableCell className="font-mono">
        {priceInfo.formatted.final}
        {priceInfo.isOnSale && (
          <div className="text-xs text-green-600">
            Oferta: {priceInfo.formatted.original}
          </div>
        )}
      </TableCell>

      <TableCell>
        <span className={`font-medium ${stockStatus.color}`}>
          {product.stock}
        </span>
        <div className={`text-xs ${stockStatus.color}`}>
          {stockStatus.badge}
        </div>
      </TableCell>

      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              disabled={isDeleting}
              aria-label={`Acciones para ${product.nombre}`}
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(product)}>
              <Edit2 className="mr-2 h-4 w-4" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete(product._id)}
              className="text-red-600 focus:text-red-600"
            >
              <Trash className="mr-2 h-4 w-4" />
              Eliminar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}

export function ProductTable({ products, isLoading, error, onEdit, onDelete }: ProductTableProps) {
  const [deleting, setDeleting] = useState<string | null>(null);

  const handleDelete = useCallback(async (id: string) => {
    setDeleting(id);
    try {
      await onDelete(id);
    } finally {
      setDeleting(null);
    }
  }, [onDelete]);

  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">Imagen</TableHead>
            <TableHead>Producto</TableHead>
            <TableHead className="w-24">Precio</TableHead>
            <TableHead className="w-20">Stock</TableHead>
            <TableHead className="w-16">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading && <ProductTableSkeleton />}

          {error && (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-red-500">
                Error: {error.message}
              </TableCell>
            </TableRow>
          )}

          {!isLoading && !error && products.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                No se encontraron productos
                <div className="text-sm mt-2">
                  Prueba ajustando los filtros o creando un nuevo producto
                </div>
              </TableCell>
            </TableRow>
          )}

          {!isLoading && !error && products.map(product => (
            <ProductRow
              key={product._id}
              product={product}
              onEdit={onEdit}
              onDelete={handleDelete}
              isDeleting={deleting === product._id}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
'use client';

import { Product, ProductListProps } from '@/types';
import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { ProductSkeleton } from '../skeletons/ProductSkeleton';
import { ProductCard } from './ProductCard';

export const ProductList: React.FC<ProductListProps> = ({
  products = [],
  isLoading,
  error,
  onEdit,
  onDelete,
  isAdminView = false
}) => {
  const [sortBy, setSortBy] = useState('');
  const [search, setSearch] = useState('');

  // Memoizamos el agrupamiento de productos
  const groupedProducts = useMemo(() => {
    return products.reduce((acc, product) => {
      // Usamos una key más única combinando nombre y ID
      const modelKey = `${product.nombre.split(' ')[0]}-${product.categoria}`;
      if (!acc[modelKey]) acc[modelKey] = [];
      acc[modelKey].push(product);
      return acc;
    }, {} as Record<string, Product[]>);
  }, [products]);

  if (isLoading) return <ProductSkeleton />;
  if (error) return <div className="text-center text-red-500">Error: {error.message}</div>;
  if (!products?.length) return <div className="text-center">No se encontraron productos.</div>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-2"
    >
      {!isAdminView && (
        <div className="mb-6 space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <input
                type="text"
                placeholder="Buscar productos..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="px-4 py-2 border rounded-md"
              />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border rounded-md"
              >
                <option value="">Ordenar por</option>
                <option value="precio">Precio: Menor a Mayor</option>
                <option value="-precio">Precio: Mayor a Menor</option>
                <option value="-createdAt">Más recientes</option>
              </select>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-8">
        {Object.entries(groupedProducts).map(([modelKey, modelProducts]) => {
          const modelName = modelKey.split('-')[0]; // Extraemos el nombre del modelo
          return (
            <div key={modelKey} className="space-y-4">
              <h3 className="text-xl font-semibold">{modelName}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {modelProducts.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    isAdminView={isAdminView}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};
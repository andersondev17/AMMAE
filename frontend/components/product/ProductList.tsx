import { Product, ProductListProps } from '@/types';
import { motion } from 'framer-motion';
import { useMemo } from 'react';
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
  // Memoizamos el agrupamiento de productos solo si es vista de admin
  const groupedProducts = useMemo(() => {
    if (!isAdminView) return null;
    
    return products.reduce((acc, product) => {
      const modelKey = `${product.nombre.split(' ')[0]}-${product.categoria}`;
      if (!acc[modelKey]) acc[modelKey] = [];
      acc[modelKey].push(product);
      return acc;
    }, {} as Record<string, Product[]>);
  }, [products, isAdminView]);

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
      {isAdminView ? (
        // Vista de administrador: Productos agrupados por categoría
        <div className="grid gap-8">
          {Object.entries(groupedProducts || {}).map(([modelKey, modelProducts]) => {
            const modelName = modelKey.split('-')[0];
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
                      isAdminView={true}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        // Vista de usuario: Todos los productos en cuadrícula
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ProductCard
                product={product}
                isAdminView={false}
              />
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

ProductList.displayName = 'ProductList';
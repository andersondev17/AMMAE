// components/product/ProductList.tsx
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
  // Memoizamos procesamiento de productos para evitar cálculos innecesarios
  const processedData = useMemo(() => {
    // Para vista de admin, agrupar por modelo/categoría
    if (isAdminView) {
      return products.reduce((acc, product) => {
        const modelKey = product.categoria;
        if (!acc[modelKey]) acc[modelKey] = [];
        acc[modelKey].push(product);
        return acc;
      }, {} as Record<string, Product[]>);
    }
    
    // Para vista de cliente, dejar como lista plana
    return { products };
  }, [products, isAdminView]);

  if (isLoading) return <ProductSkeleton count={8} />;
  
  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">{error.message}</p>
        <button className="px-4 py-2 bg-black text-white hover:bg-gray-900 transition-colors" onClick={() => window.location.reload()}>
          Reintentar
        </button>
      </div>
    );
  }
  
  if (!products?.length) {
    return (
      <div className="text-center py-16 bg-gray-50">
        <p className="text-gray-500 mb-4">No se encontraron productos.</p>
        {isAdminView && (
          <button className="px-4 py-2 bg-black text-white hover:bg-gray-900 transition-colors">
            Crear nuevo producto
          </button>
        )}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      {isAdminView ? (
        // Vista de administrador: Productos agrupados por categoría
        <div className="space-y-12">
          {Object.entries(processedData as Record<string, Product[]>).map(([category, items]) => (
            <div key={category} className="space-y-4">
              <h2 className="text-xl font-medium pb-2 border-b">
                {category} <span className="text-gray-500 text-sm font-normal">({items.length})</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-0 border-l border-t">
                {items.map((product) => (
                  <div key={product._id} className="border-r border-b">
                    <ProductCard
                      product={product}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      isAdminView={true}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        // Vista de usuario: Cuadrícula simple
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-0 border-l border-t">
          {products.map((product) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="border-r border-b"
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
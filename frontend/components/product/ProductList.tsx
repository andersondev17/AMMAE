// components/product/ProductList.tsx - DISEÑO OPTIMIZADO
import { ProductListProps } from '@/types';
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
  if (isLoading) return <ProductSkeleton count={8} />;

  if (error) return (
    <div className="text-center py-12">
      <p className="text-red-500 mb-4">{error.message}</p>
      <button 
        className="px-4 py-2 bg-black text-white hover:bg-gray-900 transition-colors" 
        onClick={() => window.location.reload()}
      >
        Reintentar
      </button>
    </div>
  );

  if (!products?.length) return (
    <div className="text-center py-16">
      <p className="text-gray-500 mb-4">No se encontraron productos.</p>
      {isAdminView && (
        <button className="px-4 py-2 bg-black text-white hover:bg-gray-900 transition-colors">
          Crear nuevo producto
        </button>
      )}
    </div>
  );

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-1 bg-gray-100">
      {products.map((product) => (
        <div key={product._id} className="bg-white">
          <ProductCard
            product={product}
            onEdit={onEdit}
            onDelete={onDelete}
            isAdminView={isAdminView}
          />
        </div>
      ))}
    </div>
  );
};
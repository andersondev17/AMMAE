'use client';

import { motion } from 'framer-motion';
import React, { useMemo, useState } from 'react';
import { useProducts } from '../../hooks/useProducts';
import { CategoryNav } from '../Layout/CategoryNav';
import { Pagination } from '../ui/Pagination';
import { Spinner } from '../ui/Spinner';
import { ProductCard } from './ProductCard';

export const ProductList: React.FC = () => {
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState('');
  const limit = 12;
  const { data, isLoading, error } = useProducts(page, limit, sortBy);

  const groupedProducts = useMemo(() => {
    if (!data) return {};
    return data.data.reduce((acc, product) => {
      const model = product.nombre.split(' ')[0];
      if (!acc[model]) acc[model] = [];
      acc[model].push(product);
      return acc;
    }, {} as Record<string, typeof data.data>);
  }, [data]);

  if (isLoading) return <Spinner />;
  if (error) return <div className="text-center text-red-500">An error occurred: {(error as Error).message}</div>;
  if (!data) return <div className="text-center">No data received from the server.</div>;
  if (data.data.length === 0) return <div className="text-center">No products found.</div>;

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
    setPage(1);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4"
    >
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">All Products — Women</h2>
        <div className="flex items-center">
          <label htmlFor="sortBy" className="mr-2 text-sm text-gray-600">Sort by:</label>
          <select
            id="sortBy"
            value={sortBy}
            onChange={handleSortChange}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Default</option>
            <option value="-createdAt">Newest</option>
            <option value="precio">Price: Low to High</option>
            <option value="-precio">Price: High to Low</option>
            <option value="enOferta">On Sale</option>
          </select>
        </div>
      </div>
      <CategoryNav />
      {Object.entries(groupedProducts).map(([model, products]) => (
        <div key={model} className="mb-8">
          <h3 className="text-xl font-semibold mb-4">{model}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 border-l border-t border-gray-200">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      ))}
      <div className="mt-12">
        <Pagination
          currentPage={page}
          totalPages={Math.ceil(data.count / limit)}
          onPageChange={setPage}
        />
      </div>
    </motion.div>
  );
};
'use client';

import React from 'react';
import { useProducts } from '../../hooks/useProducts';
import { Pagination } from '../ui/Pagination';
import { Spinner } from '../ui/Spinner';
import { ProductCard } from './ProductCard';

export const ProductList: React.FC = () => {
  const [page, setPage] = React.useState(1);
  const limit = 12;
  const { data, isLoading, error } = useProducts(page, limit);

  if (isLoading) return <Spinner />;
  if (error) return <div>An error occurred: {(error as Error).message}</div>;
  if (!data) return <div>No data received from the server.</div>;
  if (data.data.length === 0) return <div>No products found.</div>;

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {data.data.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
      <Pagination
        currentPage={page}
        totalPages={Math.ceil(data.count / limit)}
        onPageChange={setPage}
      />
    </div>
  );
};
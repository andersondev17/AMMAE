import { useQuery } from '@tanstack/react-query';
import { getProducts } from '../services/productService';
import { Product } from '../types';

interface ProductsResponse {
    data: Product[];
    count: number;
}

export const useProducts = (page: number, limit: number) => {
    return useQuery<ProductsResponse, Error>({
        queryKey: ['products', page, limit],
        queryFn: () => getProducts(page, limit),
        staleTime: 5 * 60 * 1000, // 5 minutes
        placeholderData: (previousData) => previousData, // This replaces keepPreviousData
    });
};
import { getProducts } from '@/services/productService';
import { Product, ProductFilters, ProductFormData } from '@/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

interface ProductsResponse {
    data: Product[];
    count: number;
}

interface MutationResponse {
    success: boolean;
    data: Product;
}

export function useProducts(filters: Partial<ProductFilters> = {}) {
    const queryClient = useQueryClient();

    // Query principal
    const {
        data,
        isLoading,
        error,
        refetch
    } = useQuery<ProductsResponse, Error>({
        queryKey: ['products', filters],
        queryFn: () => getProducts(
            filters.page || 1,
            filters.limit || 12,
            filters.sortBy || '',
            filters.categoria || '',
            filters.search || ''
        ),
        staleTime: 5 * 60 * 1000,
        placeholderData: (previousData) => previousData,
    });

    // Mutations
    const mutations = {
        create: useMutation({
            mutationFn: async (formData: ProductFormData) => {
                const response = await axios.post<MutationResponse>(
                    `${API_URL}/productos`,
                    formData
                );
                return response.data;
            },
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['products'] });
                toast.success('Producto creado exitosamente');
            },
            onError: (error: Error) => {
                toast.error('Error al crear el producto');
                console.error('Error:', error);
            }
        }),

        update: useMutation({
            mutationFn: async ({ id, data }: { id: string; data: ProductFormData }) => {
                const response = await axios.put<MutationResponse>(
                    `${API_URL}/productos/${id}`,
                    data
                );
                return response.data;
            },
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['products'] });
                toast.success('Producto actualizado exitosamente');
            },
            onError: (error: Error) => {
                toast.error('Error al actualizar el producto');
                console.error('Error:', error);
            }
        }),

        delete: useMutation({
            mutationFn: async (id: string) => {
                const response = await axios.delete(`${API_URL}/productos/${id}`);
                return response.data;
            },
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['products'] });
                toast.success('Producto eliminado exitosamente');
            },
            onError: (error: Error) => {
                toast.error('Error al eliminar el producto');
                console.error('Error:', error);
            }
        })
    };

    return {
        products: data?.data || [],
        isLoading,
        error: error as Error | null,
        totalCount: data?.count || 0,
        pagination: {
            currentPage: filters.page || 1,
            totalPages: Math.ceil((data?.count || 0) / (filters.limit || 12))
        },
        mutations,
        refresh: refetch
    };
}
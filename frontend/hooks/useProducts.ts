// hooks/useProducts.ts
import { getProducts, productService } from '@/services/productService';
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

// Constantes para los umbrales de stock
const STOCK_THRESHOLDS = {
    LOW_STOCK: 5,
    OUT_OF_STOCK: 0
} as const;

export function useProducts(filters: Partial<ProductFilters> = {}) {
    const queryClient = useQueryClient();

    // Función auxiliar para transformar los filtros de stock
    const transformStockFilter = (stockFilter?: string) => {
        switch (stockFilter) {
            case 'inStock':
                return { stock: { $gt: STOCK_THRESHOLDS.LOW_STOCK } };
            case 'lowStock':
                return { 
                    stock: { 
                        $gt: STOCK_THRESHOLDS.OUT_OF_STOCK, 
                        $lte: STOCK_THRESHOLDS.LOW_STOCK 
                    } 
                };
            case 'outOfStock':
                return { stock: STOCK_THRESHOLDS.OUT_OF_STOCK };
            default:
                return {};
        }
    };

    // Query principal mejorada para manejar los nuevos filtros
    const {
        data,
        isLoading,
        error,
        refetch
    } = useQuery({
        queryKey: ['products', filters],
        queryFn: async () => {
            const queryParams = new URLSearchParams();

            // Filtros base existentes
            if (filters.page) queryParams.append('page', filters.page.toString());
            if (filters.limit) queryParams.append('limit', filters.limit.toString());
            if (filters.sortBy) queryParams.append('sort', filters.sortBy);
            if (filters.categoria) queryParams.append('categoria', filters.categoria);
            if (filters.search) queryParams.append('search', filters.search);

            // Nuevos filtros
            if (filters.stock) {
                queryParams.append('stock', filters.stock);
            }
            if (filters.enOferta) {
                queryParams.append('enOferta', 'true');
            }

            return await getProducts(
                filters.page || 1,
                filters.limit || 12,
                filters.sortBy || '',
                filters.categoria ?? '',
                filters.search || '',
                queryParams.toString()
            );
        },
        staleTime: 5 * 60 * 1000,
        placeholderData: (previousData) => previousData,
    });

    // Mutations existentes se mantienen igual
    const mutations = {
        create: useMutation({
            mutationFn: async (formData: ProductFormData) => {
                try {
                    console.log('Enviando datos al servidor - Iniciando mutación:', formData);
                    const response = await productService.createProduct(formData);
                    return response;
                } catch (error) {
                    console.error('Error en create mutation:', error);
                    throw error;
                }
            },
            onSuccess: (data) => {
                queryClient.invalidateQueries({ queryKey: ['products'] });
                toast.success('Producto creado exitosamente');
            },
            onError: (error: any) => {
                const errorMessage = error?.response?.data?.message || 'Error al crear el producto';
                toast.error(errorMessage);
                console.error('useProducts - Error en onError:', error);
            }
        }),
        update: useMutation({
            mutationFn: async ({ id, data }: { id: string; data: ProductFormData }) => {
                try {
                    console.log('useProducts - Iniciando mutación update:', { id, data });
                    const response = await productService.updateProduct(id, data);
                    return response;
                } catch (error) {
                    console.error('Error en update mutation:', error);
                    throw error;
                }
            },
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['products'] });
                toast.success('Producto actualizado exitosamente');
            },
            onError: (error: any) => {
                const errorMessage = error?.response?.data?.message || 'Error al actualizar el producto';
                toast.error(errorMessage);
                console.error('useProducts - Error en onError:', error);
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
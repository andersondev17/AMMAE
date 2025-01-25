// hooks/useProducts.ts
import { productService } from '@/services/productService';
import { ProductFilters, ProductFormData } from '@/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

// Constantes centralizadas
const STOCK_THRESHOLDS = {
    LOW_STOCK: 5,
    OUT_OF_STOCK: 0,
    CACHE_TIME: 5 * 60 * 1000,
    DEFAULT_PAGE_SIZE: 12
} as const;

// Helper para construir parámetros de consulta
const buildQueryParams = (filters: Partial<ProductFilters>) => ({
    page: filters.page || 1,
    limit: filters.limit || STOCK_THRESHOLDS.DEFAULT_PAGE_SIZE,
    sortBy: filters.sortBy || '-createdAt',
    categoria: filters.categoria || '',
    search: filters.search || '',
    stock: filters.stock,
    enOferta: filters.enOferta
});

export function useProducts(filters: Partial<ProductFilters> = {}) {
    const queryClient = useQueryClient();

    // Query principal
    const {
        data,
        isLoading,
        error,
        refetch
    } = useQuery({
        queryKey: ['products', filters],
        queryFn: async () => {
            return await productService.getProducts(buildQueryParams(filters));
        },
        staleTime: STOCK_THRESHOLDS.CACHE_TIME,
        refetchOnWindowFocus: true,
    });

    // Handler genérico para errores
    const handleMutationError = (error: any, defaultMessage: string) => {
        const errorMessage = error?.response?.data?.message || defaultMessage;
        toast.error(errorMessage);
        console.error('useProducts - Error:', error);
    };

    // Mutaciones CRUD optimizadas
    const mutations = {
        create: useMutation({
            mutationFn: (formData: ProductFormData) => {
                console.log('Iniciando creación de producto:', formData);
                return productService.createProduct(formData);
            },
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['products'] });
                toast.success('Producto creado exitosamente');
            },
            onError: (error: any) => handleMutationError(error, 'Error al crear el producto')
        }),

        update: useMutation({
            mutationFn: ({ id, data }: { id: string; data: ProductFormData }) => {
                console.log('Iniciando actualización de producto:', { id, data });
                return productService.updateProduct(id, data);
            },
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['products'] });
                toast.success('Producto actualizado exitosamente');
            },
            onError: (error: any) => handleMutationError(error, 'Error al actualizar el producto')
        }),

        delete: useMutation({
            mutationFn: (id: string) => {
                return productService.deleteProduct(id);
            },
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['products'] });
                toast.success('Producto eliminado exitosamente');
            },
            onError: (error: any) => handleMutationError(error, 'Error al eliminar el producto')
        })
    };

    return {
        products: data?.data || [],
        isLoading,
        error: error as Error | null,
        totalCount: data?.count || 0,
        pagination: {
            currentPage: filters.page || 1,
            totalPages: Math.ceil((data?.count || 0) / (filters.limit || STOCK_THRESHOLDS.DEFAULT_PAGE_SIZE))
        },
        mutations,
        refresh: refetch
    };
}
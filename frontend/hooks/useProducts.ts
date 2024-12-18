// hooks/useProducts.ts


/* Las operaciones CRUD se realizan a través de las mutaciones proporcionadas por el hook useProducts, 
que internamente utiliza react-query para la gestión del estado del servidor. */

// hooks/useProducts.ts
import { getProducts, productService } from '@/services/productService';
import { ProductFilters, ProductFormData } from '@/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

// Definición de constantes
const STOCK_THRESHOLDS = {
    LOW_STOCK: 5,
    OUT_OF_STOCK: 0,
    CACHE_TIME: 5 * 60 * 1000, // 5 minutos
    DEFAULT_PAGE_SIZE: 12
} as const;

// Función auxiliar para construir los parámetros de consulta
const buildQueryParams = (filters: Partial<ProductFilters>): URLSearchParams => {
    const queryParams = new URLSearchParams();
    const {
        page,
        limit = STOCK_THRESHOLDS.DEFAULT_PAGE_SIZE,
        sortBy = '-createdAt',
        categoria,
        search,
        stock,
        enOferta
    } = filters;

    // Mapeo de filtros a parámetros
    const paramMappings: Record<string, string | undefined> = {
        page: page?.toString(),
        limit: limit.toString(),
        sort: sortBy,
        categoria,
        search,
        stock,
        enOferta: enOferta ? 'true' : undefined
    };

    // Agregar parámetros válidos
    Object.entries(paramMappings).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
    });

    return queryParams;
};

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
            const queryParams = buildQueryParams(filters);
            return await getProducts(
                filters.page || 1,
                filters.limit || STOCK_THRESHOLDS.DEFAULT_PAGE_SIZE,
                filters.sortBy || '-createdAt',  // Ordenar por más recientes primero
                filters.categoria ?? '',
                filters.search || '',
                queryParams.toString()
            );
        },
        staleTime: 1000 * 60, // 1 minuto
        refetchInterval: 1000 * 30, // Revalidar cada 30 segundos
        refetchOnWindowFocus: true, // Revalidar cuando la ventana recupere el foco
    });
    
    // Handler genérico para errores de mutación
    const handleMutationError = (error: any, defaultMessage: string) => {
        const errorMessage = error?.response?.data?.message || defaultMessage;
        toast.error(errorMessage);
        console.error('useProducts - Error:', error);
    };

    // Mutaciones CRUD
    const mutations = {
        create: useMutation({
            mutationFn: async (formData: ProductFormData) => {
                console.log('Iniciando creación de producto:', formData);
                return await productService.createProduct(formData);
            },
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['products'] });
                toast.success('Producto creado exitosamente');
            },
            onError: (error: any) => handleMutationError(error, 'Error al crear el producto')
        }),

        update: useMutation({
            mutationFn: async ({ id, data }: { id: string; data: ProductFormData }) => {
                console.log('Iniciando actualización de producto:', { id, data });
                return await productService.updateProduct(id, data);
            },
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['products'] });
                toast.success('Producto actualizado exitosamente');
            },
            onError: (error: any) => handleMutationError(error, 'Error al actualizar el producto')
        }),

        delete: useMutation({
            mutationFn: async (id: string) => {
                return await productService.deleteProduct(id);
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
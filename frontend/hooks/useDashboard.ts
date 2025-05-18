// hooks/useDashboard.ts
import { getDashboardSummary, getFeaturedProducts, getRecentOrders } from '@/services/dashboardService';
import { DashboardStats, DashboardSummary, Order } from '@/types/order.types';
import { Product } from '@/types/product.types';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

interface UseDashboardReturn {
    stats: DashboardStats;
    pedidosRecientes: Order[];
    productosDestacados: Product[];
    isLoading: boolean;
    hasErrors: boolean;
    isGeneratingReport: boolean;
    setIsGeneratingReport: (value: boolean) => void;
    refreshDashboard: () => Promise<void>;
}

export function useDashboard(): UseDashboardReturn {
    const [isGeneratingReport, setIsGeneratingReport] = useState(false);

    // Dashboard summary
    const {
        data: summary = {
            ingresos: 0,
            totalPedidos: 0,
            clientesUnicos: 0,
            productosTotal: 0,
            productosEnStock: 0
        },
        isLoading: summaryLoading,
        error: summaryError,
        refetch: refreshSummary
    } = useQuery<DashboardSummary, Error>({
        queryKey: ['dashboardSummary'],
        queryFn: getDashboardSummary,
        staleTime: 60 * 1000, // 1 minuto
    });

    // Pedidos recientes
    const {
        data: pedidosRecientes = [],
        isLoading: ordersLoading,
        refetch: refreshOrders
    } = useQuery<Order[], Error>({
        queryKey: ['recentOrders'],
        queryFn: () => getRecentOrders(5),
        staleTime: 60 * 1000, // 1 minuto
    });

    // Productos destacados
    const {
        data: productosDestacados = [],
        isLoading: productsLoading
    } = useQuery<Product[], Error>({
        queryKey: ['featuredProducts'],
        queryFn: () => getFeaturedProducts(5),
        staleTime: 60 * 1000, // 1 minuto
    });

    // Actualizar todos los datos
    const refreshDashboard = async (): Promise<void> => {
        await Promise.all([
            refreshSummary(),
            refreshOrders()
        ]);
    };

    const stats: DashboardStats = {
        ingresos: {
            total: summary?.ingresos || 0,
            change: 0 //  no calculamos la variación
        },
        pedidos: {
            total: summary?.totalPedidos || 0,
            change: 0
        },
        productos: {
            total: summary?.productosTotal || 0,
            enStock: summary?.productosEnStock || 0
        },
        clientes: {
            total: summary?.clientesUnicos || 0,
            change: 0
        }
    };

    return {
        stats,
        pedidosRecientes,
        productosDestacados,
        isLoading: summaryLoading || ordersLoading || productsLoading,
        hasErrors: !!summaryError,
        isGeneratingReport,
        setIsGeneratingReport,
        refreshDashboard
    };
}
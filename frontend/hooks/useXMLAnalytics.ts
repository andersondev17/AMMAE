// hooks/useXMLAnalytics.ts
import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

interface ProductReference {
    nombre: string;
    referencia: string;
    cantidad: number;
    precio: number;
    subtotal: number;
}

interface BackendAnalytics {
    success: boolean;
    timestamp: string;
    analytics: {
        productos: {
            total: number;
            valor: number;
            oferta: number;
            distribucion: {
                categorias: [string, number][];
                materiales: [string, number][];
                colores: [string, number][];
                estilos: [string, number][];
            };
            referencias: Record<string, ProductReference[]>;
        };
        usuarios: {
            total: number;
            activos: number;
            verificados: number;
            distribucion: { roles: [string, number][] };
        };
        ventas: {
            porMes: Array<{ mes: string; ingresos: number; pedidos: number }>;
            tendencia: 'up' | 'down' | 'stable';
        };
        insights: Array<{
            tipo: 'success' | 'warning' | 'info';
            titulo: string;
            mensaje: string;
        }>;
        xmlDemo: {
            contenido: string;
            metadata: {
                productos_procesados: number;
                usuarios_procesados: number;
                ordenes_procesadas: number;
                generado: string;
            };
        };
    };
    orders: Array<{
        _id: string;
        orderNumber: string;
        totalPagado: number;
        estado: string;
        customerData: { nombre?: string; email?: string };
        createdAt: string;
        fechaPedido: string;
    }>;
}

interface SummaryResponse {
    success: boolean;
    data: {
        ingresos: number;
        totalPedidos: number;
        clientesUnicos: number;
        productosTotal: number;
        productosEnStock: number;
    };
}

const fetchAnalytics = async (): Promise<BackendAnalytics> => {
    try {
        const response = await fetch(`${API_URL}/analytics/xml`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        });
        
        if (!response.ok) {
            throw new Error(`Analytics API failed: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('Analytics Response:', data); // Debug log
        return data;
    } catch (error) {
        console.error('Analytics fetch error:', error);
        throw error;
    }
};

const fetchSummary = async (): Promise<SummaryResponse> => {
    try {
        const response = await fetch(`${API_URL}/dashboard/summary`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        });
        
        if (!response.ok) {
            throw new Error(`Summary API failed: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('Summary Response:', data); // Debug log
        return data;
    } catch (error) {
        console.error('Summary fetch error:', error);
        throw error;
    }
};

// ✅ COMPLETE HOOK WITH ALL DATA
export const useXMLAnalytics = () => {
    const {
        data: analyticsData,
        isLoading: analyticsLoading,
        error: analyticsError,
        refetch: refetchAnalytics
    } = useQuery({
        queryKey: ['xml-analytics'],
        queryFn: fetchAnalytics,
        retry: 2,
        staleTime: 2 * 60 * 1000,
        refetchOnWindowFocus: false,
        // Add error boundary
        throwOnError: false
    });

    const {
        data: summaryData,
        isLoading: summaryLoading,
        error: summaryError,
        refetch: refetchSummary
    } = useQuery({
        queryKey: ['dashboard-summary'],
        queryFn: fetchSummary,
        retry: 2,
        staleTime: 2 * 60 * 1000,
        refetchOnWindowFocus: false,
        throwOnError: false
    });

    const stats = {
        ingresos: { total: summaryData?.data?.ingresos || 0, change: 0 },
        pedidos: { total: summaryData?.data?.totalPedidos || 0, change: 0 },
        productos: { 
            total: analyticsData?.analytics?.productos?.total || 0, 
            enStock: summaryData?.data?.productosEnStock || 0 
        },
        clientes: { total: summaryData?.data?.clientesUnicos || 0, change: 0 }
    };

    // ✅ REFRESH FUNCTIONS
    const refresh = useCallback(async () => {
        try {
            await Promise.all([refetchAnalytics(), refetchSummary()]);
        } catch (error) {
            console.error('Refresh error:', error);
        }
    }, [refetchAnalytics, refetchSummary]);

    const refreshDashboard = useCallback(() => {
        window.location.reload();
    }, []);

    const error = analyticsError || summaryError;
    const isLoading = analyticsLoading || summaryLoading;

    return {
        // ✅ DASHBOARD DATA (for simple dashboard page)
        stats,
        pedidosRecientes: analyticsData?.orders?.slice(0, 5) || [],
        productosDestacados: analyticsData?.analytics?.productos?.distribucion?.categorias?.slice(0, 3) || [],
        
        // ANALYTICS DATA (for XMLAnalyticsDashboard component)
        analytics: analyticsData?.analytics || null,
        orders: analyticsData?.orders || [],
        timestamp: analyticsData?.timestamp || new Date().toISOString(),
        
        //  COMPUTED DATA FOR CHARTS
        revenueData: analyticsData?.analytics?.ventas?.porMes?.map(mes => ({
            x: mes.mes,
            y: mes.ingresos,
            text: `$${mes.ingresos.toLocaleString()}`
        })) || [],
        
        isLoading,
        error: error as Error | null,
        
        // ACTIONS
        refresh,
        refreshDashboard,
        
        //  RAW DATA FOR EXPORT
        rawAnalyticsData: analyticsData,
        rawSummaryData: summaryData
    };
};
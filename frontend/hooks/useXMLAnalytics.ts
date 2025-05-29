// hooks/useXMLAnalytics.ts
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

interface XMLAnalyticsData {
    success: boolean;
    timestamp: string;
    analytics: {
        productos: {
            total: number;
            valor: number;
            oferta: number;
            min: number;
            max: number;
            distribucion: {
                categorias: [string, number][];
                materiales: [string, number][];
                colores: [string, number][];
                estilos: [string, number][];
            };
            referencias: {
                [categoria: string]: Array<{
                    nombre: string;
                    referencia: string;
                    cantidad: number;
                    precio: number;
                    subtotal: number;
                }>;
            };
        };
        usuarios: {
            total: number;
            email: number;
            activos: number;
            verificados: number;
            distribucion: {
                roles: [string, number][];
            };
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
                generado: string;
            };
        };
        ventas: {
            porMes: Array<{
                mes: string;
                ingresos: number;
                pedidos: number;
            }>;
            tendencia: 'up' | 'down' | 'stable';
        };
    };
    orders: Array<{
        _id: string;
        orderNumber: string;
        customerData: {
            nombre: string;
            email: string;
        };
        totalPagado: number;
        estado: string;
        createdAt: string;
        fechaPedido: string;
    }>;
    
}

export function useXMLAnalytics() {
    const {
        data,
        isLoading,
        error,
        refetch
    } = useQuery<XMLAnalyticsData, Error>({
        queryKey: ['xmlAnalytics'],
        queryFn: async () => {
            const response = await axios.get(`${API_URL}/analytics/xml`);
            return response.data;
        },
        staleTime: 3 * 60 * 1000, // 3 minutos cache
        gcTime: 5 * 60 * 1000, // 5 minutos garbage collection
        retry: 1
    });

    const refresh = async () => {
        try {
            await axios.post(`${API_URL}/analytics/xml/refresh`);
            return refetch();
        } catch (error) {
            console.error('Error refreshing XML analytics:', error);
            throw error;
        }
    };

    return {
        analytics: data?.analytics,
        orders: data?.orders || [],
        isLoading,
        error,
        refresh,
        timestamp: data?.timestamp
    };
}
// hooks/useXMLAnalytics.ts
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';
import { toast } from 'sonner';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

// Tipos simplificados - solo lo necesario
interface XMLAnalyticsResponse {
    success: boolean;
    timestamp: string;
    analytics: {
        productos: {
            total: number;
            valor: number;
            oferta: number;
            distribucion: {
                categorias: [string, number][];
            };
            referencias: Record<string, Array<{
                nombre: string;
                referencia: string;
                cantidad: number;
                precio: number;
                subtotal: number;
            }>>;
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
                generado: string;
            };
        };
    };
    orders: Array<{
        _id: string;
        orderNumber: string;
        totalPagado: number;
        estado: string;
        createdAt: string;
        fechaPedido: string;
    }>;
}

export function useXMLAnalytics() {
    const queryClient = useQueryClient();
    const [isRefreshing, setIsRefreshing] = useState(false);

    const { data, isLoading, error } = useQuery<XMLAnalyticsResponse>({
        queryKey: ['xmlAnalytics'],
        queryFn: () => axios.get(`${API_URL}/analytics/xml`).then(res => res.data),
        staleTime: 3 * 60 * 1000, // 3 minutos
        gcTime: 5 * 60 * 1000,    // 5 minutos
        retry: 1
    });

    const refresh = async () => {
        setIsRefreshing(true);
        try {
            await axios.post(`${API_URL}/analytics/xml/refresh`);
            await queryClient.invalidateQueries({ queryKey: ['xmlAnalytics'] });
            
            // Toast con feedback visual mejorado
            toast.success('✓ Dashboard actualizado', {
                style: {
                    background: '#10b981',
                    color: 'white',
                },
                duration: 2000
            });
        } catch (error) {
            toast.error('Error al actualizar', {
                style: {
                    background: '#ef4444',
                    color: 'white',
                }
            });
            throw error;
        } finally {
            setIsRefreshing(false);
        }
    };

    return {
        analytics: data?.analytics,
        orders: data?.orders || [],
        isLoading: isLoading || isRefreshing,
        error: error as Error | null,
        refresh,
        timestamp: data?.timestamp
    };
}
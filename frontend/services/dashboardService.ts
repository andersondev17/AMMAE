// services/dashboardService.ts
import { DashboardSummary, Order } from '@/types/order.types';
import { Product } from '@/types/product.types';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

/**
 * Obtiene resumen de datos para el dashboard
 */
export async function getDashboardSummary(): Promise<DashboardSummary> {
    try {
        // Intentar obtener datos reales del endpoint específico
        try {
            const response = await axios.get<{ success: boolean; data: DashboardSummary }>(`${API_URL}/dashboard/summary`);
            if (response.data.success) {
                return response.data.data;
            }
        } catch (directError) {
            console.warn('Endpoint de dashboard no encontrado, calculando datos manualmente:', directError);
        }

        // Si no hay endpoint específico, aprovechar las API existentes
        const ordersResponse = await axios.get<{ success: boolean; data: Order[] }>(`${API_URL}/pedidos`);
        const productsResponse = await axios.get<{ success: boolean; data: Product[] }>(`${API_URL}/productos`);

        // Solo si ambas respuestas son exitosas
        if (ordersResponse.data.success && productsResponse.data.success) {
            const orders = ordersResponse.data.data || [];
            const products = productsResponse.data.data || [];

            // Calcular métricas del dashboard usando los datos de órdenes
            const ingresos = orders.reduce((total, order) => total + (order.totalPagado || 0), 0);

            // Set para clientes únicos (por email)
            const clientesUnicos = new Set(orders.map(order =>
                order.customerData?.email || ''
            ).filter(Boolean)).size;

            // Productos con stock > 0
            const productosEnStock = products.filter(p => p.stock > 0).length;

            return {
                ingresos,
                totalPedidos: orders.length,
                clientesUnicos,
                productosTotal: products.length,
                productosEnStock
            };
        }

        throw new Error('Error obteniendo datos para el dashboard');
    } catch (error) {
        console.error('Error en getDashboardSummary:', error);
        // Valores por defecto en caso de error
        return {
            ingresos: 0,
            totalPedidos: 0,
            clientesUnicos: 0,
            productosTotal: 0,
            productosEnStock: 0
        };
    }
}

/**
 * Obtiene órdenes recientes
 */
export async function getRecentOrders(limit = 5): Promise<Order[]> {
    try {
        
        const response = await axios.get(`${API_URL}/dashboard/recent-orders?limit=${limit}`, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        return response.data.data || [];
    } catch (error) {
        console.error('Error en getRecentOrders:', error);
        return [];
    }
}

/**
 * Obtiene productos destacados (más vendidos o con más stock)
 */
export async function getFeaturedProducts(limit = 5): Promise<Product[]> {
    try {
        // Obtener productos usando la API existente
        const response = await axios.get<{ success: boolean; data: Product[] }>(`${API_URL}/productos?limit=${limit}&sort=-stock`);

        if (response.data.success) {
            return response.data.data || [];
        }

        return [];
    } catch (error) {
        console.error('Error en getFeaturedProducts:', error);
        return [];
    }
}
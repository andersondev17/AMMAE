// services/orderService.ts
import { CheckoutOrderData } from '@/types/checkout.types';
import axios from 'axios';
import { toast } from 'sonner';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

export class OrderService {
    static async createOrder(orderDetails: CheckoutOrderData) {
        try {
            console.group('🚀 Enviando Orden al Backend');
            console.log('URL:', `${API_URL}/orders`);
            console.log('📦 Payload:', JSON.stringify(orderDetails, null, 2));

            const formattedOrder = {
                ...orderDetails,
                estado: 'pendiente',
                fechaPedido: new Date(),
                productos: orderDetails.productos.map(p => ({
                    ...p,
                    producto: p.producto, // Aseguramos que el ID del producto esté correcto
                })),
                totalPagado: Number(orderDetails.totalPagado) // Convertimos a número
            };

            const response = await axios.post(`${API_URL}/orders`, formattedOrder, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            console.log('✅ Respuesta del servidor:', response.data);
            console.groupEnd();

            if (!response.data?.success) {
                throw new Error(response.data?.message || 'Error al crear el pedido');
            }

            // Verificar estructura de la respuesta
            if (!response.data.data?.orderNumber) {
                console.warn('⚠️ Respuesta sin número de orden:', response.data);
                throw new Error('No se pudo obtener el número de orden');
            }

            return {
                success: true,
                data: response.data.data,
                orderNumber: response.data.data.orderNumber
            };

        } catch (error: any) {
            console.group('❌ Error en OrderService');
            console.error('Error:', error);
            console.error('Respuesta del servidor:', error.response?.data);
            console.groupEnd();

            const errorMessage = error.response?.data?.message || error.message || 'Error al procesar el pedido';
            toast.error(errorMessage);

            throw {
                success: false,
                error: errorMessage,
                details: error.response?.data
            };
        }
    }
}
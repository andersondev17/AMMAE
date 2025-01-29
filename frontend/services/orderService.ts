// services/orderService.ts
import { CheckoutOrderData } from '@/types/checkout.types';
import axios from 'axios';
import { toast } from 'sonner';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

export class OrderService {
    static async createOrder(orderDetails: CheckoutOrderData) {
        try {
            console.group('🚀 Enviando Orden al Backend');
            const url = `${API_URL}/orders`;
            console.log('URL:', url);
            
            // Validación de datos requeridos
            if (!orderDetails.customerData?.nombre ||
                !orderDetails.customerData?.email ||
                !orderDetails.customerData?.telefono ||
                !orderDetails.productos?.length) {
                throw new Error('Datos incompletos del pedido');
            }

            // Formatear la orden según el esquema del backend
            const formattedOrder = {
                customerData: {
                    nombre: orderDetails.customerData.nombre.trim(),
                    email: orderDetails.customerData.email.trim(),
                    telefono: orderDetails.customerData.telefono.trim()
                },
                productos: orderDetails.productos.map(p => ({
                    producto: p.producto, // MongoDB ObjectId
                    cantidad: Number(p.cantidad),
                    talla: p.selectedSize || '',  
                    color: p.selectedColor || '', 
                    precioUnitario: Number(p.precioUnitario || 0)
                })),
                metodoPago: orderDetails.metodoPago.toLowerCase(),
                totalPagado: Number(orderDetails.totalPagado),
                costoEnvio: Number(orderDetails.costoEnvio || 5000),
                direccionEnvio: {
                    calle: orderDetails.direccionEnvio.calle.trim(),
                    ciudad: orderDetails.direccionEnvio.ciudad.trim(),
                    codigoPostal: orderDetails.direccionEnvio.codigoPostal.trim(),
                    pais: 'Colombia'
                },
                estado: 'pendiente'
            };

            // Log de verificación
            console.log('📦 Orden formateada:', formattedOrder);

            // Enviar al backend
            const response = await axios.post(url, formattedOrder, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            console.log('✅ Respuesta del servidor:', response.data);

            if (!response.data?.success) {
                throw new Error('Error en la respuesta del servidor');
            }

            return {
                success: true,
                data: response.data.data,
                orderNumber: response.data.data.orderNumber
            };

        } catch (error: any) {
            console.group('❌ Error en OrderService');
            console.error('Tipo de error:', error.name);
            console.error('Mensaje:', error.message);
            console.error('Respuesta del servidor:', error.response?.data);
            console.error('Estado HTTP:', error.response?.status);
            console.groupEnd();
            
            const errorMessage = error.response?.data?.message || error.message || 'Error al procesar el pedido';
            toast.error(errorMessage);
            throw error;
        } finally {
            console.groupEnd();
        }
    }

    static async getOrder(orderNumber: string) {
        try {
            const response = await axios.get(`${API_URL}/orders/${orderNumber}`);
            return response.data;
        } catch (error) {
            console.error('Error al obtener la orden:', error);
            throw error;
        }
    }
}
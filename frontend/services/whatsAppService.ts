// services/whatsapp/whatsappService.ts

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;

interface WhatsAppConfig {
    width: number;
    height: number;
    top: number;
    left: number;
    scrollbars: string;
    resizable: string;
}

type Platform = 'ANDROID' | 'IOS' | 'DESKTOP';

interface WhatsAppResponse {
    success: boolean;
    platform?: Platform;
    message?: string;
    error?: string;
    fallbackUsed?: boolean;
}

import { CustomerDetails, WhatsAppOrderItem } from '@/types/cart.types';

interface OrderDetails {
    items: WhatsAppOrderItem[];
    customerDetails: CustomerDetails;
}

export class WhatsAppService {
    private static getPlatform(): Platform {
        if (typeof window === 'undefined') return 'DESKTOP';

        const userAgent = navigator.userAgent || navigator.vendor;

        if (/android/i.test(userAgent)) return 'ANDROID';
        if (/iPad|iPhone|iPod/.test(userAgent)) return 'IOS';
        return 'DESKTOP';
    }

    private static getWhatsAppUrl(message: string, platform: Platform): string {
        const encodedMessage = encodeURIComponent(message);
        const numberWithoutPlus = WHATSAPP_NUMBER?.replace('+', '');

        switch (platform) {
            case 'ANDROID':
            case 'IOS':
                return `whatsapp://send?phone=${numberWithoutPlus}&text=${encodedMessage}`;
            default:
                return `https://wa.me/${numberWithoutPlus}?text=${encodedMessage}`;
        }
    }

    private static formatOrderMessage(orderDetails: OrderDetails & { 
        orderNumber?: string; 
        paymentMethod?: string; 
    }): string {
        const { items, customerDetails, orderNumber, paymentMethod } = orderDetails;
    
        const itemsList = items
            .map(item => {
                let itemDetails = `• ${item.nombre} x${item.quantity}`;
                
                // Agregamos color y talla si existen
                const details = [];
                if (item.selectedSize) details.push(`Talla: ${item.selectedSize}`);
                if (item.selectedColor) details.push(`Color: ${item.selectedColor}`);
                
                if (details.length > 0) {
                    itemDetails += ` (${details.join(' - ')})`;
                }
                
                // Agregamos el precio al final
                itemDetails += ` - $${item.itemTotal.toLocaleString()}`;
                
                return itemDetails;
            })
            .join('\n');
    
        const subtotal = items.reduce((sum, item) => sum + item.itemTotal, 0);
        const shippingCost = customerDetails.shippingMethod.includes('Express') ? 15000 : 5000;
        const total = subtotal + shippingCost;
    
        return `🛍️ *Nuevo Pedido${orderNumber ? ` #${orderNumber}` : ''}*\n\n` +
            `📋 *Detalles del Cliente:*\n` +
            `• Nombre: ${customerDetails.name}\n` +
            `• Teléfono: ${customerDetails.phone}\n` +
            `• Dirección: ${customerDetails.address}\n` +
            `• Envío: ${customerDetails.shippingMethod}\n` +
            `${paymentMethod ? `• Pago: ${paymentMethod}\n` : ''}` +
            `\n🛒 *Productos:*\n${itemsList}\n\n` +
            `💰 *Resumen:*\n` +
            `• Subtotal: $${subtotal.toLocaleString()}\n` +
            `• Envío: $${shippingCost.toLocaleString()}\n` +
            `• Total: $${total.toLocaleString()}\n\n` +
            `¡Gracias por tu compra! 🌟`;
    }

    static async sendOrderNotification(
        items: OrderDetails['items'],
        customerDetails: OrderDetails['customerDetails'] & {
            orderNumber?: string;
            paymentMethod?: string;
        }
    ): Promise<WhatsAppResponse> {
        if (!WHATSAPP_NUMBER) {
            console.error('Número de WhatsApp no configurado');
            return { success: false, error: 'Configuración incompleta' };
        }

        try {
            const platform = this.getPlatform();
            const message = this.formatOrderMessage({ items, customerDetails, orderNumber: customerDetails.orderNumber, paymentMethod: customerDetails.paymentMethod });
            const whatsappUrl = this.getWhatsAppUrl(message, platform);

            // Configuración de la ventana de WhatsApp
            const windowConfig: WhatsAppConfig = {
                width: 1000,
                height: 600,
                top: typeof window !== 'undefined' ? window.innerHeight / 2 - 300 : 0,
                left: typeof window !== 'undefined' ? window.innerWidth / 2 - 500 : 0,
                scrollbars: 'yes',
                resizable: 'yes'
            };

            const windowFeatures = Object.entries(windowConfig)
                .map(([key, value]) => `${key}=${value}`)
                .join(',');

            // Abrir WhatsApp según la plataforma
            const whatsappWindow = platform === 'DESKTOP'
                ? window.open(whatsappUrl, '_blank', windowFeatures)
                : window.open(whatsappUrl, '_blank');

            if (!whatsappWindow) {
                throw new Error('Ventana bloqueada por el navegador');
            }

            return {
                success: true,
                platform,
                message: `Notificación enviada a WhatsApp (${platform})`
            };

        } catch (error) {
            console.warn('Error al abrir WhatsApp:', error);

            // Fallback usando enlace directo
            if (typeof document !== 'undefined') {
                const backupLink = document.createElement('a');
                backupLink.href = this.getWhatsAppUrl(
                    this.formatOrderMessage({ items, customerDetails,orderNumber: customerDetails.orderNumber, paymentMethod: customerDetails.paymentMethod}),
                    'DESKTOP'
                );
                backupLink.target = '_blank';
                backupLink.rel = 'noopener noreferrer';
                document.body.appendChild(backupLink);
                backupLink.click();
                document.body.removeChild(backupLink);
            }

            return {
                success: false,
                error: error instanceof Error ? error.message : 'Error desconocido',
                fallbackUsed: true
            };
        }
    }
}

export const useWhatsApp = () => {
    const sendOrderNotification = async (
        items: OrderDetails['items'],
        customerDetails: OrderDetails['customerDetails'] & {
            orderNumber?: string;
            paymentMethod?: string;
        }
    ) => {
        return WhatsAppService.sendOrderNotification(items, customerDetails);
    };

    return { sendOrderNotification };
};
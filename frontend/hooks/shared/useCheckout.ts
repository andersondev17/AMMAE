import { useCart } from '@/hooks/cart/useCart';
import { CheckoutFormValues } from '@/lib/validations/checkoutFormSchema';
import { OrderService } from '@/services/orderService';
import { useWhatsApp } from '@/services/whatsAppService';
import { PaymentMethod } from '@/types/checkout.types';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { toast } from 'sonner';

interface UseCheckoutProps {
    form: UseFormReturn<CheckoutFormValues>;
}

export const useCheckout = ({ form }: UseCheckoutProps) => {
    const router = useRouter();
    const { items, total: subtotal, clearCart } = useCart();
    const { sendOrderNotification } = useWhatsApp();
    
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);

    // ✅ SHIPPING CALCULATOR
    const calculateShipping = useCallback((method: string) => 
        method === 'express' ? 15000 : 5000, []);

    // ✅ PAYMENT METHOD MAPPER
    const mapPaymentMethod = useCallback((method: PaymentMethod) => 
        method.toLowerCase().replace('_', ''), []);

    const processOrder = useCallback(async (method: PaymentMethod) => {
        if (isSubmitting) return;

        setIsSubmitting(true);
        
        try {
            const formData = form.getValues();
            const shippingCost = calculateShipping(formData.shippingMethod);
            const totalAmount = subtotal + shippingCost;

            const orderData = {
                customerData: {
                    nombre: formData.fullName.trim(),
                    email: formData.email.trim(),
                    telefono: formData.phone.trim(),
                    direccion: `${formData.address.street}, ${formData.address.city}`,
                },
                productos: items.map(item => ({
                    producto: item._id,
                    cantidad: item.quantity,
                    selectedSize: item.selectedSize || '',
                    selectedColor: item.selectedColor || '',
                    precioUnitario: item.precio,
                })),
                metodoPago: mapPaymentMethod(method),
                totalPagado: totalAmount,
                costoEnvio: shippingCost,
                direccionEnvio: {
                    calle: formData.address.street.trim(),
                    ciudad: formData.address.city.trim(),
                    codigoPostal: formData.address.zipCode.trim(),
                    pais: 'Colombia',
                },
                estado: method === PaymentMethod.CONTRA_ENTREGA ? 'pendiente' : 'pendiente_confirmacion'
            };

            //  CREATE ORDER
            console.log('🚀 Procesando orden...');
            const orderResponse = await OrderService.createOrder(orderData);

            if (!orderResponse.success) {
                throw new Error('Error al crear la orden');
            }

            console.log('✅ Orden creada:', orderResponse.data.orderNumber);

            await sendOrderNotification(items, {
                name: formData.fullName,
                phone: formData.phone,
                address: `${formData.address.street}, ${formData.address.city}`,
                shippingMethod: formData.shippingMethod,
                orderNumber: orderResponse.data.orderNumber,
                paymentMethod: method,
            });

            clearCart();
            
            //  para asegurar que la navegación ocurra después del render
            setTimeout(() => {
                router.replace(`/order/success?orderNumber=${orderResponse.data.orderNumber}`);
            }, 100);
            
            toast.success('¡Pedido creado exitosamente!');

        } catch (error) {
            console.error('❌ Error al procesar el pedido:', error);
            toast.error(error instanceof Error ? error.message : 'Error al procesar el pedido');
        } finally {
            setIsSubmitting(false);
        }
    }, [isSubmitting, form, calculateShipping, subtotal, items, mapPaymentMethod, sendOrderNotification, clearCart, router]);

    const handlePaymentMethodSelect = useCallback(async (method: PaymentMethod) => {
        if (isSubmitting) return;
        
        setPaymentMethod(method);

        if (method === PaymentMethod.CONTRA_ENTREGA) {
            await processOrder(method);
        } else {
            setStep(3);
        }
    }, [isSubmitting, processOrder]);

    const handleConfirmPayment = useCallback(async (method: PaymentMethod) => {
        if (!method || isSubmitting) return;
        await processOrder(method);
    }, [isSubmitting, processOrder]);

    const handleFormSubmit = useCallback(async (data: CheckoutFormValues) => {
        if (step !== 1 || isSubmitting) return;
        
        setIsSubmitting(true);
        
        try {
            const requiredFields = [data.fullName, data.email, data.phone];
            if (requiredFields.some(field => !field?.trim())) {
                throw new Error('Por favor complete todos los campos requeridos');
            }
            
            setStep(2);
            toast.success('Información guardada correctamente');
        } catch (error: any) {
            toast.error(error.message || 'Error al procesar el formulario');
        } finally {
            setIsSubmitting(false);
        }
    }, [step, isSubmitting]);

    return {
        step,
        setStep,
        isSubmitting,
        paymentMethod,
        handlePaymentMethodSelect,
        handleFormSubmit,
        handleConfirmPayment,
    };
};
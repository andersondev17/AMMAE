import { useCart } from '@/hooks/cart/useCart';
import { CheckoutFormValues } from '@/lib/validations/checkoutFormSchema';
import { OrderService } from '@/services/orderService';
import { useWhatsApp } from '@/services/whatsAppService';
import { PaymentMethod } from '@/types/checkout.types';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { toast } from 'sonner';

interface UseCheckoutProps {
    form: UseFormReturn<CheckoutFormValues>;
}

interface UseCheckoutReturn {
    step: number;
    setStep: (step: number) => void;
    isSubmitting: boolean;
    setIsSubmitting: (isSubmitting: boolean) => void;
    paymentMethod: PaymentMethod | null;
    handlePaymentMethodSelect: (method: PaymentMethod) => Promise<void>;
    handleFormSubmit: (data: CheckoutFormValues) => Promise<void>;
    handleConfirmPayment: (comprobante: File, method: PaymentMethod) => Promise<void>;
}

export const useCheckout = ({ form }: UseCheckoutProps): UseCheckoutReturn => {
    const router = useRouter();
    const { items, total: subtotal, clearCart } = useCart();
    const { sendOrderNotification } = useWhatsApp();
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);

    const processOrder = async (method: PaymentMethod, comprobante?: File) => {
        if (isSubmitting) return;

        try {
            setIsSubmitting(true);
            const formData = form.getValues();
            console.log("📦 Datos del formulario:", formData);


            const shippingCost = formData.shippingMethod === 'express' ? 15000 : 5000;
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
                metodoPago: method.toLowerCase().replace('_', ''),
                totalPagado: totalAmount,
                costoEnvio: shippingCost,
                direccionEnvio: {
                    calle: formData.address.street.trim(),
                    ciudad: formData.address.city.trim(),
                    codigoPostal: formData.address.zipCode.trim(),
                    pais: 'Colombia',
                },
                comprobante: comprobante ? 'uploaded' : undefined, // Asegurar que se subió comprobante
            };

            const orderResponse = await OrderService.createOrder(orderData);
            console.log("📦 Datos de la orden a enviar:", orderData);
            console.log("🛒 Respuesta del servidor:", orderResponse);

            if (orderResponse.success) {
                try {
                    await sendOrderNotification(items, {
                        name: formData.fullName,
                        phone: formData.phone,
                        address: `${formData.address.street}, ${formData.address.city}`,
                        shippingMethod: formData.shippingMethod,
                        orderNumber: orderResponse.data.orderNumber,
                        paymentMethod: method,
                        hasComprobante: !!comprobante,
                    });

                    clearCart();
                    router.push(`/order/success?orderNumber=${orderResponse.data.orderNumber}`);
                    toast.success('¡Pedido creado exitosamente!');
                } catch (whatsappError) {
                    console.error('Error WhatsApp:', whatsappError);
                    toast.error('Error al enviar notificación por WhatsApp');
                }
            }
        } catch (error) {
            console.error('Error al procesar el pedido:', error);
            toast.error('Error al procesar el pedido');
            throw error;
        } finally {
            setIsSubmitting(false);
        }
    };



    const handlePaymentMethodSelect = async (method: PaymentMethod) => {
        // Prevenir múltiples ejecuciones
        if (isSubmitting) return;
        
        
        try {
            setIsSubmitting(true);
            console.log("📢 Seleccionando método de pago:", method);
            setPaymentMethod(method);
    
            if (method === PaymentMethod.CONTRA_ENTREGA) {
                console.log("🚚 Procesando orden contra entrega");
                await processOrder(method);
            } else if (method === PaymentMethod.QR || method === PaymentMethod.TRANSFERENCIA) {
                console.log("💳 Avanzando al paso de comprobante");
                setStep(3);
            }
        } catch (error) {
            console.error('🚨 Error al seleccionar método de pago:', error);
            toast.error('Error al procesar el método de pago');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleConfirmPayment = async (comprobante: File, method: PaymentMethod) => {
        if (isSubmitting) return;

        try {
            setIsSubmitting(true);
            
            // Solo procesar si es un método que requiere comprobante
            if (method === PaymentMethod.QR || method === PaymentMethod.TRANSFERENCIA) {
                await processOrder(method, comprobante);
            }
        } catch (error) {
            console.error('Error en confirmación de pago:', error);
            toast.error('Error al confirmar el pago');
        } finally {
            setIsSubmitting(false);
        }
    };


    useEffect(() => {
        console.log("🔄 Estado actualizado de paymentMethod:", paymentMethod);
    }, [paymentMethod]);

    const handleFormSubmit = async (data: CheckoutFormValues) => {
        if (step === 1) {
            setIsSubmitting(true);
            try {
                if (!data.fullName || !data.email || !data.phone) {
                    throw new Error('Por favor complete todos los campos requeridos');
                }
                setStep(2);
                toast.success('Información guardada correctamente');
            } catch (error: any) {
                toast.error(error.message || 'Error al procesar el formulario');
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    return {
        step,
        setStep,
        isSubmitting,
        setIsSubmitting,
        paymentMethod,
        handlePaymentMethodSelect,
        handleFormSubmit,
        handleConfirmPayment,
    };
};
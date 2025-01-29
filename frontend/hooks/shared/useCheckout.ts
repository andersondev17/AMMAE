// hooks/useCheckout.ts
import { useCart } from '@/hooks/cart/useCart';
import { CheckoutFormValues } from '@/lib/validations/checkoutFormSchema';
import { OrderService } from '@/services/orderService';
import { useWhatsApp } from '@/services/whatsAppService';
import { PaymentMethod } from '@/types/checkout.types';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { toast } from 'sonner';

interface UseCheckoutProps {
    form: UseFormReturn<CheckoutFormValues>;
}

interface UseCheckoutReturn {
    step: number;
    setStep: (step: number) => void;
    isSubmitting: boolean;
    paymentMethod: PaymentMethod | null;
    handlePaymentMethodSelect: (method: PaymentMethod) => Promise<void>;
    handleFormSubmit: (data: CheckoutFormValues) => Promise<void>;
}

export const useCheckout = ({ form }: UseCheckoutProps): UseCheckoutReturn => {
    const router = useRouter();
    const { items, total: subtotal, clearCart } = useCart();
    const { sendOrderNotification } = useWhatsApp();
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);

    const handlePaymentMethodSelect = async (method: PaymentMethod) => {

        if (isSubmitting) return; // Prevenimos múltiples envíos

        try {
            setIsSubmitting(true);
            setPaymentMethod(method);
            const formData = form.getValues();
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
              };

            const orderResponse = await OrderService.createOrder(orderData);

            if (orderResponse.success) {
                if (method === PaymentMethod.CONTRA_ENTREGA) {
                    try {
                        await sendOrderNotification(items, {
                            name: formData.fullName,
                            phone: formData.phone,
                            address: `${formData.address.street}, ${formData.address.city}`,
                            shippingMethod: formData.shippingMethod,
                            orderNumber: orderResponse.data.orderNumber,
                        });
                    } catch (whatsappError) {
                        console.error('Error WhatsApp:', whatsappError);
                    }
                }

                clearCart();
                router.push(`/order/success?orderNumber=${orderResponse.data.orderNumber}`);
                toast.success('¡Pedido creado exitosamente!');
            }
        } catch (error) {
            toast.error('Error al procesar el pedido');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleFormSubmit = async (data: CheckoutFormValues) => {
        setIsSubmitting(true);
        try {
            // Validaciones del formulario
            if (!data.fullName || !data.email || !data.phone) {
                throw new Error('Por favor complete todos los campos requeridos');
            }

            // Avanzar al siguiente paso
            setStep(2);
            toast.success('Información guardada correctamente');
        } catch (error: any) {
            toast.error(error.message || 'Error al procesar el formulario');
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        step,
        setStep,
        isSubmitting,
        paymentMethod,
        handlePaymentMethodSelect,
        handleFormSubmit,
    };
};

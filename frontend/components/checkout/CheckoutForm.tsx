import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/form/input';
import { Separator } from '@/components/ui/form/separator';
import { useCart } from '@/hooks/cart/useCart';
import { CheckoutFormData, CustomerFormData, PaymentMethod } from '@/types/checkout.types';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

const CheckoutForm = () => {
    const [step, setStep] = useState(1);
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
    const cart = useCart();
    const { items, itemCount, isOpen } = cart;

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm<CustomerFormData>();

    const subtotal = cart.items.reduce((acc, item) => acc + (item.precio * item.quantity), 0);
    const shipping = subtotal > 100 ? 0 : 10; // Envío gratis por compras mayores a $100
    const total = subtotal + shipping;
    

    const onSubmit = async (data: CustomerFormData) => {
        try {
            const checkoutData: CheckoutFormData = {
                ...data,
                paymentMethod: paymentMethod!,
                orderItems: cart.items.map(item => ({
                    productId: item._id,
                    quantity: item.quantity,
                    price: item.precio,
                    name: item.nombre 
                })),
                subtotal,
                shipping,
                total
            };

            // Enviamos al backend y esperamos respuesta
            // TODO: Implementar llamada a API
            setStep(2);
        } catch (error) {
            console.error('Error al procesar el checkout:', error);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="space-y-8">
                {step === 1 && (
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Nombre completo</label>
                                <Input
                                    {...register('fullName')}
                                    placeholder="Nombre completo"
                                />
                                {errors.fullName && (
                                    <p className="text-sm text-red-500">{errors.fullName.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Email</label>
                                <Input
                                    {...register('email')}
                                    type="email"
                                    placeholder="correo@ejemplo.com"
                                />
                                {errors.email && (
                                    <p className="text-sm text-red-500">{errors.email.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Teléfono</label>
                                <Input
                                    {...register('phone')}
                                    type="tel"
                                    placeholder="Número de teléfono"
                                />
                                {errors.phone && (
                                    <p className="text-sm text-red-500">{errors.phone.message}</p>
                                )}
                            </div>
                        </div>

                        <Separator />

                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Dirección de envío</h3>
                            <div className="grid grid-cols-1 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Dirección</label>
                                    <Input
                                        {...register('address.street')}
                                        placeholder="Calle y número"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Ciudad</label>
                                        <Input
                                            {...register('address.city')}
                                            placeholder="Ciudad"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Código postal</label>
                                        <Input
                                            {...register('address.zipCode')}
                                            placeholder="Código postal"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isSubmitting}
                        >
                            Continuar al pago
                        </Button>
                    </form>
                )}

                {step === 2 && (
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold">Método de pago</h3>
                        <div className="grid grid-cols-3 gap-4">
                            <Button
                                variant={paymentMethod === PaymentMethod.CONTRA_ENTREGA ? 'default' : 'outline'}
                                onClick={() => setPaymentMethod(PaymentMethod.CONTRA_ENTREGA)}
                            >
                                Contra entrega
                            </Button>
                            <Button
                                variant={paymentMethod === PaymentMethod.TRANSFERENCIA ? 'default' : 'outline'}
                                onClick={() => setPaymentMethod(PaymentMethod.TRANSFERENCIA)}
                            >
                                Transferencia
                            </Button>
                            <Button
                                variant={paymentMethod === PaymentMethod.QR ? 'default' : 'outline'}
                                onClick={() => setPaymentMethod(PaymentMethod.QR)}
                            >
                                Pago QR
                            </Button>
                        </div>

                        {paymentMethod && (
                            <Button
                                className="w-full"
                                onClick={() => {
                                    // Implementar lógica según método de pago
                                    if (paymentMethod === PaymentMethod.CONTRA_ENTREGA) {
                                        // Redirigir a WhatsApp
                                    } else {
                                        setStep(3);
                                    }
                                }}
                            >
                                Confirmar método de pago
                            </Button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CheckoutForm;

'use client';

import { OrderSummary } from '@/components/checkout/OrderSummary';
import { Steps } from '@/components/checkout/Steps';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '@/hooks/useCart';
import {
    CheckoutFormInputs,
    checkoutFormSchema
} from '@/types/checkout.types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

export default function CheckoutPage() {
    const router = useRouter();
    const { items, total: cartTotal } = useCart();
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<CheckoutFormInputs>({
        resolver: zodResolver(checkoutFormSchema)
    });

    const getErrorMessage = (error: any) => {
        return error?.message?.toString() || '';
    };

    useEffect(() => {
        if (items.length === 0) {
            toast.error('Tu carrito está vacío');
            router.push('/');
        }
    }, [items.length, router]);

    if (items.length === 0) {
        return null;
    }

    const subtotal = items.reduce((acc, item) => acc + (item.precio * item.quantity), 0);
    const shipping = subtotal > 100 ? 0 : 10;
    const total = subtotal + shipping;

    const onSubmit = async (data: CheckoutFormInputs) => {
        try {
            setIsSubmitting(true);
            console.log('Form data:', data);
            setStep(2);
        } catch (error) {
            toast.error('Error al procesar el pedido');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-24">
            <div className="container mx-auto px-4">
                <Steps currentStep={step} />
                <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow p-6">
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                <h2 className="text-xl font-semibold">Información de contacto</h2>

                                <div className="space-y-4">
                                    {/* Nombre completo */}
                                    <div>
                                        <label className="block text-sm font-medium">
                                            Nombre completo
                                        </label>
                                        <Input {...register('fullName')} />
                                        {errors.fullName && (
                                            <p className="text-sm text-red-500 mt-1">
                                                {getErrorMessage(errors.fullName)}
                                            </p>
                                        )}
                                    </div>

                                    {/* Email y Teléfono */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium">
                                                Email
                                            </label>
                                            <Input {...register('email')} type="email" />
                                            {errors.email && (
                                                <p className="text-sm text-red-500 mt-1">
                                                    {getErrorMessage(errors.email)}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium">
                                                Teléfono
                                            </label>
                                            <Input {...register('phone')} type="tel" />
                                            {errors.phone && (
                                                <p className="text-sm text-red-500 mt-1">
                                                    {getErrorMessage(errors.phone)}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Dirección */}
                                    <div>
                                        <label className="block text-sm font-medium">
                                            Dirección
                                        </label>
                                        <Input {...register('address.street')} />
                                        {errors.address?.street && (
                                            <p className="text-sm text-red-500 mt-1">
                                                {getErrorMessage(errors.address.street)}
                                            </p>
                                        )}
                                    </div>

                                    {/* Ciudad y Código Postal */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium">
                                                Ciudad
                                            </label>
                                            <Input {...register('address.city')} />
                                            {errors.address?.city && (
                                                <p className="text-sm text-red-500 mt-1">
                                                    {getErrorMessage(errors.address.city)}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium">
                                                Código postal
                                            </label>
                                            <Input {...register('address.zipCode')} />
                                            {errors.address?.zipCode && (
                                                <p className="text-sm text-red-500 mt-1">
                                                    {getErrorMessage(errors.address.zipCode)}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Procesando...' : 'Continuar al pago'}
                                </Button>
                            </form>
                        </div>
                    </div>

                    <div className="lg:col-span-1">
                        <OrderSummary
                            items={items}
                            subtotal={subtotal}
                            shipping={shipping}
                            total={total}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
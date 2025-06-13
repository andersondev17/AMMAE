'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/form/card';
import { Form } from '@/components/ui/form/form';
import { useCart } from '@/hooks/cart/useCart';
import { useCheckout } from '@/hooks/shared/useCheckout';
import { checkoutFormSchema, type CheckoutFormValues } from '@/lib/validations/checkoutFormSchema';
import { PaymentMethod } from '@/types/checkout.types';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronLeft, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { ShippingForm } from './form/ShippingForm';
import { OrderSummary } from './OrderSummary';
import { PaymentDetails } from './payment/PaymentDetails';
import { PaymentSelector } from './payment/PaymentSelector';
import { Steps } from './Steps';

export function CheckoutForm() {
    const { items, total: subtotal, shipping } = useCart();

    const form = useForm<CheckoutFormValues>({
        resolver: zodResolver(checkoutFormSchema),
        defaultValues: {
            fullName: '',
            email: '',
            phone: '',
            address: { street: '', city: '', state: '', zipCode: '' },
            shippingMethod: 'standard',
            saveAddress: false,
        },
    });

    const {
        step,
        setStep,
        isSubmitting,
        paymentMethod,
        handlePaymentMethodSelect,
        handleFormSubmit,
        handleConfirmPayment
    } = useCheckout({ form });

    const BackButton = ({ onBack }: { onBack: () => void }) => (
        <Button
            type="button"
            variant="ghost"
            onClick={onBack}
            className="flex items-center gap-2 hover:bg-transparent hover:text-blue-600 mb-4"
        >
            <ChevronLeft className="h-4 w-4" />
            Volver
        </Button>
    );

    const renderStepContent = () => {
        switch (step) {
            case 1:
                return (
                    <Card>
                        <CardHeader>
                            <CardTitle>Información de envío</CardTitle>
                            <CardDescription>Complete sus datos para realizar el pedido</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
                                    <ShippingForm form={form} />
                                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Procesando...
                                            </>
                                        ) : (
                                            'Continuar al pago'
                                        )}
                                    </Button>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                );

            case 2:
                return (
                    <div className="space-y-6">
                        <BackButton onBack={() => setStep(1)} />
                        <PaymentSelector
                            selectedMethod={paymentMethod}
                            onSelect={handlePaymentMethodSelect} 
                        />
                    </div>
                );

            case 3:
                return (
                    <Card>
                        <CardHeader>
                            <BackButton onBack={() => setStep(2)} />
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {paymentMethod &&
                                (paymentMethod === PaymentMethod.QR || paymentMethod === PaymentMethod.TRANSFERENCIA) && (
                                    <>
                                        <PaymentDetails method={paymentMethod} />
                                        <div className="bg-blue-50 rounded-lg p-4">
                                            <p className="text-sm text-blue-700">
                                                ¡Tu prenda está a punto de ser despachada!
                                            </p>
                                        </div>
                                    </>
                                )}

                            <Button
                                className="w-full"
                                disabled={isSubmitting || !paymentMethod}
                                onClick={() => handleConfirmPayment(paymentMethod!)}
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Procesando...
                                    </>
                                ) : (
                                    'Confirmar pedido'
                                )}
                            </Button>
                        </CardContent>
                    </Card>
                );

            default:
                return null;
        }
    };

    return (
        <div className="w-full">
            <Steps currentStep={step} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
                <div className="lg:col-span-2">
                    {renderStepContent()}
                </div>

                <div className="lg:col-span-1">
                    <OrderSummary
                        showShippingMethod={step >= 1}
                        shippingMethod={form.watch('shippingMethod')}
                        items={items}
                        subtotal={subtotal}
                        shipping={shipping}
                        total={subtotal + shipping}
                    />
                </div>
            </div>
        </div>
    );
}
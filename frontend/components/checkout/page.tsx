'use client';

import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/form/card';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form/form';
import { Input } from '@/components/ui/form/input';
import { Separator } from '@/components/ui/form/separator';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useCart } from '@/hooks/cart/useCart';
import { useCheckout } from '@/hooks/shared/useCheckout';
import { checkoutFormSchema, type CheckoutFormValues } from '@/lib/validations/checkoutFormSchema';
import { useWhatsApp } from '@/services/whatsAppService';
import { PaymentMethod } from '@/types/checkout.types';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronLeft, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { OrderSummary } from './OrderSummary';
import { PaymentDetails } from './payment/PaymentDetails';
import { PaymentSelector } from './payment/PaymentSelector';
import { Steps } from './Steps';

interface CheckoutFormProps {
    onSubmitComplete?: () => void;
}

export function CheckoutForm({ onSubmitComplete }: CheckoutFormProps) {
    const router = useRouter();
    const [isClient, setIsClient] = useState(false);
    const { sendOrderNotification } = useWhatsApp();
    const { items, total: subtotal, shipping, clearCart } = useCart();
    const [comprobante, setComprobante] = useState<File | null>(null);

    const form = useForm<CheckoutFormValues>({
        resolver: zodResolver(checkoutFormSchema),
        defaultValues: {
            fullName: '',
            email: '',
            phone: '',
            address: {
                street: '',
                city: '',
                state: '',
                zipCode: '',
            },
            shippingMethod: 'standard',
            saveAddress: false,
        },
    });
    const { handleConfirmPayment } = useCheckout({ form });


    const {
        step,
        setStep,
        isSubmitting,
        setIsSubmitting,
        paymentMethod,
        handlePaymentMethodSelect, // Usar el del hook
        handleFormSubmit
    } = useCheckout({ form });
    useEffect(() => {
        setIsClient(true);
    }, []);


    const handleComprobanteUpload = (file: File) => {
        setComprobante(file);
    };
    // Componentes de formulario divididos para mejor organización
    const renderContactForm = () => (
        <div className="space-y-4">
            <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Nombre completo</FormLabel>
                        <FormControl>
                            <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input type="email" placeholder="johndoe@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Teléfono</FormLabel>
                            <FormControl>
                                <Input type="tel" placeholder="(123) 456-7890" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
        </div>
    );

    const renderAddressForm = () => (
        <div className="space-y-4">
            <FormField
                control={form.control}
                name="address.street"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Dirección</FormLabel>
                        <FormControl>
                            <Input placeholder="Calle Principal 123" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                    control={form.control}
                    name="address.city"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Ciudad</FormLabel>
                            <FormControl>
                                <Input placeholder="Ciudad" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="address.state"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Estado</FormLabel>
                            <FormControl>
                                <Input placeholder="Estado" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="address.zipCode"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Código postal</FormLabel>
                            <FormControl>
                                <Input placeholder="12345" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
        </div>
    );
    const BackButton = ({
        step,
        onBack
    }: {
        step: number;
        onBack: () => void;
    }) => (
        step > 1 ? (
            <div className="mb-4">
                <Button
                    type="button"
                    variant="ghost"
                    onClick={onBack}
                    className="flex items-center gap-2 hover:bg-transparent hover:text-blue-600"
                >
                    <ChevronLeft className="h-4 w-4" />
                    Volver
                </Button>
            </div>
        ) : null
    );
    const renderShippingOptions = () => (
        <div className="space-y-4">
            <FormField
                control={form.control}
                name="shippingMethod"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Método de envío</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Seleccione método de envío" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="standard">Estándar (5-7 días)</SelectItem>
                                <SelectItem value="express">Express (2-3 días)</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="saveAddress"
                render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                            <FormLabel className="text-base">
                                Guardar información
                            </FormLabel>
                            <FormDescription>
                                Guardar dirección para futuras compras
                            </FormDescription>
                        </div>
                        <FormControl>
                            <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                            />
                        </FormControl>
                    </FormItem>
                )}
            />
        </div>
    );

    return (
        <div className="w-full">
            <Steps currentStep={step} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
                <div className="lg:col-span-2">
                    {step === 1 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Información de envío</CardTitle>
                                <CardDescription>
                                    Complete sus datos para realizar el pedido
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
                                        {renderContactForm()}
                                        <Separator />
                                        {renderAddressForm()}
                                        <Separator />
                                        {renderShippingOptions()}

                                        <Button
                                            type="submit"
                                            className="w-full"
                                            disabled={isSubmitting}
                                        >
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
                    )}

                    {step === 2 && (
                        <div className="space-y-6">
                            <BackButton step={step} onBack={() => setStep(1)} />

                            <PaymentSelector
                                selectedMethod={paymentMethod}
                                onSelect={(method) => {
                                    handlePaymentMethodSelect(method);
                                    // Si es QR o transferencia, avanzar al paso 3
                                    if (method === PaymentMethod.QR || method === PaymentMethod.TRANSFERENCIA) {
                                        setStep(3);
                                    }
                                    // Si es contra entrega, también avanzar al paso 3
                                    if (method === PaymentMethod.CONTRA_ENTREGA) {
                                        setStep(3);
                                    }
                                }}
                            />

                        </div>
                    )}

                    {step === 3 && (
                        <Card>
                            <CardHeader>
                                <BackButton step={step} onBack={() => setStep(2)} />
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {paymentMethod && (paymentMethod === PaymentMethod.QR ||
                                    paymentMethod === PaymentMethod.TRANSFERENCIA) && (
                                        <>
                                            <PaymentDetails
                                                method={paymentMethod}
                                                onComprobanteUpload={handleComprobanteUpload}
                                            />
                                            <div className="bg-blue-50 rounded-lg p-4">
                                                <p className="text-sm text-blue-700">
                                                    ¡Tu prenda está a punto de ser despachada!
                                                </p>
                                            </div>
                                        </>
                                    )}

                                <Button
                                    className="w-full"
                                    disabled={
                                        isSubmitting ||
                                        !paymentMethod ||
                                        ((paymentMethod === PaymentMethod.QR ||
                                            paymentMethod === PaymentMethod.TRANSFERENCIA) &&
                                            !comprobante)
                                    }
                                    onClick={async () => {
                                        console.log("🛒 Botón de 'Confirmar Pedido' presionado");

                                        if (isSubmitting) {
                                            console.log("🚫 Procesamiento en curso, evitando múltiple envío");
                                            return;
                                        }

                                        if (!paymentMethod) {
                                            console.error("🚨 No hay método de pago seleccionado");
                                            toast.error("Por favor seleccione un método de pago");
                                            return;
                                        }

                                        try {
                                            setIsSubmitting(true);

                                            if (paymentMethod === PaymentMethod.QR ||
                                                paymentMethod === PaymentMethod.TRANSFERENCIA) {
                                                if (!comprobante) {
                                                    console.error("🚨 Falta comprobante de pago");
                                                    toast.error("Por favor cargue el comprobante de pago");
                                                    return;
                                                }
                                                console.log("📤 Procesando pago con comprobante", {
                                                    method: paymentMethod,
                                                    hasComprobante: !!comprobante
                                                });
                                                await handleConfirmPayment(comprobante, paymentMethod);
                                            }
                                        } catch (error) {
                                            console.error('🚨 Error al procesar el pedido:', error);
                                            toast.error('Error al procesar el pedido');
                                        } finally {
                                            setIsSubmitting(false);
                                        }
                                    }}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Procesando...
                                        </>
                                    ) : (
                                        "Confirmar pedido"
                                    )}
                                </Button>



                            </CardContent>
                        </Card>
                    )}
                </div>

                <div className="lg:col-span-1">
                    <OrderSummary
                        showShippingMethod={true}
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
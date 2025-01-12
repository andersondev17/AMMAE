'use client';

import { useCart } from '@/hooks/cart/useCart';
import { checkoutFormSchema, type CheckoutFormValues } from '@/lib/validations/checkoutFormSchema';
import { useWhatsApp } from '@/services/whatsAppService';
import { PaymentMethod } from '@/types/checkout.types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { OrderSummary } from './OrderSummary';
import { PaymentSelector } from './PaymentSelector';
import { Steps } from './Steps';

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

interface CheckoutFormProps {
    onSubmitComplete?: () => void;
}

export function CheckoutForm({ onSubmitComplete }: CheckoutFormProps) {
    const router = useRouter();
    const { sendOrderNotification } = useWhatsApp();
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
    const { items, total: subtotal ,shipping, clearCart} = useCart();

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

    const handlePaymentMethodSelect = async (method: PaymentMethod) => {
        setPaymentMethod(method);
        if (method === PaymentMethod.CONTRA_ENTREGA) {
            try {
                const formData = form.getValues();

                // Obtener detalles del cliente del formulario
                const customerDetails = {
                    name: formData.fullName,
                    phone: formData.phone,
                    address: `${formData.address.street}, ${formData.address.city}`,
                    shippingMethod: formData.shippingMethod === 'express' ? 'Express (2-3 días)' : 'Estándar (5-7 días)'
                };

                const result = await sendOrderNotification(
                    items,
                    customerDetails
                );

                if (result.success) {
                    toast.success('Pedido enviado por WhatsApp');
                    clearCart(); // Limpiar el carrito después de un pedido exitoso
                    router.push('/order/success'); // Redirigir a página de éxito
                } else {
                    toast.error('Error al enviar el pedido. Intente nuevamente.');
                }
            } catch (error) {
                console.error('Error al procesar la orden:', error);
                toast.error('No se pudo procesar el pedido');
            }
        } else {
            setStep(3);
        }
    };

    const handleFormSubmit = async (data: CheckoutFormValues) => {
        try {
            setIsSubmitting(true);
            await new Promise(resolve => setTimeout(resolve, 1500));

            toast.success('Información guardada correctamente');
            setStep(2);
            onSubmitComplete?.();
        } catch (error) {
            console.error('Error al procesar el pedido:', error);
            toast.error('Error al procesar el pedido');
        } finally {
            setIsSubmitting(false);
        }
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
                        <PaymentSelector
                            selectedMethod={paymentMethod}
                            onSelect={handlePaymentMethodSelect}
                        />
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
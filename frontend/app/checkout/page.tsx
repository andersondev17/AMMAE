// components/checkout/CheckoutForm.tsx
'use client';

import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/form/card';
import { Input } from '@/components/ui/form/input';
import { Separator } from '@/components/ui/form/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
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
import { OrderSummary } from '../../components/checkout/OrderSummary';
import { PaymentSelector } from '../../components/checkout/PaymentSelector';
import { Steps } from '../../components/checkout/Steps';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '../../components/ui/form/form';

export default function CheckoutForm() {
    const router = useRouter();
    const { items, total: cartTotal } = useCart();
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
    const { sendOrderNotification } = useWhatsApp();
    const { clearCart } = useCart();
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

    if (items.length === 0) {
        router.push('/');
        return null;
    }

    const subtotal = items.reduce((acc, item) => acc + (item.precio * item.quantity), 0);
    const shipping = form.watch('shippingMethod') === 'express' ? 15 : 5;
    const total = subtotal + shipping;

    const handlePaymentMethodSelect = async (method: PaymentMethod) => {
        setPaymentMethod(method);
        
        if (method === PaymentMethod.CONTRA_ENTREGA) {
            try {
                // Obtener los datos del formulario
                const formData = form.getValues();
                
                // Preparar los detalles del cliente
                const customerDetails = {
                    name: formData.fullName,
                    phone: formData.phone,
                    address: `${formData.address.street}, ${formData.address.city}, ${formData.address.state}`,
                    shippingMethod: formData.shippingMethod === 'express' 
                        ? 'Express (2-3 días)' 
                        : 'Estándar (5-7 días)'
                };

                // Preparar los items con sus totales
                const orderItems = items.map(item => ({
                    ...item,
                    itemTotal: item.precio * item.quantity
                }));

                // Enviar la notificación usando el servicio
                const result = await sendOrderNotification(orderItems, customerDetails);

                if (result.success) {
                    toast.success('¡Pedido enviado correctamente!');
                    // Limpiar carrito y redirigir
                    clearCart();
                    router.push('/order/success');
                } else {
                    toast.error(result.error || 'Error al enviar el pedido');
                }
            } catch (error) {
                console.error('Error al procesar el pedido:', error);
                toast.error('No se pudo procesar el pedido. Por favor, intente nuevamente.');
            }
        } else {
            setStep(3);
        }
    };

    async function onSubmit(data: CheckoutFormValues) {
        try {
            setIsSubmitting(true);
            // Aquí iría la lógica de envío al backend
            await new Promise(resolve => setTimeout(resolve, 2000));

            setStep(2); // Avanzar al siguiente paso
            toast.success('Información guardada correctamente');
        } catch (error) {
            toast.error('Error al procesar el pedido');
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container max-w-7xl mx-auto px-4">
                <Steps currentStep={step} />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
                                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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

                                            <Separator className="my-4" />

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

                                            <Separator className="my-4" />

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
                                                    'Confirmar pedido'
                                                )}
                                            </Button>
                                        </form>
                                    </Form>
                                </CardContent>
                            </Card>

                            
                        )}

                        {step === 2 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Método de pago</CardTitle>
                                    <CardDescription>
                                        Seleccione cómo desea pagar su pedido
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <PaymentSelector
                                        selectedMethod={paymentMethod}
                                        onSelect={handlePaymentMethodSelect}
                                    />
                                </CardContent>
                            </Card>
                        )}

                        {step === 3 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Confirmación</CardTitle>
                                    <CardDescription>
                                        Revise su pedido antes de confirmar
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {/* Aquí va el resumen final y botón de confirmar */}
                                </CardContent>
                            </Card>
                        )}
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
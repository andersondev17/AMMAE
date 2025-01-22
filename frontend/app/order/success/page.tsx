// app/order/success/page.tsx
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/form/card';
import { OrderService } from '@/services/orderService';
import { OrderDetailsData } from '@/types/checkout.types';
import { CheckCircle } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function OrderSuccessPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const orderNumber = searchParams.get('orderNumber');
    const [orderDetails, setOrderDetails] = useState<OrderDetailsData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!orderNumber) {
            router.push('/');
            return;
        }

        const fetchOrderDetails = async () => {
            try {
                const details = await OrderService.getOrder(orderNumber);

            } catch (error) {
                console.error('Error fetching order details:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrderDetails();
    }, [orderNumber, router]);

    if (loading) {
        return <div className="flex justify-center items-center min-h-screen">
            <span className="loading loading-spinner loading-lg"></span>
        </div>;
    }

    return (
        <div className="flex items-center justify-center w-screen h-screen px-4">
            <Card>
                <CardHeader className="text-center">
                    <CheckCircle className="w-16 h-16 mx-auto text-green-500 mb-4" />
                    <CardTitle className="text-2xl font-bold">
                        ¡Pedido Confirmado!
                    </CardTitle>
                    <p className="text-gray-600 mt-2">
                        Tu número de pedido es: <span className="font-bold">{orderNumber}</span>
                    </p>
                </CardHeader>

                <CardContent className="space-y-6">
                    {orderDetails && (
                        <>
                            <div className="border-t border-b py-4 space-y-2">
                                <h3 className="font-semibold">Detalles del envío</h3>
                                <p>{orderDetails.customerDetails.name}</p>
                                <p>{orderDetails.customerDetails.phone}</p>
                                <p>{orderDetails.customerDetails.address}</p>
                                <p>Método de envío: {orderDetails.customerDetails.shippingMethod}</p>
                            </div>

                            <div className="space-y-4">
                                <h3 className="font-semibold">Resumen del pedido</h3>
                                {orderDetails.items.map((item) => (
                                    <div key={item._id} className="flex justify-between">
                                        <span>
                                            {item.quantity}x {item.nombre}
                                        </span>
                                        <span>${(item.precio * item.quantity).toFixed(2)}</span>
                                    </div>
                                ))}
                                <div className="border-t pt-4">
                                    <div className="flex justify-between font-bold">
                                        <span>Total</span>
                                        <span>${orderDetails.total.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="text-center space-y-4 mt-8">
                                <p className="text-sm text-gray-600">
                                    Te hemos enviado un correo electrónico con los detalles de tu pedido.
                                </p>
                                <Button
                                    onClick={() => router.push('/')}
                                    className="w-full"
                                >
                                    Volver a la tienda
                                </Button>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
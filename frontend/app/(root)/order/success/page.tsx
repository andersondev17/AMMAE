'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/form/card';
import { CheckCircle, Package } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

function OrderSuccessContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const orderNumber = searchParams.get('orderNumber');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        
        // Redirigir si no hay orderNumber
        if (!orderNumber) {
            router.replace('/');
        }
    }, [orderNumber, router]);

    if (!mounted || !orderNumber) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <CheckCircle className="w-16 h-16 mx-auto text-green-500 mb-4" />
                    <CardTitle className="text-2xl font-bold text-gray-900">
                        ¡Pedido Confirmado!
                    </CardTitle>
                    <p className="text-gray-600 mt-2">
                        Tu número de pedido es: 
                        <span className="font-bold text-blue-600 block mt-1">
                            {orderNumber}
                        </span>
                    </p>
                </CardHeader>

                <CardContent className="space-y-6">
                    <div className="bg-blue-50 rounded-lg p-4 text-center">
                        <Package className="w-8 h-8 mx-auto text-blue-600 mb-2" />
                        <h3 className="font-semibold text-blue-900">¿Qué sigue?</h3>
                        <p className="text-sm text-blue-700 mt-1">
                            Te contactaremos por WhatsApp para confirmar los detalles de tu pedido.
                        </p>
                    </div>

                    <div className="space-y-3">
                        <h3 className="font-semibold text-gray-900">Nuestras garantías:</h3>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li className="flex items-center">
                                <span className="w-2 h-2 bg-green-500 rounded-full mr-3" />
                                Confirmación por WhatsApp
                            </li>
                            <li className="flex items-center">
                                <span className="w-2 h-2 bg-green-500 rounded-full mr-3" />
                                Envío seguro y rastreado
                            </li>
                            <li className="flex items-center">
                                <span className="w-2 h-2 bg-green-500 rounded-full mr-3" />
                                Garantía de 30 días
                            </li>
                        </ul>
                    </div>

                    {/* ✅ ACCIONES */}
                    <div className="space-y-3">
                        <Button
                            onClick={() => router.push('/')}
                            className="w-full"
                            size="lg"
                        >
                            Continuar comprando
                        </Button>
                        
                    </div>

                    <div className="text-center pt-4 border-t">
                        <p className="text-xs text-gray-500">
                            ¿Necesitas ayuda? Contáctanos por WhatsApp
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default function OrderSuccessPage() {
    return (
        <Suspense 
            fallback={
                <div className="min-h-screen flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500" />
                </div>
            }
        >
            <OrderSuccessContent />
        </Suspense>
    );
}
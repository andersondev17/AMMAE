import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { OrderSummaryProps } from '@/types/checkout.types';
import Image from 'next/image';

export const OrderSummary = ({ items, subtotal, shipping, total }: OrderSummaryProps) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Resumen de la orden</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Lista de productos */}
                <div className="space-y-4">
                    {items.map((item) => (
                        <div key={item._id} className="flex items-start space-x-4">
                            <div className="relative h-16 w-16 overflow-hidden rounded">
                                <Image
                                    src="/api/placeholder/64/64"
                                    alt={item.nombre}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="flex-1 space-y-1">
                                <h3 className="text-sm font-medium">{item.nombre}</h3>
                                <p className="text-sm text-gray-500">Cantidad: {item.quantity}</p>
                                <p className="text-sm font-medium">${item.precio.toFixed(2)}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <Separator />

                {/* Resumen de costos */}
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span>Subtotal</span>
                        <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span>Envío</span>
                        <span>{shipping === 0 ? 'Gratis' : `$${shipping.toFixed(2)}`}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-base font-medium">
                        <span>Total</span>
                        <span>${total.toFixed(2)}</span>
                    </div>
                </div>

                {/* Políticas y garantías */}
                <div className="rounded-lg bg-gray-50 p-4">
                    <ul className="space-y-2 text-sm text-gray-600">
                        <li className="flex items-center">
                            <span className="mr-2">✓</span>
                            Envío gratis en compras mayores a $100
                        </li>
                        <li className="flex items-center">
                            <span className="mr-2">✓</span>
                            Garantía de devolución de 30 días
                        </li>
                        <li className="flex items-center">
                            <span className="mr-2">✓</span>
                            Pago seguro y protegido
                        </li>
                    </ul>
                </div>
            </CardContent>
        </Card>
    );
};
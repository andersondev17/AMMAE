import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/form/card';
import { Separator } from '@/components/ui/form/separator';
import { useCart } from '@/hooks/cart/useCart';
import { OrderSummaryProps } from '@/types/checkout.types';
import { getProductImages } from '@/utils/imageUtils';
import { formatPrice } from '@/utils/price';
import Image from 'next/image';

export function OrderSummary({ showShippingMethod = true, shippingMethod = 'standard' }: OrderSummaryProps) {
    const { items, total: subtotal } = useCart();
    const shipping = shippingMethod === 'express' ? 15000 : 5000;
    const total = subtotal + shipping;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Resumen de la orden</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-4">
                    {items.map((item) => {
                        const { primary: imageUrl } = getProductImages(item);

                        return (
                            <div key={`${item._id}-${item.selectedSize}-${item.selectedColor}`}
                                className="flex items-start space-x-4">
                                <div className="relative h-16 w-16 overflow-hidden rounded">
                                    <Image
                                        src={imageUrl}
                                        alt={item.nombre}
                                        fill
                                        className="object-cover"
                                        sizes="64px"
                                    />
                                </div>
                                <div className="flex-1 space-y-1">
                                    <h3 className="text-sm font-medium">{item.nombre}</h3>
                                    <p className="text-sm text-gray-500">
                                        Cantidad: {item.quantity}
                                        {item.selectedSize && ` • Talla: ${item.selectedSize}`}
                                        {item.selectedColor && ` • Color: ${item.selectedColor}`}
                                    </p>
                                    <div className="flex justify-between">
                                        <p className="text-sm text-gray-500">
                                            {formatPrice(item.price)} x {item.quantity}
                                        </p>
                                        <p className="text-sm font-medium">
                                            {formatPrice(item.price * item.quantity)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <Separator />

                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span>Subtotal</span>
                        <span>{formatPrice(subtotal)}</span>
                    </div>
                    {showShippingMethod && (
                        <div className="flex justify-between text-sm">
                            <span>Envío ({shippingMethod === 'express' ? 'Express' : 'Estándar'})</span>
                            <span>
                                {subtotal > 99000
                                    ? 'Gratis'
                                    : formatPrice(shipping)}
                            </span>
                        </div>
                    )}
                    <Separator />
                    <div className="flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span>{formatPrice(total)}</span>
                    </div>
                </div>

                {/* ✅ GARANTÍAS Y POLÍTICAS */}
                <div className="rounded-lg bg-gray-50 p-4">
                    <ul className="space-y-2 text-sm text-gray-600">
                        <li className="flex items-center">
                            <span className="mr-2">✓</span>
                            Envío gratis en compras mayores a {formatPrice(99000)}
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
}
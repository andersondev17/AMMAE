import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/form/card';
import { PaymentMethod } from '@/types/checkout.types';
import { CreditCard, QrCode, Truck } from 'lucide-react';

interface PaymentSelectorProps {
    selectedMethod: PaymentMethod | null;
    onSelect: (method: PaymentMethod) => void;
}

export const PaymentSelector = ({ selectedMethod, onSelect }: PaymentSelectorProps) => {
    const paymentMethods = [
        {
            id: PaymentMethod.CONTRA_ENTREGA,
            title: 'Pago contra entrega',
            description: 'Paga en efectivo cuando recibas tu pedido',
            icon: Truck
        },
        {
            id: PaymentMethod.TRANSFERENCIA,
            title: 'Transferencia bancaria',
            description: 'Realiza una transferencia a nuestra cuenta',
            icon: CreditCard
        },
        {
            id: PaymentMethod.QR,
            title: 'Pago con QR',
            description: 'Escanea el código QR para pagar',
            icon: QrCode
        }
    ];

    return (
        <div className="space-y-4">
            <h2 className="text-lg font-semibold">Selecciona tu método de pago</h2>
            <div className="grid gap-4 md:grid-cols-3">
                {paymentMethods.map((method) => {
                    const Icon = method.icon;
                    const isSelected = selectedMethod === method.id;

                    return (
                        <Card
                            key={method.id}
                            className={`cursor-pointer transition-all ${isSelected ? 'ring-2 ring-blue-600' : 'hover:border-blue-200'
                                }`}
                            onClick={() => onSelect(method.id)}
                        >
                            <CardHeader>
                                <Icon className={`h-8 w-8 ${isSelected ? 'text-blue-600' : 'text-gray-400'}`} />
                                <CardTitle className="text-lg">{method.title}</CardTitle>
                                <CardDescription>{method.description}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button
                                    variant={isSelected ? "default" : "outline"}
                                    className="w-full"
                                    onClick={() => onSelect(method.id)}
                                >
                                    {isSelected ? 'Seleccionado' : 'Seleccionar'}
                                </Button>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
};
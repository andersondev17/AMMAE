// components/checkout/PaymentDetails.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/form/card';
import { PaymentMethod } from '@/types/checkout.types';
import { Upload } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

interface PaymentDetailsProps {
    method: PaymentMethod;
    onComprobanteUpload: (file: File) => void;
}

export const PaymentDetails = ({ method, onComprobanteUpload }: PaymentDetailsProps) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
            onComprobanteUpload(e.target.files[0]);
        }
    };

    const renderPaymentDetails = () => {
        switch (method) {
            case PaymentMethod.QR:
                return (
                    <div className="text-center space-y-4">
                        <Image
                            src="/qr-payment.png" // Asegúrate de tener esta imagen en tu carpeta public
                            alt="Código QR para pago"
                            width={300}
                            height={300}
                            className="mx-auto"
                        />
                        <p className="text-sm text-gray-600">
                            Escanea el código QR para realizar tu pago
                        </p>
                    </div>
                );

            case PaymentMethod.TRANSFERENCIA:
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-medium">Datos bancarios:</h4>
                            <ul className="space-y-2 mt-2">
                                <li>Banco: BANCOLOMBIA</li>
                                <li>Tipo de cuenta: Ahorros</li>
                                <li>Número: 123456789</li>
                                <li>Titular: AMMAE S.A.S</li>
                                <li>NIT: 900.123.456-7</li>
                            </ul>
                        </div>
                        <div className="flex justify-center items-center">
                            <img
                                src="/assets/images/bancolombia.jpg"
                                alt="Banco"
                                className="rounded-lg shadow-lg max-w-full h-auto"
                            />
                        </div>
                    </div>

                );

            default:
                return null;
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Detalles del pago</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {renderPaymentDetails()}

                {(method === PaymentMethod.QR || method === PaymentMethod.TRANSFERENCIA) && (
                    <div className="mt-6">
                        <p className="text-sm text-gray-600 mb-2">
                        Una vez realizado el pago, guarda el comprobante. Lo necesitarás en el siguiente paso.

</p>
                        <label className="cursor-pointer">
                            <div className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-500 transition-colors">
                                <div className="space-y-2 text-center">
                                    <Upload className="mx-auto h-8 w-8 text-gray-400" />
                                    <p className="text-sm text-gray-600">
                                        {selectedFile ? selectedFile.name : 'Seleccionar comprobante'}
                                    </p>
                                </div>
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="image/*,.pdf"
                                    onChange={handleFileChange}
                                />
                            </div>
                        </label>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
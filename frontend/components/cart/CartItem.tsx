import { Product } from "@/types";
import { Minus, Plus, X } from "lucide-react";
import Image from "next/image";
import { memo } from "react";
import { Button } from "../ui/button";

interface CartItemProps {
    product: Product;
    quantity: number;
    onRemove: (productId: string) => void;
    onUpdateQuantity: (productId: string, quantity: number) => void;
}

export const CartItem = memo(({
    product,
    quantity,
    onRemove,
    onUpdateQuantity
}: CartItemProps) => {
    return (
        <div className="flex py-6 border-b">
            {/* Imagen del producto */}
            <div className="relative h-24 w-24 rounded-md overflow-hidden">
                <Image
                    fill
                    src={product.imagenes[0]}
                    alt={product.nombre}
                    className="object-cover object-center"
                />
            </div>

            {/* Información del producto */}
            <div className="ml-4 flex flex-1 flex-col">
                <div className="flex justify-between">
                    <div>
                        <h3 className="font-robert-medium text-sm font-medium text-gray-900">
                            {product.nombre}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500 font-robert-regular">
                            {product.categoria}
                        </p>
                    </div>
                    <div className="mt-1 flex flex-wrap font-robert-regulargap-2 text-xs text-gray-500">
                            {product.selectedSize && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-gray-100">
                                    Talla: {product.selectedSize}
                                </span>
                            )}
                            {product.selectedColor && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-gray-100">
                                    Color: {product.selectedColor}
                                </span>
                            )}
                        </div>
                    <Button
                        onClick={() => onRemove(product._id)}
                        variant="ghost"
                        className="text-gray-500 hover:text-gray-700 font-general"
                        aria-label={`Eliminar ${product.nombre} del carrito`}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>

                {/* Controles de cantidad y precio */}
                <div className="flex items-center justify-between mt-auto font-general">
                    <div className="flex items-center border rounded-md">
                        <Button
                            onClick={() => onUpdateQuantity(product._id, quantity - 1)}
                            disabled={quantity <= 1}
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                        >
                            <Minus className="h-3 w-3" />
                        </Button>
                        <span className="px-3 text-sm">{quantity}</span>
                        <Button
                            onClick={() => onUpdateQuantity(product._id, quantity + 1)}
                            disabled={quantity >= product.stock}
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                        >
                            <Plus className="h-3 w-3" />
                        </Button>
                    </div>
                    <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                            ${(product.precio * quantity)}
                        </p>
                        {product.enOferta && product.precioOferta && (
                            <p className="text-xs text-red-500 line-through">
                                ${(product.precioOferta * quantity)}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
});

CartItem.displayName = 'CartItem';
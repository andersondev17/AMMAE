'use client';
import { useCart } from "@/hooks/useCart";
import { ShoppingBag } from "lucide-react";
import { memo, useCallback, useMemo } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "../ui/sheet";
import { CartItem } from "./CartItem";

export const Cart = memo(() => {
    const {
        items,
        total,
        itemCount,
        isOpen,
        onClose,
        removeItem,
        updateQuantity,
        clearCart
    } = useCart();

    const isEmpty = useMemo(() => items.length === 0, [items]);

    const handleCheckout = useCallback(async () => {
        try {
            // Aquí irá la lógica de checkout
            toast.success('Procesando orden...');
        } catch (error) {
            toast.error('Error al procesar la orden');
        }
    }, []);

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className="flex w-full flex-col pr-0 sm:max-w-lg">
                <SheetHeader className="space-y-2.5 pr-6">
                    <SheetTitle className="flex items-center gap-2">
                        <ShoppingBag className="h-5 w-5" />
                        Mi Carrito ({itemCount})
                    </SheetTitle>
                </SheetHeader>

                {isEmpty ? (
                    <div className="flex h-full flex-col items-center justify-center space-y-4">
                        <ShoppingBag className="h-12 w-12 text-gray-400" />
                        <p className="text-lg font-medium text-gray-600">
                            Tu carrito está vacío
                        </p>
                        <Button
                            onClick={onClose}
                            className="rounded-full"
                            size="sm"
                        >
                            Continuar comprando
                        </Button>
                    </div>
                ) : (
                    <>
                        <div className="flex-1 overflow-y-auto pr-6">
                            <div className="space-y-6 pb-24">
                                {items.map((item) => (
                                    <CartItem
                                        key={`${item._id}-${item.selectedSize}-${item.selectedColor}`}
                                        product={item}
                                        quantity={item.quantity}
                                        onRemove={removeItem}
                                        onUpdateQuantity={updateQuantity}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="sticky bottom-0 w-full bg-white p-6 shadow-lg">
                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <div className="flex justify-between text-sm">
                                        <span>Subtotal</span>
                                        <span>${total.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span>Envío</span>
                                        <span className="text-green-500">Gratis</span>
                                    </div>
                                    <Separator className="my-2" />
                                    <div className="flex justify-between text-base font-medium">
                                        <span>Total</span>
                                        <span>${total.toFixed(2)}</span>
                                    </div>
                                </div>

                                <Button
                                    onClick={handleCheckout}
                                    className="w-full rounded-full bg-black hover:bg-gray-800"
                                    disabled={isEmpty}
                                >
                                    Finalizar compra
                                </Button>
                                
                                <Button
                                    onClick={clearCart}
                                    variant="outline"
                                    className="w-full rounded-full"
                                    disabled={isEmpty}
                                >
                                    Vaciar carrito
                                </Button>
                            </div>
                        </div>
                    </>
                )}
            </SheetContent>
        </Sheet>
    );
});

Cart.displayName = 'Cart';
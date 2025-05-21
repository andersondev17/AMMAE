'use client';
import { useCart } from "@/hooks/cart/useCart";
import { ShoppingBag } from "lucide-react";
import { useRouter } from 'next/navigation';
import { memo, useCallback, useMemo } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Separator } from "../ui/form/separator";
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
    const router = useRouter();
    const handleCheckout = useCallback(async () => {
        try {
            onClose();//cerrando carrito
            router.push('/checkout');
            toast.success('Procesando orden...');
        } catch (error) {
            console.error('Error al procesar la orden:', error);
            toast.error('Error al procesar la orden');
        }
    }, [router, onClose]);

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className="flex w-full flex-col pr-0 sm:max-w-lg">
                <SheetHeader className="space-y-2.5 pr-6">
                    <SheetTitle className=" font-general tracking-wider flex items-center gap-2">
                        <ShoppingBag className="h-5 w-5" />
                        Mi Carrito ({itemCount})
                    </SheetTitle>
                </SheetHeader>

                {isEmpty ? (
                    <div className="flex h-full flex-col items-center justify-center space-y-4">
                        <ShoppingBag className="h-12 w-12 text-gray-400" />
                        <p className="text-lg font-robert-regular font-medium text-gray-600">
                            Tu carrito está vacío
                        </p>
                        <Button
                            onClick={onClose}
                            className="font-general tracking-wider rounded-full"
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
                                        product={{
                                            ...item,
                                            selectedSize: item.selectedSize,
                                            selectedColor: item.selectedColor
                                        }} 
                                        quantity={item.quantity}

                                        onRemove={removeItem}
                                        onUpdateQuantity={updateQuantity}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="sticky bottom-0 w-full bg-white pr-4 ">
                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <div className="font-zentry tracking-wider flex justify-between text-sm space-y-1">
                                        <span>Subtotal</span>
                                        <span className="font-bold">${total}</span>
                                    </div>
                                    <div className="flex justify-between text-sm ">
                                        <span>Envío</span>
                                        <span className="text-green-500">Gratis</span>
                                    </div>
                                    <Separator className="my-2" />
                                    <div className="font-zentry font-bold tracking-wider flex justify-between text-base ">
                                        <span>Total</span>
                                        <span >${total}</span>
                                    </div>
                                </div>

                                <Button
                                    onClick={handleCheckout}
                                    className="font-zentry tracking-wider w-full rounded-full bg-black hover:bg-gray-800"
                                    disabled={isEmpty}
                                >
                                    CHECKOUT
                                </Button>

                               {/*  <Button
                                    onClick={clearCart}
                                    variant="outline"
                                    className="font-zentry tracking-wider w-full rounded-full"
                                    disabled={isEmpty}
                                >
                                    Vaciar carrito
                                </Button> */}
                            </div>
                        </div>
                    </>
                )}
            </SheetContent>
        </Sheet>
    );
});

Cart.displayName = 'Cart';
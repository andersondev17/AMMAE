'use client';
import { useCart } from "@/hooks/cart/useCart";
import { formatPrice } from "@/utils/price";
import { ShoppingBag } from "lucide-react";
import { useRouter } from 'next/navigation';
import { memo, useCallback, useMemo } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Separator } from "../ui/form/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle, } from "../ui/sheet";
import { CartItem } from "./CartItem";

export const Cart = memo(() => {
    // ✅ CORREGIDO: Usar métodos correctos del nuevo store
    const { 
        items, 
        total, 
        shipping, 
        itemCount, 
        isOpen, 
        closeCart,    // ✅ Era onClose
        openCart,     // ✅ Para uso interno si es necesario
        removeItem, 
        updateQuantity, 
        clearCart 
    } = useCart();

    const isEmpty = useMemo(() => items.length === 0, [items]);
    const router = useRouter();

    // ✅ TOTAL FINAL CON ENVÍO
    const finalTotal = total + shipping;

    const handleCheckout = useCallback(async () => {
        try {
            closeCart(); // ✅ CORREGIDO: closeCart en lugar de onClose
            router.push('/checkout');
            toast.success('Redirigiendo al checkout...');
        } catch (error) {
            console.error('Error al procesar la orden:', error);
            toast.error('Error al procesar la orden');
        }
    }, [router, closeCart]); // ✅ CORREGIDO: closeCart en dependencias

    return (
        <Sheet open={isOpen} onOpenChange={closeCart}>
            <SheetContent className="flex w-full flex-col pr-0 sm:max-w-lg">
                <SheetHeader className="space-y-2.5 pr-6">
                    <SheetTitle className="font-general tracking-wider flex items-center gap-2">
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
                            onClick={closeCart} // ✅ CORREGIDO: closeCart
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
                                        product={item}
                                        quantity={item.quantity}
                                        onRemove={removeItem}
                                        onUpdateQuantity={updateQuantity}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="sticky bottom-0 w-full bg-white pr-4">
                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <div className="tracking-wider flex justify-between text-sm space-y-1">
                                        <span className="font-robert-medium tracking-widest">Subtotal</span>
                                        <span className="font-bold font-robert-medium">{formatPrice(total)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm font-robert-medium tracking-widest">
                                        <span>Envío</span>
                                        <span className={shipping === 0 ? "text-green-500" : ""}>
                                            {shipping === 0 ? 'Gratis' : formatPrice(shipping)}
                                        </span>
                                    </div>
                                    <Separator className="my-2" />
                                    <div className="font-bold tracking-wider flex justify-between text-base">
                                        <span className="font-robert-medium tracking-widest">Total</span>
                                        <span className="font-robert-medium">{formatPrice(finalTotal)}</span>
                                    </div>
                                </div>

                                <Button
                                    onClick={handleCheckout}
                                    className="font-general tracking-wider w-full bg-black hover:bg-white text-white border border-black hover:text-black transition-colors"
                                    disabled={isEmpty}
                                >
                                    CHECKOUT
                                </Button>

                                <Button
                                    onClick={clearCart}
                                    className="font-general tracking-wider w-full bg-white text-black border border-black hover:bg-black hover:text-white transition-colors"
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
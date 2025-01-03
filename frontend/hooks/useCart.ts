// hooks/useCart.ts
import { cartEvents } from '@/lib/cart/CartEventManager';
import { Product } from '@/types';
import { toast } from 'sonner';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem extends Product {
    quantity: number;
    selectedSize?: string;
    selectedColor?: string;
}

interface CartStore {
    items: CartItem[];
    total: number;
    itemCount: number;
    isOpen: boolean;
    addItem: (product: Product, options?: { size?: string; color?: string }) => void;
    removeItem: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    onClose: () => void;
    onOpen: () => void;
}

export const useCart = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],
            total: 0,
            itemCount: 0,
            isOpen: false,

            addItem: (product, options = {}) => {
                const { size, color } = options;
                const currentItems = get().items;
                
                // Verificar stock
                if (product.stock <= 0) {
                    toast.error('Producto agotado');
                    return;
                }

                const existingItem = currentItems.find(item => 
                    item._id === product._id && 
                    item.selectedSize === size && 
                    item.selectedColor === color
                );

                let updatedItems: CartItem[];

                if (existingItem) {
                    // Verificar que no exceda el stock disponible
                    if (existingItem.quantity >= product.stock) {
                        toast.error('No hay más unidades disponibles');
                        return;
                    }

                    updatedItems = currentItems.map(item =>
                        item._id === product._id &&
                        item.selectedSize === size &&
                        item.selectedColor === color
                            ? { ...item, quantity: Math.min(item.quantity + 1, item.stock) }
                            : item
                    );
                } else {
                    const newItem: CartItem = {
                        ...product,
                        quantity: 1,
                        selectedSize: size,
                        selectedColor: color,
                    };
                    updatedItems = [...currentItems, newItem];
                }

                set({
                    items: updatedItems,
                    total: calculateTotal(updatedItems),
                    itemCount: calculateItemCount(updatedItems),
                    isOpen: true,
                });

                // Notificar a los observadores
                cartEvents.notify('itemAdded', {
                    product,
                    size,
                    color,
                    cart: get()
                });

                toast.success('Producto añadido al carrito');
            },

            removeItem: (productId) => {
                const currentItems = get().items;
                const updatedItems = currentItems.filter(item => item._id !== productId);
                
                set({
                    items: updatedItems,
                    total: calculateTotal(updatedItems),
                    itemCount: calculateItemCount(updatedItems),
                });

                cartEvents.notify('itemRemoved', {
                    productId,
                    cart: get()
                });

                toast.success('Producto eliminado del carrito');
            },

            updateQuantity: (productId, quantity) => {
                const currentItems = get().items;
                const item = currentItems.find(i => i._id === productId);

                if (item && quantity > item.stock) {
                    toast.error('No hay suficientes unidades disponibles');
                    return;
                }

                const updatedItems = currentItems.map(item =>
                    item._id === productId
                        ? { ...item, quantity: Math.max(1, Math.min(quantity, item.stock)) }
                        : item
                );

                set({
                    items: updatedItems,
                    total: calculateTotal(updatedItems),
                    itemCount: calculateItemCount(updatedItems),
                });

                cartEvents.notify('quantityUpdated', {
                    productId,
                    quantity,
                    cart: get()
                });
            },

            clearCart: () => {
                set({ items: [], total: 0, itemCount: 0 });
                cartEvents.notify('cartCleared', { cart: get() });
                toast.success('Carrito vaciado');
            },

            onClose: () => set({ isOpen: false }),
            onOpen: () => set({ isOpen: true }),
        }),
        {
            name: 'cart-storage',
            skipHydration: true,
        }
    )
);

const calculateTotal = (items: CartItem[]): number => {
    return items.reduce((total, item) => {
        const price = item.enOferta && item.precioOferta
            ? item.precioOferta
            : item.precio;
        return total + (price * item.quantity);
    }, 0);
};

const calculateItemCount = (items: CartItem[]): number => {
    return items.reduce((count, item) => count + item.quantity, 0);
};
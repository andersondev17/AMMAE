// hooks/cart/useCart.ts - ELIMINANDO COMPLEJIDAD
import { Product } from '@/types';
import { CartItem, CartOptions } from '@/types/cart.types';
import { toast } from 'sonner';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartStore {
    items: CartItem[];
    isOpen: boolean;
    itemCount: number;
    total: number;
    shipping: number;
    
    // Notification inline - no store separado
    showNotification: boolean;
    lastAdded: Product | null;
    
    addItem: (product: Product, options?: CartOptions) => void;
    removeItem: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    openCart: () => void;
    closeCart: () => void;
    hideNotification: () => void;
}

// One-liners para cálculos
const finalPrice = (p: Product) => p.enOferta && p.precioOferta ? p.precioOferta : p.precio;
const totals = (items: CartItem[]) => ({ 
    itemCount: items.reduce((s, i) => s + i.quantity, 0),
    total: items.reduce((s, i) => s + i.itemTotal, 0)
});
const shipping = (total: number) => total > 99000 ? 0 : 8000;

export const useCart = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],
            total: 0,
            itemCount: 0,
            isOpen: false,
            shipping: 8000,
            showNotification: false,
            lastAdded: null,

            addItem: (product, options = {}) => {
                if (product.stock <= 0) {
                    toast.error('Sin stock');
                    return;
                }

                const { size, color, quantity = 1 } = options;
                const key = `${product._id}-${size || ''}-${color || ''}`;
                const price = finalPrice(product);
                
                set(state => {
                    const existingIndex = state.items.findIndex(
                        item => `${item._id}-${item.selectedSize || ''}-${item.selectedColor || ''}` === key
                    );

                    let newItems = [...state.items];
                    
                    if (existingIndex >= 0) {
                        const newQty = newItems[existingIndex].quantity + quantity;
                        if (newQty > product.stock) {
                            toast.error('Stock insuficiente');
                            return state;
                        }
                        newItems[existingIndex] = {
                            ...newItems[existingIndex],
                            quantity: newQty,
                            itemTotal: price * newQty
                        };
                    } else {
                        newItems.push({
                            ...product,
                            quantity,
                            selectedSize: size,
                            selectedColor: color,
                            price,
                            itemTotal: price * quantity
                        });
                    }

                    const { itemCount, total } = totals(newItems);
                    
                    // Auto-hide notification
                    setTimeout(() => set({ showNotification: false, lastAdded: null }), 5000);
                    
                    return {
                        items: newItems,
                        itemCount,
                        total,
                        shipping: shipping(total),
                        showNotification: true,
                        lastAdded: { ...product, selectedSize: size, selectedColor: color }
                    };
                });
            },

            updateQuantity: (id, qty) => set(state => {
                const newItems = state.items.map(item => 
                    item._id === id 
                        ? { ...item, quantity: qty, itemTotal: finalPrice(item) * qty }
                        : item
                );
                const { itemCount, total } = totals(newItems);
                return { items: newItems, itemCount, total, shipping: shipping(total) };
            }),

            removeItem: (id) => set(state => {
                const newItems = state.items.filter(item => item._id !== id);
                const { itemCount, total } = totals(newItems);
                return { items: newItems, itemCount, total, shipping: shipping(total) };
            }),

            clearCart: () => set({ items: [], itemCount: 0, total: 0, shipping: 8000 }),
            openCart: () => set({ isOpen: true }),
            closeCart: () => set({ isOpen: false }),
            hideNotification: () => set({ showNotification: false, lastAdded: null })
        }),
        { name: 'cart', partialize: state => ({ items: state.items }) }
    )
);
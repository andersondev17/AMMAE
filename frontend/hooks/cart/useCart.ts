import { Product } from '@/types';
import { CartItem, CartOptions } from '@/types/cart.types';
import { getProductPrice } from '@/utils/price';
import { toast } from 'sonner';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// CONFIGURACIÓN CENTRALIZADA
const CART = {
    MAX_QTY: 10,
    FREE_SHIP_MIN: 99_000,
    SHIP_COST: 8_000,
    NOTIFY_DELAY: 5_000
} as const;

const getKey = (id: string, size = '', color = '') => `${id}-${size}-${color}`;

// 🧮 CALCULADORA - O(n) 
const calcCartState = (items: CartItem[]) => {
    const totals = items.reduce((acc, item) => {
        acc.itemCount += item.quantity;
        acc.total += item.itemTotal;
        return acc;
    }, { itemCount: 0, total: 0 });

    return {
        ...totals,
        shipping: totals.total >= CART.FREE_SHIP_MIN ? 0 : CART.SHIP_COST
    };
};

//  TIMER MANAGER
let timer: NodeJS.Timeout | null = null;
const setTimer = (fn: () => void) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => { fn(); timer = null; }, CART.NOTIFY_DELAY);
};

interface CartStore {
    // State
    items: CartItem[];
    isOpen: boolean;
    itemCount: number;
    total: number;
    shipping: number;
    showNotification: boolean;
    lastAdded: Product | null;

    // Actions
    addItem: (product: Product, options?: CartOptions) => void;
    removeItem: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    openCart: () => void;
    closeCart: () => void;
    hideNotification: () => void;
}

export const useCart = create<CartStore>()(
    persist(
        (set, get) => ({
            // Initial state
            items: [],
            isOpen: false,
            itemCount: 0,
            total: 0,
            shipping: CART.SHIP_COST,
            showNotification: false,
            lastAdded: null,

            addItem: (product, { size, color, quantity = 1 } = {}) => {
                if (!product?._id || product.stock <= 0) {
                    toast.error('Sin stock');
                    return;
                }

                const price = getProductPrice(product);
                const key = getKey(product._id, size, color);

                set(state => {
                    const existing = state.items.find(item =>
                        getKey(item._id, item.selectedSize, item.selectedColor) === key
                    );

                    const newQty = (existing?.quantity || 0) + quantity;

                    // Validaciones de negocio
                    if (newQty > CART.MAX_QTY) {
                        toast.error(`Máximo ${CART.MAX_QTY} unidades`);
                        return state;
                    }
                    if (newQty > product.stock) {
                        toast.error('Stock insuficiente');
                        return state;
                    }

                    // Actualización inmutable
                    const newItems = existing
                        ? state.items.map(item => item === existing
                            ? { ...item, quantity: newQty, itemTotal: price * newQty }
                            : item
                        )
                        : [...state.items, {
                            ...product,
                            quantity,
                            selectedSize: size,
                            selectedColor: color,
                            price,
                            itemTotal: price * quantity
                        }];

                    const cartState = calcCartState(newItems);

                    // Notificación con cleanup
                    setTimer(() => get().hideNotification());

                    return {
                        items: newItems,
                        ...cartState,
                        showNotification: true,
                        lastAdded: { ...product, selectedSize: size, selectedColor: color }
                    };
                });
            },

            // 🔢 UPDATE QUANTITY
            updateQuantity: (id, qty) => set(state => {
                const safeQty = Math.max(1, Math.min(CART.MAX_QTY, qty));

                const newItems = state.items.map(item =>
                    item._id === id
                        ? {
                            ...item,
                            quantity: Math.min(safeQty, item.stock),
                            itemTotal: getProductPrice(item) * Math.min(safeQty, item.stock) 
                        }
                        : item
                );

                return { items: newItems, ...calcCartState(newItems) };
            }),
            removeItem: (id) => set(state => {
                const newItems = state.items.filter(item => item._id !== id);
                return { items: newItems, ...calcCartState(newItems) };
            }),

            clearCart: () => {
                if (timer) clearTimeout(timer);
                set({
                    items: [],
                    itemCount: 0,
                    total: 0,
                    shipping: CART.SHIP_COST,
                    showNotification: false,
                    lastAdded: null
                });
            },

            //  UI Controls patron command
            openCart: () => set({ isOpen: true }),
            closeCart: () => set({ isOpen: false }),
            hideNotification: () => {
                if (timer) clearTimeout(timer);
                set({ showNotification: false, lastAdded: null });
            }
        }),
        {
            name: 'cart-storage',
            partialize: (state) => ({ items: state.items })
        }
    )
);

// 🧹 Global cleanup
if (typeof window !== 'undefined') {
    window.addEventListener('beforeunload', () => {
        if (timer) clearTimeout(timer);
    });
}
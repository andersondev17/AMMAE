// lib/cart/CartEventManager.ts
type CartEventType = 'itemAdded' | 'itemRemoved' | 'quantityUpdated' | 'cartCleared';

type CartEventCallback = (data: any) => void;

class CartEventManager {
    private static instance: CartEventManager;
    private listeners: Map<CartEventType, CartEventCallback[]>;

    private constructor() {
        this.listeners = new Map();
    }

    public static getInstance(): CartEventManager {
        if (!CartEventManager.instance) {
            CartEventManager.instance = new CartEventManager();
        }
        return CartEventManager.instance;
    }

    subscribe(eventType: CartEventType, callback: CartEventCallback) {
        if (!this.listeners.has(eventType)) {
            this.listeners.set(eventType, []);
        }
        this.listeners.get(eventType)?.push(callback);
    }

    unsubscribe(eventType: CartEventType, callback: CartEventCallback) {
        const callbacks = this.listeners.get(eventType);
        if (callbacks) {
            this.listeners.set(
                eventType,
                callbacks.filter(cb => cb !== callback)
            );
        }
    }

    notify(eventType: CartEventType, data: any) {
        this.listeners.get(eventType)?.forEach(callback => callback(data));
    }
}

export const cartEvents = CartEventManager.getInstance();
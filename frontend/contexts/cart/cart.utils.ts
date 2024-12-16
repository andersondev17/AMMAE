// contexts/cart/cart.utils.ts
import { CartItem } from '@/types/cart.types';

export const calculateCartTotal = (items: CartItem[]): number => {
  return items.reduce((total, item) => {
    const itemPrice = item.enOferta && item.precioOferta 
      ? item.precioOferta 
      : item.precio;
    return total + (itemPrice * item.quantity);
  }, 0);
};

export const getStoredCart = () => {
  if (typeof window === 'undefined') {
    return { items: [], total: 0 };
  }

  try {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : { items: [], total: 0 };
  } catch (error) {
    console.error('Error loading cart from localStorage:', error);
    return { items: [], total: 0 };
  }
};

export const persistCart = (cart: any) => {
  try {
    localStorage.setItem('cart', JSON.stringify(cart));
  } catch (error) {
    console.error('Error saving cart to localStorage:', error);
  }
};
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Product } from '../types';

interface CartItem extends Product {
  quantity: number;
}

interface CartState {
  items: CartItem[];
  total: number;
}

type CartAction =
  | { type: 'ADD_TO_CART'; payload: Product }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' };

const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
} | undefined>(undefined);

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_TO_CART':
      const existingItem = state.items.find(item => item._id === action.payload._id);
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item._id === action.payload._id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
          total: state.total + action.payload.precio
        };
      }
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: 1 }],
        total: state.total + action.payload.precio
      };
    case 'REMOVE_FROM_CART':
      const itemToRemove = state.items.find(item => item._id === action.payload);
      return {
        ...state,
        items: state.items.filter(item => item._id !== action.payload),
        total: state.total - (itemToRemove ? itemToRemove.precio * itemToRemove.quantity : 0)
      };
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(item =>
          item._id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
        total: state.items.reduce((total, item) => 
          item._id === action.payload.id
            ? total + item.precio * action.payload.quantity
            : total + item.precio * item.quantity
        , 0)
      };
    case 'CLEAR_CART':
      return { items: [], total: 0 };
    default:
      return state;
  }
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, { items: [], total: 0 }, () => {
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('cart');
      return savedCart ? JSON.parse(savedCart) : { items: [], total: 0 };
    }
    return { items: [], total: 0 };
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state));
  }, [state]);

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
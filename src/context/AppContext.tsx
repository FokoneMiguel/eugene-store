import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { AppState, AppAction, Category, PromoCode } from '../types';

const initialCategories: Category[] = [
  { id: 'all', name: 'Tous les produits', icon: '🛍️' },
  { id: 'phones', name: 'Téléphones', icon: '📱' },
  { id: 'electronics', name: 'Électronique', icon: '💻' },
  { id: 'fashion', name: 'Mode', icon: '👕' },
  { id: 'home', name: 'Maison', icon: '🏠' },
  { id: 'beauty', name: 'Beauté', icon: '💄' },
  { id: 'sports', name: 'Sports', icon: '⚽' },
  { id: 'books', name: 'Livres', icon: '📚' },
  { id: 'toys', name: 'Jouets', icon: '🧸' }
];

const initialPromoCodes: PromoCode[] = [
  {
    code: 'WELCOME10',
    discount: 10,
    type: 'percentage',
    minAmount: 10000,
    maxDiscount: 5000,
    isActive: true
  },
  {
    code: 'SAVE5000',
    discount: 5000,
    type: 'fixed',
    minAmount: 25000,
    isActive: true
  }
];

const initialState: AppState = {
  products: [],
  cart: [],
  user: null,
  categories: initialCategories,
  promoCodes: initialPromoCodes,
  selectedCategory: 'all',
  searchQuery: '',
  isLoading: false,
  orders: []
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_PRODUCTS':
      return { ...state, products: action.payload, isLoading: false };
    
    case 'ADD_TO_CART':
      const existingItem = state.cart.find(item => item.product.id === action.payload.id);
      if (existingItem) {
        return {
          ...state,
          cart: state.cart.map(item =>
            item.product.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        };
      }
      return {
        ...state,
        cart: [...state.cart, { product: action.payload, quantity: 1 }]
      };
    
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cart: state.cart.filter(item => item.product.id !== action.payload)
      };
    
    case 'UPDATE_CART_QUANTITY':
      if (action.payload.quantity <= 0) {
        return {
          ...state,
          cart: state.cart.filter(item => item.product.id !== action.payload.productId)
        };
      }
      return {
        ...state,
        cart: state.cart.map(item =>
          item.product.id === action.payload.productId
            ? { ...item, quantity: action.payload.quantity }
            : item
        )
      };
    
    case 'CLEAR_CART':
      return { ...state, cart: [] };
    
    case 'SET_USER':
      return { ...state, user: action.payload };
    
    case 'SET_CATEGORY':
      return { ...state, selectedCategory: action.payload };
    
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };
    
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'ADD_ORDER':
      return { ...state, orders: [...state.orders, action.payload] };
    
    case 'UPDATE_ORDER':
      return {
        ...state,
        orders: state.orders.map(order =>
          order.id === action.payload.orderId
            ? { ...order, ...action.payload.updates }
            : order
        )
      };
    
    default:
      return state;
  }
}

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
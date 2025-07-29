export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  category: string;
  subcategory?: string;
  brand?: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  stockQuantity: number;
  isNew?: boolean;
  isPromo?: boolean;
  promoPercentage?: number;
  specifications?: { [key: string]: string };
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: 'customer' | 'admin';
  addresses: Address[];
  orders: Order[];
  createdAt: string;
}

export interface Address {
  id: string;
  type: 'home' | 'work' | 'other';
  street: string;
  city: string;
  region: string;
  postalCode?: string;
  country: string;
  isDefault: boolean;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  promoCode?: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: 'orange_money' | 'mtn_momo' | 'card' | 'cash_on_delivery';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  shippingAddress: Address;
  trackingNumber?: string;
  estimatedDelivery?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  subcategories?: string[];
}

export interface PromoCode {
  code: string;
  discount: number;
  type: 'percentage' | 'fixed';
  minAmount?: number;
  maxDiscount?: number;
  expiresAt?: string;
  isActive: boolean;
}

export interface AppState {
  products: Product[];
  cart: CartItem[];
  user: User | null;
  categories: Category[];
  promoCodes: PromoCode[];
  selectedCategory: string;
  searchQuery: string;
  isLoading: boolean;
  orders: Order[];
}

export type AppAction =
  | { type: 'SET_PRODUCTS'; payload: Product[] }
  | { type: 'ADD_TO_CART'; payload: Product }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'UPDATE_CART_QUANTITY'; payload: { productId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_CATEGORY'; payload: string }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'ADD_ORDER'; payload: Order }
  | { type: 'UPDATE_ORDER'; payload: { orderId: string; updates: Partial<Order> } };
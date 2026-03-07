import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, Product } from '../types';

interface CartStore {
  items: CartItem[];
  addItem: (product: Product, quantity: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isInCart: (productId: string) => boolean;
  getTotalPrice: () => number;
  total: number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      total: 0,
  
  addItem: (product, quantity) => {
    const items = get().items;
    const existingItem = items.find(item => item.product_id === product.id);
    
    if (existingItem) {
      set({
        items: items.map(item =>
          item.product_id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        ),
      });
    } else {
      set({
        items: [
          ...items,
          {
            id: crypto.randomUUID(),
            user_id: '',
            product_id: product.id,
            quantity,
            product,
          },
        ],
      });
    }
    
    const newItems = get().items;
    const total = newItems.reduce((sum, item) => {
      const price = item.product?.price || 0;
      const discount = item.product?.discount || 0;
      const finalPrice = price - (price * discount / 100);
      return sum + (finalPrice * item.quantity);
    }, 0);
    set({ total });
  },
  
  removeItem: (productId) => {
    set({ items: get().items.filter(item => item.product_id !== productId) });
    
    const items = get().items;
    const total = items.reduce((sum, item) => {
      const price = item.product?.price || 0;
      const discount = item.product?.discount || 0;
      const finalPrice = price - (price * discount / 100);
      return sum + (finalPrice * item.quantity);
    }, 0);
    set({ total });
  },
  
  updateQuantity: (productId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(productId);
      return;
    }
    
    set({
      items: get().items.map(item =>
        item.product_id === productId ? { ...item, quantity } : item
      ),
    });
    
    const items = get().items;
    const total = items.reduce((sum, item) => {
      const price = item.product?.price || 0;
      const discount = item.product?.discount || 0;
      const finalPrice = price - (price * discount / 100);
      return sum + (finalPrice * item.quantity);
    }, 0);
    set({ total });
  },
  
  clearCart: () => set({ items: [], total: 0 }),
  
  isInCart: (productId) => {
    return get().items.some(item => item.product_id === productId);
  },

  getTotalPrice: () => {
    return get().total;
  },
}),
{
  name: 'cart-storage',
}
)
);

// lib/store.ts
'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, CartItem } from '@/types';

interface CartStore {
  items: CartItem[];
  addItem: (product: Product, quantity?: number, variant?: string) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getSubtotal: () => number;
  appliedCoupon: { code: string; discount: number } | null;
  applyCoupon: (code: string, discount: number) => void;
  removeCoupon: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      appliedCoupon: null,

      addItem: (product, quantity = 1, variant) => {
        set((state) => {
          const existingIndex = state.items.findIndex(
            (item) => item.product._id === product._id && item.variant === variant
          );
          if (existingIndex >= 0) {
            const updated = [...state.items];
            updated[existingIndex] = {
              ...updated[existingIndex],
              quantity: updated[existingIndex].quantity + quantity,
            };
            return { items: updated };
          }
          return { items: [...state.items, { product, quantity, variant }] };
        });
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.product._id !== productId),
        }));
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set((state) => ({
          items: state.items.map((item) =>
            item.product._id === productId ? { ...item, quantity } : item
          ),
        }));
      },

      clearCart: () => set({ items: [], appliedCoupon: null }),

      getTotalItems: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
      },

      applyCoupon: (code, discount) => set({ appliedCoupon: { code, discount } }),
      removeCoupon: () => set({ appliedCoupon: null }),
    }),
    {
      name: 'aambish-cart',
      skipHydration: true,
    }
  )
);

// Wishlist store
interface WishlistStore {
  items: string[];
  toggle: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      toggle: (productId) => {
        set((state) => ({
          items: state.items.includes(productId)
            ? state.items.filter((id) => id !== productId)
            : [...state.items, productId],
        }));
      },
      isWishlisted: (productId) => get().items.includes(productId),
    }),
    { name: 'aambish-wishlist' }
  )
);

// Recently viewed store
interface RecentlyViewedStore {
  items: Product[];
  add: (product: Product) => void;
}

export const useRecentlyViewedStore = create<RecentlyViewedStore>()(
  persist(
    (set) => ({
      items: [],
      add: (product) => {
        set((state) => {
          const filtered = state.items.filter((p) => p._id !== product._id);
          return { items: [product, ...filtered].slice(0, 8) };
        });
      },
    }),
    { name: 'aambish-recently-viewed' }
  )
);

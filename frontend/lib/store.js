import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      setAuth: (user, token) => set({ user, token }),
      logout: () => set({ user: null, token: null }),
    }),
    {
      name: 'auth-storage',
    }
  )
);

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, variant, quantity = 1) => {
        const items = get().items;
        const existingIndex = items.findIndex(
          item => item.variant.id === variant.id
        );

        if (existingIndex > -1) {
          const newItems = [...items];
          newItems[existingIndex].quantity += quantity;
          set({ items: newItems });
        } else {
          set({ items: [...items, { product, variant, quantity }] });
        }
      },
      removeItem: (variantId) => {
        set({ items: get().items.filter(item => item.variant.id !== variantId) });
      },
      updateQuantity: (variantId, quantity) => {
        const items = get().items;
        const index = items.findIndex(item => item.variant.id === variantId);
        if (index > -1 && quantity > 0) {
          const newItems = [...items];
          newItems[index].quantity = quantity;
          set({ items: newItems });
        }
      },
      clearCart: () => set({ items: [] }),
      getTotal: () => {
        return get().items.reduce(
          (total, item) => total + parseFloat(item.variant.price) * item.quantity,
          0
        );
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);

export const useWishlistStore = create(
  persist(
    (set, get) => ({
      items: [],
      addItem: (productId) => {
        if (!get().items.includes(productId)) {
          set({ items: [...get().items, productId] });
        }
      },
      removeItem: (productId) => {
        set({ items: get().items.filter(id => id !== productId) });
      },
      isInWishlist: (productId) => {
        return get().items.includes(productId);
      },
    }),
    {
      name: 'wishlist-storage',
    }
  )
);

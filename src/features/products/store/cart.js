import { create } from "zustand";
import * as api from "../../../api";

const useCart = create((set, get) => ({
  cart: [],
  loading: false,
  error: null,

  // 🔥 FETCH CART
  fetchCart: async () => {
    set({ loading: true, error: null });

    try {
      const res = await api.getCart();
      set({ cart: res.data });
    } catch (err) {
      console.error("Fetch cart error:", err);
      set({ error: "Failed to load cart" });
    } finally {
      set({ loading: false });
    }
  },

  // 🔥 ADD TO CART
  addToCart: async (product) => {
    try {
      await api.addToCart(product.id);

      // 🔥 Optimized: reuse fetchCart
      get().fetchCart();

    } catch (err) {
      console.error("Add to cart error:", err);
    }
  },

  // 🔥 REMOVE ITEM
  removeFromCart: async (id) => {
    try {
      await api.removeFromCart(id);
      get().fetchCart();
    } catch (err) {
      console.error("Remove error:", err);
    }
  },

  // 🔥 UPDATE QUANTITY
  updateQty: async (id, qty) => {
    try {
      await api.updateQty(id, qty);
      get().fetchCart();
    } catch (err) {
      console.error("Update qty error:", err);
    }
  },

  // 🔥 CLEAR LOCAL STATE (after logout/payment fallback)
  clearCartState: () => set({ cart: [] })
}));

export default useCart;
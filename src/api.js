import apiClient from "@/config/axiosClient";

// ================= AUTH =================
export const loginUser = (data) => apiClient.post("/auth/login", data);
export const registerUser = (data) => apiClient.post("/auth/register", data);
export const logoutUser = () => apiClient.post("/auth/logout");

// ================= PRODUCTS =================
export const getProducts = () => apiClient.get("/products?page=0&size=100");
export const getProduct = (id) => apiClient.get(`/products/${id}`);
export const searchProducts = (q) => apiClient.get(`/products/search?keyword=${q}`);
export const getCategories = () => apiClient.get("/products/categories");
export const getByCategory = (id) => apiClient.get(`/products/category/${id}`);

// ================= CART =================
export const getCart = () => apiClient.get("/cart");
export const addToCart = (id) => apiClient.post(`/cart?productId=${id}`);
export const removeFromCart = (id) => apiClient.delete(`/cart/${id}`);
export const updateQty = (id, qty) => apiClient.put(`/cart/${id}?qty=${qty}`);

// ================= ORDERS =================
export const getOrders = () => apiClient.get("/orders");

// ================= PAYMENTS =================
// These paths match the @PostMapping endpoints in PaymentController above.

export const checkoutPlan = (data) => 
  apiClient.post("/payments/create-plan-session", data);

export const checkoutProduct = (data) => 
  apiClient.post("/payments/create-product-session", data);

export const checkoutCart = (data) => 
  apiClient.post("/payments/create-cart-session", data);
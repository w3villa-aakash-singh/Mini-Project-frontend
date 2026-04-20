import apiClient from "../../../config/axiosClient";

// Get all products (IMPORTANT: size=100)
export const getProducts = async () => {
  const res = await apiClient.get(`/products?page=0&size=100`);
  return res.data;
};

// Get single product
export const getProduct = async (id) => {
  const res = await apiClient.get(`/products/${id}`);
  return res.data;
};

// Search
export const searchProducts = async (keyword) => {
  const res = await apiClient.get(`/products/search?keyword=${keyword}`);
  return res.data;
};

// Category
export const getByCategory = async (id) => {
  const res = await apiClient.get(`/products/category/${id}`);
  return res.data;
};

// Categories
export const getCategories = async () => {
  const res = await apiClient.get(`/products/categories`);
  return res.data;
};
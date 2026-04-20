import apiClient from "@/config/axiosClient";

// ================= CATEGORY =================
export const getCategories = async () => {
  const res = await apiClient.get("/admin/categories");
  return res.data;
};

export const addCategory = async (data) => {
  const res = await apiClient.post("/admin/categories", data);
  return res.data;
};

export const deleteCategory = async (id) => {
  return apiClient.delete(`/admin/categories/${id}`);
};

// ================= PRODUCTS =================
export const getProducts = async () => {
  const res = await apiClient.get("/admin/products");
  return res.data;
};

export const addProduct = async (data) => {
  const res = await apiClient.post("/admin/products", data);
  return res.data;
};

export const deleteProduct = async (id) => {
  return apiClient.delete(`/admin/products/${id}`);
};

export const updateProduct = async (id, data) => {
  const res = await apiClient.put(`/admin/products/${id}`, data);
  return res.data;
};
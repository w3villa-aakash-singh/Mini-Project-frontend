import apiClient from "@/config/axiosClient";

// Get users
export const getAllUsers = async () => {
  const res = await apiClient.get("/users");
  return res.data;
};

// Delete user
export const deleteUserById = async (id) => {
  return apiClient.delete(`/users/${id}`);
};

// Upgrade plan
export const upgradeUserPlan = async (id, planType) => {
  return apiClient.put(`/users/${id}/upgrade?planType=${planType}`);
};
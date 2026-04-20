
import apiClient from "@/config/axiosClient";

// Update profile
export const updateUserProfile = async (userId, data) => {
  const res = await apiClient.put(`/users/${userId}`, data);
  return res.data;
};

// Upload image
export const uploadUserImage = async (userId, formData) => {
  const res = await apiClient.post(
    `/users/${userId}/upload-image`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return res.data;
};

// Download profile
export const downloadUserProfile = async (userId) => {
  const res = await apiClient.get(
    `/users/${userId}/download`,
    { responseType: "blob" }
  );
  return res.data;
};
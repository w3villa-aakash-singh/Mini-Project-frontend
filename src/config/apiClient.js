import axios from "axios";

const apiClient = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api/v1`, // 🚩 Corrected Port
  withCredentials: true, // 🚩 Required for Refresh Cookie
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token to every request automatically
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
import axios from "axios";
import useAuth from "../features/auth/store/store";

const axiosClient = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api/v1`,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // 🔥 IMPORTANT (for refresh cookie)
});

// =========================
// ✅ REQUEST INTERCEPTOR
// =========================
axiosClient.interceptors.request.use((config) => {
  const token = useAuth.getState().accessToken;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// =========================
// 🔥 RESPONSE INTERCEPTOR (AUTO REFRESH)
// =========================
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // prevent infinite loop
    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        // 🔥 call refresh API (uses cookie)
        const refreshRes = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/api/v1/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const newAccessToken = refreshRes.data.accessToken;

        // update Zustand store
        useAuth.getState().setAccessToken(newAccessToken);

        // retry original request
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return axiosClient(originalRequest);

      } catch (refreshError) {
        // logout if refresh fails
        useAuth.getState().logout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
import axios from "axios";
import toast from "react-hot-toast";
import useAuth from "@/auth/store";
import { refreshToken } from "@/services/AuthService";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
  timeout: 10000,
});

// Request Interceptor: Attach the token to every outgoing request
apiClient.interceptors.request.use((config) => {
  const accessToken = useAuth.getState().accessToken;
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

let isRefreshing = false;
let pending = []; // Queue for requests waiting for a new token

// Response Interceptor: Handle errors and Token Refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if error is 401 (Unauthorized) and we haven't retried this specific request yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      
      if (isRefreshing) {
        // If a refresh is already in progress, add this request to the queue
        return new Promise((resolve, reject) => {
          pending.push((newToken) => {
            if (newToken) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              resolve(apiClient(originalRequest));
            } else {
              reject(error);
            }
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        console.log("Token expired. Attempting refresh...");
        const loginResponse = await refreshToken();
        const newToken = loginResponse.accessToken;

        if (!newToken) throw new Error("No access token received");

        // Update Zustand store
        useAuth.getState().changeLocalLoginData(
          loginResponse.accessToken,
          loginResponse.user,
          true
        );

        // Resolve all pending requests in the queue
        pending.forEach((callback) => callback(newToken));
        pending = [];

        // Retry the original request
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(originalRequest);

      } catch (refreshError) {
        // If refresh fails, log the user out and clear queue
        pending.forEach((callback) => callback(null));
        pending = [];
        useAuth.getState().logout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Generic error handling for non-401 errors
    const errorMessage = error.response?.data?.message || "An unexpected error occurred";
    toast.error(errorMessage);
    return Promise.reject(error);
  }
);

export default apiClient;
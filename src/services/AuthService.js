import apiClient from "../config/apiClient"
import axios from "axios";

/**
 * Register a new user
 */
export const registerUser = async (signupData) => {
  const response = await apiClient.post(`/auth/register`, signupData);
  return response.data;
};

/**
 * Login user
 */
export const loginUser = async (loginData) => {
  const response = await apiClient.post("/auth/login", loginData);
  return response.data;
};

/**
 * Logout user
 */
export const logoutUser = async () => {
  const response = await apiClient.post(`/auth/logout`);
  return response.data;
};

/**
 * Get current login user details
 */
export const getCurrentUser = async (emailId) => {
  const response = await apiClient.get(`/users/email/${emailId}`);
  return response.data;
};

/**
 * Refresh Token
 * NOTE: We use a fresh axios instance here to avoid interceptor loops
 */
export const refreshToken = async () => {
  // We manually point to the URL because using apiClient here 
  // might trigger the 401 interceptor logic again.
  const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8083/api/v1";
  
  const response = await axios.post(
    `${baseUrl}/auth/refresh`, 
    {}, 
    { withCredentials: true }
  );
  
  return response.data;
};
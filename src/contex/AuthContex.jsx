import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// ✅ Global axios config
axios.defaults.withCredentials = true;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authStatus, setAuthStatus] = useState(false);
  const [loading, setLoading] = useState(true);

  // ✅ Attach access token to every request
  useEffect(() => {
    const interceptor = axios.interceptors.request.use((config) => {
      const token = localStorage.getItem("accessToken");

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    });

    return () => axios.interceptors.request.eject(interceptor);
  }, []);

  // ✅ INIT AUTH (REFRESH TOKEN FLOW)
  useEffect(() => {
    const initAuth = async () => {
      try {
        const res = await axios.post(
          `${API_BASE_URL}/api/v1/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const { accessToken, user } = res.data;

        setUser(user);
        setAuthStatus(true);

        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("user", JSON.stringify(user));
      } catch (e) {
        console.log("No active session");
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // ✅ LOGIN FUNCTION
  // ✅ Corrected Login Function in AuthProvider
const login = async (loginData) => {
  // Use your existing loginData to make the request
  const res = await axios.post(
    `${API_BASE_URL}/api/v1/auth/login`,
    loginData, // Pass the email/password object here
    { withCredentials: true }
  );

  const { accessToken, user } = res.data;

  setUser(user);
  setAuthStatus(true);
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("user", JSON.stringify(user));
  
  return res.data; // Return this so Login.jsx can handle the navigate
};

  // ✅ LOGOUT FUNCTION
  const logout = async () => {
    try {
      await axios.post(
        `${API_BASE_URL}/api/v1/auth/logout`,
        {},
        { withCredentials: true }
      );
    } catch (e) {
      console.log("Logout error");
    }

    localStorage.clear();
    setUser(null);
    setAuthStatus(false);
  };

  // ✅ OPTIONAL: refresh user data
  const refreshUser = async () => {
    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/v1/auth/refresh`,
        {},
        { withCredentials: true }
      );

      const { accessToken, user } = res.data;

      setUser(user);
      setAuthStatus(true);

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("user", JSON.stringify(user));

      return user;
    } catch (e) {
      console.log("Refresh failed");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        authStatus,
        login,
        logout,
        loading,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
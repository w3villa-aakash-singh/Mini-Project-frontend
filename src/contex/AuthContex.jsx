import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();


export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authStatus, setAuthStatus] = useState(false);
  const [loading, setLoading] = useState(true);
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

  const refreshUser = async () => {
    const token = localStorage.getItem("accessToken");
    const savedUser = JSON.parse(localStorage.getItem("user"));
    
    if (!token || !savedUser?.id) return;

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/users/${savedUser.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      const freshData = response.data;
      setUser(freshData);
      localStorage.setItem("user", JSON.stringify(freshData));
      return freshData;
    } catch (error) {
      console.error("Identity Sync Failed:", error);
    }
  };

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const token = localStorage.getItem("accessToken");

    if (savedUser && token && savedUser !== "undefined") {
      try {
        setUser(JSON.parse(savedUser));
        setAuthStatus(true);
      } catch (e) {
        localStorage.clear();
      }
    }
    setLoading(false);
  }, []);

  const login = (userData, token) => {
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("accessToken", token);
    setUser(userData);
    setAuthStatus(true);
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    setUser(null);
    setAuthStatus(false);
  };

  return (
    <AuthContext.Provider value={{ user, authStatus, login, logout, loading, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
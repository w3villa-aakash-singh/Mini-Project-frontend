import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import App from './App.jsx'
import About from './pages/About.jsx';
import Login from './pages/Login';
import Signup from './pages/Signup';
import RootLayout from './pages/RootLayout';
import Services from './pages/Services';
import Userlayout from './pages/users/Userlayout';
import OAuthSuccess from './pages/OAuthSuccess';
import PlansPage from './pages/users/PlansPage';

import AdminLayout from './pages/admin/AdminLayout';
import AdminUsers from './pages/admin/AdminUsers';
// (optional future)
// import AdminPlans from './pages/admin/AdminPlans';

import { AuthProvider, useAuth } from './contex/AuthContex';


// 🔒 Protected Route
const ProtectedRoute = ({ children }) => {
  const { authStatus, loading } = useAuth();

  if (loading) {
    return <div className="h-screen flex items-center justify-center text-white">Loading...</div>;
  }

  if (!authStatus) {
    return <Navigate to="/login" replace />;
  }

  return children;
};


// 🚫 Public Route
const PublicRoute = ({ children }) => {
  const { authStatus, loading } = useAuth();

  if (loading) {
    return <div className="h-screen flex items-center justify-center text-white">Loading...</div>;
  }

  if (authStatus) {
    return <Navigate to="/profile" replace />;
  }

  return children;
};


// 👑 Admin Route
const AdminRoute = ({ children }) => {
  const { authStatus, user, loading } = useAuth();

  if (loading) {
    return <div className="h-screen flex items-center justify-center text-white">Loading...</div>;
  }

  if (!authStatus) {
    return <Navigate to="/login" replace />;
  }

  const isAdmin = user?.roles?.some(r => r.name === "ROLE_ADMIN");

  if (!isAdmin) {
    return <Navigate to="/profile" replace />;
  }

  return children;
};


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          <Route path="/" element={<RootLayout />}>

            {/* 🌍 Public */}
            <Route index element={<App />} />
            <Route path="/services" element={<Services />} />
            <Route path="/about" element={<About />} />

            {/* 🔐 Auth */}
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />

            <Route
              path="/signup"
              element={
                <PublicRoute>
                  <Signup />
                </PublicRoute>
              }
            />

            {/* 🔒 User */}
            <Route
              path="/profile/*"
              element={
                <ProtectedRoute>
                  <Userlayout />
                </ProtectedRoute>
              }
            />

            <Route
              path="/plans"
              element={
                <ProtectedRoute>
                  <PlansPage />
                </ProtectedRoute>
              }
            />

            {/* 👑 ADMIN PANEL */}
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminLayout />
                </AdminRoute>
              }
            >
              <Route path="users" element={<AdminUsers />} />
              {/* future */}
              {/* <Route path="plans" element={<AdminPlans />} /> */}
            </Route>

            {/* 🔗 OAuth */}
            <Route path="oauth/success" element={<OAuthSuccess />} />
            <Route
              path="/oauth/failure"
              element={<div className="text-white">Auth Failed</div>}
            />

          </Route>

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>
);
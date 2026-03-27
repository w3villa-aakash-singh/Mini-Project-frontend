import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Routes, Route } from "react-router"; // Added Routes import
import App from './App.jsx'
import About from './pages/About.jsx';
import Login from './pages/Login';
import Signup from './pages/Signup';
import RootLayout from './pages/RootLayout';
import Services from './pages/Services';
import Userlayout from './pages/users/Userlayout';
import { AuthProvider } from './contex/AuthContex';

import { Navigate } from "react-router";
import { useAuth } from './contex/AuthContex';
import OAuthSuccess from './pages/OAuthSuccess';

const ProtectedRoute = ({ children }) => {
  const { authStatus, loading } = useAuth();

  // 1. If the app is still checking LocalStorage, show nothing (or a spinner)
  if (loading) {
    return <div className="h-screen bg-slate-950 flex items-center justify-center text-white">Loading...</div>;
  }

  // 2. If not logged in, redirect to login page
  if (!authStatus) {
    return <Navigate to="/login" replace />;
  }

  // 3. If logged in, show the requested page
  return children;
};

createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootLayout />}>
          <Route index element={<App />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/services" element={<Services />} />
          <Route path="/about" element={<About />} />
          <Route
            path="/dashboard/*"
            element={
              <ProtectedRoute>
                <Userlayout />
              </ProtectedRoute>
            }
          />
          <Route path="oauth/success" element={<OAuthSuccess />} />
          <Route path="/oauth/failure" element={<div className="text-white">Auth Failed. Please try again.</div>} />

        </Route>
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);
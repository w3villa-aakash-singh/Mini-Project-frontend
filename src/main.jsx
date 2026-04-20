import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import { BrowserRouter, Routes, Route, Navigate } from "react-router";

// import About from "./pages/About.jsx";
import Login from "./features/auth/pages/Login";
import Signup from "./features/auth/pages/Signup";
// import Services from "./pages/Services";
import Userlayout from "./features/users/pages/Userlayout";
import OAuthSuccess from "./features/auth/pages/OAuthSuccess";
import PlansPage from "./features/users/pages/PlansPage";
import VerifyEmail from "./features/auth/pages/verifyAccount";

import AdminLayout from "./features/admin/pages/AdminLayout";
import AdminUsers from "./features/admin/pages/AdminUsers";

// Zustand
import useAuth from "./features/auth/store/store.js";

import ProductDetails from "./features/products/pages/ProductDetails";
import ProductList from "./features/products/pages/ProductList";
import Cart from "./features/products/pages/Cart";
import PaymentSuccess from "./features/products/pages/PaymentSuccess";
import OrdersPage from "./features/orders/pages/OrderPage";
import ProductSuccess from "./features/products/pages/ProductSuccess";
import CartSuccess from "./features/products/pages/CartSuccess";
import RootLayout from "./features/users/pages/RootLayout";
import AdminProducts from "./features/admin/pages/AdminProducts";


// 🔒 Protected Route
const ProtectedRoute = ({ children }) => {
  const { authStatus, authLoading } = useAuth();

  if (authLoading) {
  return (
    <div className="h-screen flex items-center justify-center">
      <div className="h-16 w-16 border-4 border-gray-300 border-t-red-600 rounded-full animate-spin"></div>
    </div>
  );
}

  if (!authStatus) {
    return <Navigate to="/login" replace />;
  }

  return children;
};


// 🚫 Public Route
const PublicRoute = ({ children }) => {
  const { authStatus, authLoading } = useAuth();

  if (authLoading) {
  return (
    <div className="h-screen flex items-center justify-center">
      <div className="h-16 w-16 border-4 border-gray-300 border-t-red-600 rounded-full animate-spin"></div>
    </div>
  );
}

  if (authStatus) {
    return <Navigate to="/" replace />;
  }

  return children;
};


// 👑 Admin Route
const AdminRoute = ({ children }) => {
  const { authStatus, user, authLoading } = useAuth();

  if (authLoading) {
  return (
    <div className="h-screen flex items-center justify-center">
      <div className="h-16 w-16 border-4 border-gray-300 border-t-red-600 rounded-full animate-spin"></div>
    </div>
  );
}

  if (!authStatus) {
    return <Navigate to="/login" replace />;
  }

  const isAdmin = user?.roles?.some(r => r.name === "ROLE_ADMIN");

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};


createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<RootLayout />}>

          {/* 🛒 HOME = PRODUCTS */}
          <Route index element={<ProductList />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/product/:id" element={<ProductDetails />} />

          {/* 🌍 Public */}
          {/* <Route path="/services" element={<Services />} /> */}
          {/* <Route path="/about" element={<About />} /> */}

          {/* 🔐 Auth */}
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />

          {/* 🛒 Cart (guest allowed) */}
          <Route path="/cart" element={<Cart />} />

          <Route path="/success" element={<PaymentSuccess />} />
          <Route path="/product-success" element={<ProductSuccess />} />

          <Route path="/cart-success" element={<CartSuccess />} />

          {/* 🔒 Protected */}
          <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
          <Route path="/profile/*" element={<ProtectedRoute><Userlayout /></ProtectedRoute>} />
          <Route path="/plans" element={<ProtectedRoute><PlansPage /></ProtectedRoute>} />

          {/* 👑 Admin */}
          <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
            <Route path="users" element={<AdminUsers />} />

            {/* 🔥 ADD THIS */}
            <Route path="products" element={<AdminProducts />} />
          </Route>

          {/* OAuth */}
          <Route path="/oauth/success" element={<OAuthSuccess />} />
          <Route path="/verify" element={<VerifyEmail />} />

        </Route>

      </Routes>
    </BrowserRouter>
  </StrictMode>
);
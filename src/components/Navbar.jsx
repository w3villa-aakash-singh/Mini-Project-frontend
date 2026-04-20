import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate, useLocation } from "react-router";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

import useAuth from "../features/auth/store/store.js";
import useCart from "../features/products/store/cart.js";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import {
  LogOut,
  User,
  Settings,
  ShieldCheck,
  ShoppingCart,
  Package
} from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const user = useAuth((state) => state.user);
  const authStatus = useAuth((state) => state.authStatus);
  const logout = useAuth((state) => state.logout);
  const loading = useAuth((state) => state.authLoading);

  const cart = useCart((state) => state.cart);
  const fetchCart = useCart((state) => state.fetchCart);

  const [search, setSearch] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  const showSearch =
    location.pathname === "/" || location.pathname === "/products";

  useEffect(() => setIsMounted(true), []);

  useEffect(() => {
    if (authStatus) fetchCart();
  }, [authStatus]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleSearch = () => {
    navigate(`/?search=${search}`);
  };

  if (!isMounted || loading) {
    return <nav className="h-16 w-full bg-white border-b" />;
  }

  return (
    <nav className="sticky top-0 z-50 w-full bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-4">

        {/* LOGO */}
        <NavLink to="/" className="flex items-center gap-2">
          <div className="bg-red-600 p-2 rounded-lg shadow-sm">
            <ShieldCheck className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-lg font-bold text-gray-800">
            Shop<span className="text-red-600">Hub</span>
          </h1>
        </NavLink>

        {/* SEARCH */}
        {showSearch && (
          <div className="hidden md:flex flex-1 max-w-2xl mx-6">
            <div className="flex w-full border rounded-lg overflow-hidden shadow-sm focus-within:ring-2 ring-yellow-400">

              <input
                type="text"
                placeholder="Search for products, brands..."
                className="flex-1 px-4 py-2 text-sm text-gray-700 outline-none"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />

              <button
                onClick={handleSearch}
                className="bg-yellow-400 px-5 text-sm font-medium hover:bg-yellow-500 transition"
              >
                Search
              </button>
            </div>
          </div>
        )}

        {/* RIGHT */}
        <div className="flex items-center gap-5">

          {/* CART */}
          <div
            onClick={() => navigate("/cart")}
            className="relative cursor-pointer hover:text-red-600 transition"
          >
            <ShoppingCart className="h-6 w-6 text-gray-700" />

            {authStatus && user && cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded-full shadow">
                {cart.length}
              </span>
            )}
          </div>

          {/* AUTH */}
          {authStatus && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="cursor-pointer">
                  <Avatar className="h-9 w-9 border">
                    <AvatarImage src={user?.image || user?.picture} />
                    <AvatarFallback>{user?.name?.[0]}</AvatarFallback>
                  </Avatar>
                </div>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className="w-56 bg-white border shadow-lg rounded-lg"
              >
                <DropdownMenuLabel className="text-gray-700">
                  <p className="font-medium">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={() => navigate("/")}>
                  Products
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => navigate("/orders")}>
                  <Package className="mr-2 h-4 w-4" /> Orders
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => navigate("/profile")}>
                  <User className="mr-2 h-4 w-4" /> Profile
                </DropdownMenuItem>

                {user?.roles?.some(r => r.name === "ROLE_ADMIN") && (
                  <DropdownMenuItem onClick={() => navigate("/admin/users")}>
                    <Settings className="mr-2 h-4 w-4" /> Admin
                  </DropdownMenuItem>
                )}

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-red-600"
                >
                  <LogOut className="mr-2 h-4 w-4" /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <NavLink to="/login">
              <Button className="bg-red-600 hover:bg-red-700 text-white">
                Sign In
              </Button>
            </NavLink>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from "react-router";
import { useAuth } from "../contex/AuthContex"; // Updated Import
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { LogOut, User, Settings, LayoutDashboard, ShieldCheck, Zap } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, authStatus, logout, loading } = useAuth();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => setIsMounted(true), []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!isMounted || loading) return <nav className="h-16 w-full bg-slate-950" />;

  return (
    <nav className='flex items-center justify-between h-16 w-full px-6 border-b border-gray-800/50 bg-gradient-to-r from-slate-950 via-gray-900 to-slate-950 sticky top-0 z-50 backdrop-blur-sm'>

      <NavLink to="/" className='flex items-center gap-3 hover:opacity-90'>
        <div className="bg-gradient-to-br from-red-500 to-red-700 p-1.5 rounded-lg shadow-sm">
          <ShieldCheck className="h-6 w-6 text-white" />
        </div>
        <h1 className='text-white font-black text-xl tracking-tighter uppercase'>
          Plan<span className="text-red-600">Verify</span>
        </h1>
      </NavLink>

      <div className='flex items-center gap-6'>
        {authStatus && user ? (
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold uppercase">
              <Zap className="h-3.5 w-3.5 fill-red-500" />
              {user?.planType || "FREE"} Plan
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center outline-none cursor-pointer group">
                  <img src={user?.image ?
                    user.image
                      .replace("gateway.storjshare.io", "link.storjshare.io") // Changes Private -> Public   
                      .replace("/user-profile/", "/raw/jvfofhsm5xn47i3d6o57pf7tr53q/user-profile/") // Adds your Share Key and RAW path
                    : user?.picture
                  } alt="Avatar" className="h-10 w-10 rounded-full border-2 border-slate-700 group-hover:border-red-600 transition-all object-cover" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 mt-2 bg-slate-900 border-gray-800 text-slate-200">
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <p className="text-sm font-bold text-white">{user.name}</p>
                    <p className="text-xs text-slate-400">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-gray-800" />
                <DropdownMenuItem onClick={() => navigate("/profile")}><User className="mr-2 h-4 w-4" /> Profile</DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/dashboard")}><LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard</DropdownMenuItem>
                {user.role === "ADMIN" && (
                  <DropdownMenuItem onClick={() => navigate("/admin/users")} className="text-blue-400"><Settings className="mr-2 h-4 w-4" /> Admin</DropdownMenuItem>
                )}
                <DropdownMenuSeparator className="bg-gray-800" />
                <DropdownMenuItem onClick={handleLogout} className="text-red-500"><LogOut className="mr-2 h-4 w-4" /> Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <NavLink to="/login">
            <Button className="bg-red-600 hover:bg-red-700 text-white font-bold px-6">Sign In</Button>
          </NavLink>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
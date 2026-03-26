import React from 'react';
import { NavLink, useNavigate } from "react-router";
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

  const isLoggedIn = true; 
  const user = {
    name: "W3Villa User",
    email: "test@w3villa.com",
    role: "ADMIN", 
    activePlan: "Gold", 
    picture: "https://github.com/shadcn.png" 
  };

  const handleLogout = () => {
    
    navigate("/login");
  };

  return (
    <nav className='flex items-center justify-between h-16 w-full px-6 border-b border-gray-800/50 shadow-lg 
      /* Updated Gradient: Deep slate to a touch of red-950 for branding */
      bg-gradient-to-r from-slate-950 via-gray-900 to-slate-950 
      sticky top-0 z-50 backdrop-blur-sm'>
      
      {/* Logo Section */}
      <NavLink to="/" className='flex items-center gap-3 hover:opacity-90 transition-opacity'>
        <div className="bg-gradient-to-br from-red-500 to-red-700 p-1.5 rounded-lg shadow-sm shadow-red-900/20">
           <ShieldCheck className="h-6 w-6 text-white" />
        </div>
        <h1 className='text-white font-black text-xl tracking-tighter uppercase'>
          Plan<span className="text-red-600 bg-clip-text">Verify</span>
        </h1>
      </NavLink>

      {/* Navigation & Auth Section */}
      <div className='flex items-center gap-6'>
        {isLoggedIn ? (
          <div className="flex items-center gap-4">
            {/* Plan Badge - Requirement 101: Display plan status */}
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full 
              bg-gradient-to-r from-red-500/10 to-red-600/10 border border-red-500/20 
              text-red-500 text-xs font-bold animate-pulse-slow">
              <Zap className="h-3.5 w-3.5 fill-red-500" />
              {user.activePlan} Plan
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center outline-none cursor-pointer group">
                  <img
                    src={user.picture}
                    alt="Avatar"
                    className="h-10 w-10 rounded-full border-2 border-slate-700 group-hover:border-red-600 transition-all object-cover shadow-md"
                  />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 mt-2 bg-slate-900/95 border-gray-800 text-slate-200 backdrop-blur-md">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-bold text-white leading-none">{user.name}</p>
                    <p className="text-xs leading-none text-slate-400">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-gray-800" />
                
                {/* Requirement 63, 72: Profile Management & Map */}
                <DropdownMenuItem onClick={() => navigate("/dashboard/profile")} className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile & Map</span>
                </DropdownMenuItem>

                {/* Requirement 16: Dashboard redirection */}
                <DropdownMenuItem onClick={() => navigate("/dashboard")} className="cursor-pointer">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  <span>User Dashboard</span>
                </DropdownMenuItem>

                {/* Requirement 111, 112: Admin Management features */}
                {user.role === "ADMIN" && (
                  <>
                    <DropdownMenuSeparator className="bg-gray-800" />
                    <DropdownMenuItem 
                      className="text-blue-400 focus:text-blue-400 focus:bg-blue-400/10 cursor-pointer"
                      onClick={() => navigate("/admin/users")}
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Admin Management</span>
                    </DropdownMenuItem>
                  </>
                )}

                <DropdownMenuSeparator className="bg-gray-800" />
                <DropdownMenuItem onClick={handleLogout} className="text-red-500 focus:text-red-500 focus:bg-red-500/10 cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <NavLink to="/login">
            <Button 
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold px-6 shadow-md shadow-red-950/20"
            >
              Sign In
            </Button>
          </NavLink>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
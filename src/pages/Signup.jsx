import React, { useState } from 'react';
import { NavLink, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "react-hot-toast";
import { registerUser } from '@/services/AuthService';

// Icon imports
import { SiGithub, SiGoogle } from "react-icons/si";
import { HiShieldCheck } from "react-icons/hi";
import {
  RiUserAddLine,
  RiMailSendLine,
  RiFingerprint2Line,
  RiEyeLine,
  RiEyeOffLine
} from "react-icons/ri";

const Signup = () => {
  const navigate = useNavigate();

  const [data, setData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (!data.name.trim() || !data.email.trim() || !data.password.trim()) {
      toast.error("All verification fields are required.");
      return;
    }

    setLoading(true);
    try {
      const responseMessage = await registerUser(data);
      toast.success(responseMessage || "Verification Email Sent.");
      navigate("/login");
    } catch (error) {
      // 🚩 FIX: Safely extract the error message string
      const errorMsg = error.response?.data?.message || error.response?.data || "System rejected credentials.";
      toast.error(typeof errorMsg === 'string' ? errorMsg : "Registration conflict detected.");
    } finally {
      setLoading(false);
    }
};

  const handleSocialLogin = (provider) => {
    window.location.href = `${import.meta.env.VITE_API_BASE_URL}/oauth2/authorization/${provider}`;
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center py-12 px-4 selection:bg-red-500/30">
      <NavLink to="/" className="text-center mb-8 group">
        <div className="inline-flex bg-gradient-to-br from-red-600 to-red-800 p-4 rounded-2xl shadow-2xl shadow-red-900/40 mb-4 transition-transform group-hover:-rotate-6">
          <HiShieldCheck className="h-10 w-10 text-white" />
        </div>
        <h2 className="text-4xl font-black tracking-tighter text-white uppercase italic leading-none">
          Plan<span className="text-red-600">Verify</span>
        </h2>
        <div className="h-1 w-12 bg-red-600 mx-auto mt-2 rounded-full group-hover:w-24 transition-all duration-500" />
      </NavLink>

      <div className="w-full max-w-md bg-slate-900/40 border border-slate-800/60 p-8 backdrop-blur-xl rounded-2xl shadow-2xl">
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-slate-400 text-[10px] uppercase tracking-widest font-black flex items-center gap-2">
              <RiUserAddLine className="text-red-500 w-3 h-3" /> Full Name
            </Label>
            <Input
              id="name"
              name="name"
              value={data.name}
              onChange={handleInputChange}
              placeholder="Enter your name"
              className="bg-slate-950/50 border-slate-800 text-white h-12 focus-visible:ring-red-600 focus-visible:ring-1"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-slate-400 text-[10px] uppercase tracking-widest font-black flex items-center gap-2">
              <RiMailSendLine className="text-red-500 w-3 h-3" /> Identity Email
            </Label>
            <Input
              id="email"
              type="email"
              name="email"
              value={data.email}
              onChange={handleInputChange}
              placeholder="email@example.com"
              className="bg-slate-950/50 border-slate-800 text-white h-12 focus-visible:ring-red-600 focus-visible:ring-1"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-slate-400 text-[10px] uppercase tracking-widest font-black flex items-center gap-2">
              <RiFingerprint2Line className="text-red-500 w-3 h-3" /> Security Passkey
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                value={data.password}
                onChange={handleInputChange}
                placeholder="••••••••"
                className="bg-slate-950/50 border-slate-800 text-white h-12 pr-10 focus-visible:ring-red-600 focus-visible:ring-1"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-red-500 transition-colors"
              >
                {showPassword ? <RiEyeOffLine size={18} /> : <RiEyeLine size={18} />}
              </button>
            </div>
          </div>

          <Button
            disabled={loading}
            type="submit"
            className="w-full bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-white font-black py-7 mt-6 uppercase tracking-widest shadow-xl shadow-red-900/20 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center gap-2 animate-pulse uppercase tracking-[0.2em] text-xs">
                Initializing System...
              </span>
            ) : "Initialize Account"}
          </Button>
        </form>

        <div className="mt-10">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="bg-slate-800" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest">
              <span className="bg-[#0b1322] px-4 text-slate-500 font-mono">Fast Registration</span>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4">
            <Button variant="outline" type="button" onClick={() => handleSocialLogin('google')} className="border-slate-800 bg-slate-950 hover:bg-slate-900 text-slate-300 h-12 transition-all group">
              <SiGoogle className="mr-2 h-4 w-4 group-hover:text-blue-500 transition-colors" /> Google
            </Button>
            <Button variant="outline" type="button" onClick={() => handleSocialLogin('github')} className="border-slate-800 bg-slate-950 hover:bg-slate-900 text-slate-300 h-12 transition-all group">
              <SiGithub className="mr-2 h-4 w-4 group-hover:text-white transition-colors" /> GitHub
            </Button>
          </div>
        </div>

        <p className="mt-10 text-center text-xs text-slate-500 font-medium">
          Already verified?{' '}
          <NavLink to="/login" className="text-red-500 font-black hover:text-red-400 underline decoration-red-900 underline-offset-8 transition-all">
            Log In to Portal
          </NavLink>
        </p>
      </div>
    </div>
  );
};

export default Signup;
import React, { useState } from 'react';
import { NavLink, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "react-hot-toast";
import { registerUser } from '@/features/auth/services/AuthService';

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
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center py-12 px-4 selection:bg-red-500/30">

      <NavLink to="/" className="text-center mb-8 group">
        <div className="inline-flex bg-red-600 p-4 rounded-2xl shadow-2xl shadow-red-900/40 mb-4 transition-transform group-hover:-rotate-6">
          <HiShieldCheck className="h-10 w-10 text-gray-900" />
        </div>

        <h2 className="text-4xl font-black tracking-tighter text-gray-900 uppercase italic leading-none">
          Shop<span className="text-red-600">Hub</span>
        </h2>

        <div className="h-1 w-12 bg-red-600 mx-auto mt-2 rounded-full group-hover:w-24 transition-all duration-500" />
      </NavLink>

      {/* CARD */}
      <div className="w-full max-w-md bg-white border border-gray-200 p-8 backdrop-blur-xl rounded-2xl shadow-2xl">

        <form onSubmit={handleFormSubmit} className="space-y-4">

          {/* NAME */}
          <div className="space-y-2">
            <Label className="text-gray-600 text-[10px] uppercase tracking-widest font-black flex items-center gap-2">
              <RiUserAddLine className="text-red-500 w-3 h-3" /> Full Name
            </Label>

            <Input
              name="name"
              value={data.name}
              onChange={handleInputChange}
              placeholder="Enter your name"
              className="bg-white border-gray-300 text-gray-900 h-12 focus-visible:ring-red-600 focus-visible:ring-1"
              required
            />
          </div>

          {/* EMAIL */}
          <div className="space-y-2">
            <Label className="text-gray-600 text-[10px] uppercase tracking-widest font-black flex items-center gap-2">
              <RiMailSendLine className="text-red-500 w-3 h-3" /> Identity Email
            </Label>

            <Input
              type="email"
              name="email"
              value={data.email}
              onChange={handleInputChange}
              placeholder="email@example.com"
              className="bg-white border-gray-300 text-gray-900 h-12 focus-visible:ring-red-600 focus-visible:ring-1"
              required
            />
          </div>

          {/* PASSWORD */}
          <div className="space-y-2">
            <Label className="text-gray-600 text-[10px] uppercase tracking-widest font-black flex items-center gap-2">
              <RiFingerprint2Line className="text-red-500 w-3 h-3" /> Security Passkey
            </Label>

            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                name="password"
                value={data.password}
                onChange={handleInputChange}
                placeholder="••••••••"
                className="bg-white border-gray-300 text-gray-900 h-12 pr-10 focus-visible:ring-red-600 focus-visible:ring-1"
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-red-500"
              >
                {showPassword ? <RiEyeOffLine size={18} /> : <RiEyeLine size={18} />}
              </button>
            </div>
          </div>

          {/* BUTTON */}
          <Button
            disabled={loading}
            type="submit"
            className="w-full bg-red-600  font-black py-7 mt-6 uppercase tracking-widest shadow-xl shadow-red-900/20"
          >
            {loading ? "Creating account…" : "Sign Up"}
          </Button>

        </form>

        {/* DIVIDER */}
        <div className="mt-10">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="bg-gray-200" />
            </div>
            {/* <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest">
              <span className="bg-white px-4 text-gray-500 font-mono">Fast Registration</span>
            </div> */}
          </div>

          {/* SOCIAL */}
          <div className="mt-8 grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              onClick={() => handleSocialLogin('google')}
              className="border-gray-300 bg-white hover:bg-gray-100 text-gray-700 h-12"
            >
              <SiGoogle className="mr-2 h-4 w-4" /> Google
            </Button>

            <Button
              variant="outline"
              onClick={() => handleSocialLogin('github')}
              className="border-gray-300 bg-white hover:bg-gray-100 text-gray-700 h-12"
            >
              <SiGithub className="mr-2 h-4 w-4" /> GitHub
            </Button>
          </div>
        </div>

        {/* LOGIN */}
        <p className="mt-10 text-center text-xs text-gray-500 font-medium">
          Already verified?{" "}
          <NavLink to="/login" className="text-red-500 font-black">
            Log In
          </NavLink>
        </p>

      </div>
    </div>
  );
};

export default Signup;
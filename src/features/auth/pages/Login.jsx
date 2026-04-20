import React, { useState, useEffect } from "react";
import { NavLink, useNavigate, useSearchParams } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "react-hot-toast";
import { SiGithub, SiGoogle } from "react-icons/si";
import { HiShieldCheck } from "react-icons/hi";
import { RiUserReceived2Line, RiLockPasswordLine } from "react-icons/ri";
import { Loader2 } from "lucide-react";

// ✅ Zustand
import useAuth from "../store/store.js";

const Login = () => {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const login = useAuth((state) => state.login);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.get("verified") === "true") {
      toast.success("Email successfully verified! Identity Confirmed.");
    }

    if (searchParams.get("error") === "invalid_code") {
      toast.error("Verification link expired or invalid.");
    }
  }, [searchParams]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(loginData);
      navigate("/products");
    } catch (err) {
      toast.error("Invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center py-12 px-4 selection:bg-red-500/30">

      {/* Logo */}
      <NavLink to="/" className="text-center mb-8 group">
        <div className="inline-flex bg-red-600 p-4 rounded-2xl shadow-2xl shadow-red-900/40 mb-4 transition-transform group-hover:-rotate-6">
          <HiShieldCheck className="h-10 w-10" />
        </div>

        <h2 className="text-4xl font-black tracking-tighter uppercase italic leading-none">
          Shop<span className="text-red-600">Hub</span>
        </h2>

        <div className="h-1 w-12 bg-red-600 mx-auto mt-2 rounded-full group-hover:w-24 transition-all duration-500" />
      </NavLink>

      {/* Card */}
      <div className="w-full max-w-md bg-white border border-gray-200 p-8 backdrop-blur-xl rounded-2xl shadow-2xl">

        <form onSubmit={handleFormSubmit} className="space-y-6">

          {/* Email */}
          <div className="space-y-2">
            <Label className=" text-[10px] uppercase tracking-widest font-black flex items-center gap-2">
              <RiUserReceived2Line className="text-red-500 w-3 h-3" />
              Email
            </Label>

            <Input
              name="email"
              type="email"
              value={loginData.email}
              placeholder="user@example.com"
              onChange={handleInputChange}
              className="bg-white border-gray-300 text-gray-900 h-12"
              required
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label className="text-gray-600 text-[10px] uppercase tracking-widest font-black flex items-center gap-2">
              <RiLockPasswordLine className="text-red-500 w-3 h-3" />
              Password
            </Label>

            <Input
              name="password"
              type="password"
              value={loginData.password}
              placeholder="••••••••"
              onChange={handleInputChange}
              className="bg-white border-gray-300 text-gray-900 h-12"
              required
            />
          </div>

          {/* Submit */}
          <Button
            disabled={loading}
            type="submit"
            className="w-full bg-red-600  font-black py-7 uppercase tracking-widest"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin mx-auto" />
            ) : (
              "Login"
            )}
          </Button>

        </form>

        {/* Signup */}
        <p className="mt-10 text-center text-xs text-gray-500">
          New operative?{" "}
          <NavLink to="/signup" className="text-red-500 font-black">
            Register Account
          </NavLink>
        </p>

        {/* Social */}
        <div className="mt-8 grid grid-cols-2 gap-4">

          <Button
            variant="outline"
            onClick={() =>
              (window.location.href =
                `${import.meta.env.VITE_API_BASE_URL}/oauth2/authorization/google`)
            }
          >
            <SiGoogle className="mr-2" /> Google
          </Button>

          <Button
            variant="outline"
            onClick={() =>
              (window.location.href =
                `${import.meta.env.VITE_API_BASE_URL}/oauth2/authorization/github`)
            }
          >
            <SiGithub className="mr-2" /> GitHub
          </Button>

        </div>

      </div>
    </div>
  );
};

export default Login;
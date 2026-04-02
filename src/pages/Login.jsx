import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useSearchParams } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "react-hot-toast";
import { SiGithub, SiGoogle } from "react-icons/si";
import { HiShieldCheck } from "react-icons/hi";
import { RiUserReceived2Line, RiLockPasswordLine } from "react-icons/ri";
import { Loader2 } from "lucide-react";
import { loginUser } from '@/services/AuthService';
import { useAuth } from '../contex/AuthContex';

const Login = () => {
    const [loginData, setLoginData] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    // STEP 5: Check for verification success from email link redirect
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
        setLoginData(prev => ({ ...prev, [name]: value }));
    };

    const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
        // Just call the context login directly
        await login(loginData); 
        
        toast.success("Identity Verified. Portal Access Granted.");
        navigate("/profile");
    } catch (err) {
        toast.error("Invalid credentials.");
    } finally {
        setLoading(false);
    }
};

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center py-12 px-4 selection:bg-red-500/30">
            {/* Brand Identity */}
            <NavLink to="/" className="text-center mb-8 group">
                <div className="inline-flex bg-gradient-to-br from-red-600 to-red-800 p-4 rounded-2xl shadow-2xl shadow-red-900/40 mb-4 transition-transform group-hover:-rotate-6">
                    <HiShieldCheck className="h-10 w-10 text-white" />
                </div>
                <h2 className="text-4xl font-black tracking-tighter text-white uppercase italic leading-none">
                    Plan<span className="text-red-600">Verify</span>
                </h2>
                <div className="h-1 w-12 bg-red-600 mx-auto mt-2 rounded-full group-hover:w-24 transition-all duration-500" />
            </NavLink>

            {/* Login Card */}
            <div className="w-full max-w-md bg-slate-900/40 border border-slate-800/60 p-8 backdrop-blur-xl rounded-2xl shadow-2xl">
                <form onSubmit={handleFormSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-slate-400 text-[10px] uppercase tracking-widest font-black flex items-center gap-2">
                            <RiUserReceived2Line className="text-red-500 w-3 h-3" /> Identity Email
                        </Label>
                        <Input
                            name="email"
                            type="email"
                            value={loginData.email}
                            placeholder="user@example.com"
                            onChange={handleInputChange}
                            className="bg-slate-950/50 border-slate-800 text-white h-12 focus-visible:ring-red-600 focus-visible:ring-1"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password" className="text-slate-400 text-[10px] uppercase tracking-widest font-black flex items-center gap-2">
                            <RiLockPasswordLine className="text-red-500 w-3 h-3" /> Secure Passkey
                        </Label>
                        <Input
                            name="password"
                            type="password"
                            value={loginData.password}
                            placeholder="••••••••"
                            onChange={handleInputChange}
                            className="bg-slate-950/50 border-slate-800 text-white h-12 focus-visible:ring-red-600 focus-visible:ring-1"
                            required
                        />
                    </div>

                    <Button
                        disabled={loading}
                        type="submit"
                        className="w-full bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-white font-black py-7 uppercase tracking-widest shadow-xl shadow-red-900/20 active:scale-[0.98] transition-all"
                    >
                        {loading ? <Loader2 className="h-5 w-5 animate-spin mx-auto" /> : "Access Profile"}
                    </Button>
                </form>

                <div className="mt-10">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center"><Separator className="bg-slate-800" /></div>
                        <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest">
                            <span className="bg-[#0b1322] px-4 text-slate-500 font-mono">SSO Gateway</span>
                        </div>
                    </div>

                    <div className="mt-8 grid grid-cols-2 gap-4">
                        <Button
                            variant="outline"
                            type="button"
                            onClick={() => window.location.href = `${import.meta.env.VITE_API_BASE_URL}/oauth2/authorization/google`}
                            className="border-slate-800 bg-slate-950 hover:bg-slate-900 text-slate-300 h-12 transition-all"
                        >
                            <SiGoogle className="mr-2 h-4 w-4" /> Google
                        </Button>
                        <Button
                            variant="outline"
                            type="button"
                            onClick={() => window.location.href = `${import.meta.env.VITE_API_BASE_URL}/oauth2/authorization/github`}
                            className="border-slate-800 bg-slate-950 hover:bg-slate-900 text-slate-300 h-12 transition-all"
                        >
                            <SiGithub className="mr-2 h-4 w-4" /> GitHub
                        </Button>
                    </div>
                </div>

                <p className="mt-10 text-center text-xs text-slate-500 font-medium">
                    New operative?{' '}
                    <NavLink to="/signup" className="text-red-500 font-black hover:text-red-400 underline decoration-red-900 underline-offset-8 transition-all">
                        Register Account
                    </NavLink>
                </p>
            </div>
        </div>
    );
};

export default Login;
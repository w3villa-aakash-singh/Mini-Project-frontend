import React, { useState } from 'react';
import { NavLink, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

import { SiGithub, SiGoogle } from "react-icons/si";
import { HiShieldCheck } from "react-icons/hi"; 
import { RiLockPasswordLine, RiUserReceived2Line } from "react-icons/ri";

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("PlanVerify Login:", formData);
    };

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center py-12 px-4">
            {/* Brand Identity */}
            <NavLink to="/" className="text-center mb-8 group">
                <div className="inline-flex bg-gradient-to-br from-red-600 to-red-800 p-4 rounded-2xl shadow-2xl shadow-red-900/40 mb-4 group-hover:scale-110 transition-all">
                    <HiShieldCheck className="h-10 w-10 text-white" />
                </div>
                <h2 className="text-4xl font-black tracking-tighter text-white uppercase italic leading-none">
                    Plan<span className="text-red-600">Verify</span>
                </h2>
            </NavLink>

            <div className="w-full max-w-md bg-slate-900/40 border border-slate-800/60 p-8 backdrop-blur-xl rounded-2xl shadow-2xl">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-slate-400 text-[10px] uppercase tracking-[0.2em] font-black flex items-center gap-2">
                            <RiUserReceived2Line className="text-red-500 w-3 h-3" /> Identity Email
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="user@w3villa.com"
                            className="bg-slate-950/50 border-slate-800 text-white focus:ring-2 focus:ring-red-600/50 focus:border-red-600 h-12"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="password" className="text-slate-400 text-[10px] uppercase tracking-[0.2em] font-black flex items-center gap-2">
                                <RiLockPasswordLine className="text-red-500 w-3 h-3" /> Secure Passkey
                            </Label>
                            {/* <NavLink to="/forgot" className="text-[10px] text-red-500 hover:text-red-400 font-bold uppercase tracking-widest">Lost Key?</NavLink> */}
                        </div>
                        <Input
                            id="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="bg-slate-950/50 border-slate-800 text-white focus:ring-2 focus:ring-red-600/50 focus:border-red-600 h-12"
                            required
                        />
                    </div>

                    <Button type="submit" className="w-full bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-white font-black py-7 uppercase tracking-widest shadow-lg active:scale-[0.98] transition-all">
                        Access Dashboard
                    </Button>
                </form>

                <div className="mt-10">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center"><Separator className="bg-slate-800" /></div>
                        <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-[0.3em]"><span className="bg-[#0b1221] px-4 text-slate-500">SSO Gateway</span></div>
                    </div>

                    <div className="mt-8 grid grid-cols-2 gap-4">
                        <Button variant="outline" type="button" className="border-slate-800 bg-slate-950 hover:bg-slate-900 text-slate-300 h-12 group">
                            <SiGoogle className="mr-2 h-4 w-4 group-hover:text-[#4285F4] transition-colors" /> Google
                        </Button>
                        <Button variant="outline" type="button" className="border-slate-800 bg-slate-950 hover:bg-slate-900 text-slate-300 h-12 group">
                            <SiGithub className="mr-2 h-4 w-4 group-hover:text-white transition-colors" /> GitHub
                        </Button>
                    </div>
                </div>

                <p className="mt-10 text-center text-xs text-slate-500 font-medium">
                    New operative?{' '}
                    <NavLink to="/signup" className="text-red-500 font-black hover:text-red-400 underline decoration-red-900 underline-offset-8">
                        Register Account
                    </NavLink>
                </p>
            </div>
        </div>
    );
};

export default Login;
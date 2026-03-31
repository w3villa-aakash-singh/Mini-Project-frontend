import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router";
import axios from "axios";
import { toast } from "react-hot-toast";
import { HiShieldCheck } from "react-icons/hi";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  
  const code = searchParams.get("code");
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const verify = async () => {
      if (!code) {
        toast.error("Security code missing.");
        setLoading(false);
        return;
      }

      try {
        // Hits http://localhost:8080/api/v1/auth/verify
        const response = await axios.get(`${API_BASE_URL}/auth/verify?code=${code}`);
        
        toast.success(typeof response.data === 'string' ? response.data : "Account Verified!");
        
        // Redirect to login after a short delay
        setTimeout(() => navigate("/login"), 2000);
      } catch (error) {
        // Handle potential "Object" crash from Spring error responses
        const msg = typeof error.response?.data === 'string' 
          ? error.response.data 
          : "Verification failed: Code is invalid or already used.";
        
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, [code, navigate, API_BASE_URL]);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center">
      <div className="bg-slate-900/40 border border-slate-800 p-10 rounded-2xl text-center backdrop-blur-xl">
        <div className="inline-flex bg-red-600/20 p-4 rounded-xl mb-6">
          <HiShieldCheck className={`h-10 w-10 ${loading ? 'animate-pulse text-slate-500' : 'text-red-500'}`} />
        </div>
        <h2 className="text-2xl font-black text-white uppercase tracking-tighter">
          {loading ? "Decrypting Protocol..." : "Verification System"}
        </h2>
        <p className="text-slate-400 mt-2 text-sm">
          {loading ? "Validating security credentials with the core..." : "Check your Profile for status."}
        </p>
      </div>
    </div>
  );
};

export default VerifyEmail;
import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { toast } from "react-hot-toast";
import { HiShieldCheck } from "react-icons/hi";

// ✅ Use service (NO direct API call)
import { verifyEmail } from "@/features/auth/services/AuthService";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const code = searchParams.get("code");

  useEffect(() => {
    const verify = async () => {
      if (!code) {
        toast.error("Security code missing.");
        setLoading(false);
        return;
      }

      try {
        // ✅ Service call
        const response = await verifyEmail(code);

        toast.success(
          typeof response === "string"
            ? response
            : "Account Verified!"
        );

        // Redirect after success
        setTimeout(() => navigate("/login"), 2000);
      } catch (error) {
        const msg =
          typeof error.response?.data === "string"
            ? error.response.data
            : "Verification failed: Code is invalid or already used.";

        toast.error(msg);
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, [code, navigate]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
      <div className="bg-slate-900/40 border border-slate-800 p-10 rounded-2xl text-center backdrop-blur-xl">

        <div className="inline-flex bg-red-600/20 p-4 rounded-xl mb-6">
          <HiShieldCheck
            className={`h-10 w-10 ${
              loading
                ? "animate-pulse text-slate-500"
                : "text-red-500"
            }`}
          />
        </div>

        <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">
          {loading
            ? "Decrypting Protocol..."
            : "Verification System"}
        </h2>

        <p className="text-slate-400 mt-2 text-sm">
          {loading
            ? "Validating security credentials with the core..."
            : "Check your Profile for status."}
        </p>

      </div>
    </div>
  );
};

export default VerifyEmail;
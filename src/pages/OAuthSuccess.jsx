import React, { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../contex/AuthContex";
import { refreshToken } from "@/services/AuthService";

function OAuthSuccess() {
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const init = async () => {
      try {
        const data = await refreshToken();
        if (data.accessToken) {
          login(data.user, data.accessToken);
          navigate("/dashboard");
        }
      } catch (err) { navigate("/login"); }
    };
    init();
  }, []);

  return <div className="h-screen bg-slate-950 flex items-center justify-center text-white">Verifying...</div>;
}

export default OAuthSuccess;
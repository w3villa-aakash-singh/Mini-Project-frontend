import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../contex/AuthContex"; // 🚩 Corrected path

const OAuthSuccess = () => {
  const navigate = useNavigate();
  const { refreshUser } = useAuth(); // 🚩 Use the context function

  useEffect(() => {
    const handleOAuth = async () => {
      try {
        // This function already handles axios, localStorage, and SETTING REACT STATE
        await refreshUser();
        
        // Once state is updated, move to profile
        navigate("/profile");
      } catch (e) {
        console.error("OAuth Refresh Error:", e);
        navigate("/login");
      }
    };

    handleOAuth();
  }, [refreshUser, navigate]);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center text-white">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600 mb-4"></div>
      <h2 className="text-xl font-black tracking-widest uppercase italic">
        Finalizing <span className="text-red-600">Secure</span> Login
      </h2>
    </div>
  );
};

export default OAuthSuccess;
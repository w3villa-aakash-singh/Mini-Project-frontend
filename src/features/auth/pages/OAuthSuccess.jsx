import { useEffect } from "react";
import { useNavigate } from "react-router";

// ✅ Zustand
import useAuth from "../store/store.js";

// ✅ Service
import { refreshToken } from "@/features/auth/services/AuthService.js";

const OAuthSuccess = () => {
  const navigate = useNavigate();

  const setAuth = useAuth((state) => state.login); // reuse login logic
  const setState = useAuth.setState;

  useEffect(() => {
    const handleOAuth = async () => {
      try {
        // ✅ Call refresh API
        const res = await refreshToken();

        // ✅ Update Zustand manually
        setState({
          accessToken: res.accessToken,
          user: res.user,
          authStatus: true,
        });

        navigate("/profile");
      } catch (e) {
        console.error("OAuth Refresh Error:", e);
        navigate("/login");
      }
    };

    handleOAuth();
  }, [navigate, setAuth]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center text-gray-900">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600 mb-4"></div>

      <h2 className="text-xl font-black tracking-widest uppercase italic">
        Finalizing <span className="text-red-600">Secure</span> Login
      </h2>
    </div>
  );
};

export default OAuthSuccess;
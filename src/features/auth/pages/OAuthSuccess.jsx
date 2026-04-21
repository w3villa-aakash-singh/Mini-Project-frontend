import { useEffect } from "react";
import { useNavigate } from "react-router";
import useAuth from "../store/store.js";
import axiosClient from "../../../config/axiosClient.js"; // ✅ make sure path is correct

const OAuthSuccess = () => {
  const navigate = useNavigate();
  const setState = useAuth.setState;

  useEffect(() => {
    const handleOAuth = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");

        if (!token) throw new Error("No token");

        // ✅ Step 1: store access token
        setState({
          accessToken: token,
          authStatus: true,
        });

        // ✅ Step 2: wait briefly, then fetch user
        setTimeout(async () => {
          try {
            const userRes = await axiosClient.get("/auth/me");

            // ✅ Step 3: merge user into state (don't overwrite)
            setState((prev) => ({
              ...prev,
              user: userRes.data.user,
            }));

            navigate("/profile");
          } catch (e) {
            console.error("User fetch failed:", e);
            navigate("/login");
          }
        }, 400);

      } catch (e) {
        console.error("OAuth error:", e);
        navigate("/login");
      }
    };

    handleOAuth();
  }, [navigate, setState]);

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
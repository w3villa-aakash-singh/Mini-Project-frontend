import { useEffect } from "react";
import { useNavigate } from "react-router";
import axios from "axios";

const OAuthSuccess = () => {
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const handleOAuth = async () => {
      try {
        const res = await axios.post(
          `${API_BASE_URL}/api/v1/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const { accessToken, user } = res.data;

        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("user", JSON.stringify(user));

        navigate("/profile");
      } catch (e) {
        navigate("/login");
      }
    };

    handleOAuth();
  }, []);

  return <div className="text-white text-center mt-10">Logging you in...</div>;
};

export default OAuthSuccess;
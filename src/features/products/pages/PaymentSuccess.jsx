import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import useCart from "../store/cart";
import useAuth from "@/features/auth/store/store";
import toast from "react-hot-toast";
import apiClient from "../../../config/axiosClient";

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const fetchCart = useCart((state) => state.fetchCart);
  const refreshUser = useAuth((state) => state.refreshUser);

  useEffect(() => {
  const sessionId = params.get("session_id");

  if (!sessionId) return;

  const run = async () => {
    try {
      // 🔥 THIS IS REQUIRED
      await apiClient.get("/payments/success", {
        params: { session_id: sessionId },
      });

      await refreshUser();
      await fetchCart();

      toast.success("Plan upgraded");

      setTimeout(() => {
        navigate("/profile");
      }, 2000);

    } catch (err) {
      console.error("❌ ERROR:", err.response?.data || err.message);
      toast.error("Payment processing failed");
    }
  };

  run();
}, [])

  return (
    <div className="text-gray-900 text-center mt-20">
      <h1 className="text-3xl font-bold">
        Payment Successful 🎉
      </h1>
      <p>Updating your plan...</p>
    </div>
  );
}
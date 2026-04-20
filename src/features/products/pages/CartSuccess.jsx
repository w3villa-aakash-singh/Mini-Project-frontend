import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import apiClient from "@/config/axiosClient";
import useCart from "../store/cart";
import toast from "react-hot-toast";

export default function CartSuccess() {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const fetchCart = useCart((state) => state.fetchCart);

  useEffect(() => {
    const sessionId = params.get("session_id");

    if (!sessionId) return;

    const run = async () => {
      try {
        // 🔥 VERY IMPORTANT (this creates orders + clears cart)
        await apiClient.get("/payments/success", {
          params: { session_id: sessionId },
        });

        // 🔄 refresh cart (should be empty now)
        await fetchCart();

        toast.success("Order placed successfully 🎉");

        // ⏳ redirect
        setTimeout(() => {
          navigate("/orders");
        }, 2000);

      } catch (err) {
        console.error(err);
        toast.error("Payment processing failed");
      }
    };

    run();
  }, []);

  return (
    <div className="bg-gray-100 text-gray-900 flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold">Payment Successful 🎉</h1>
      <p className="mt-4 text-gray-400">
        Processing your order...
      </p>
    </div>
  );
}
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import apiClient from "@/config/axiosClient";
import toast from "react-hot-toast";
import { useRef } from "react";

export default function ProductSuccess() {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const hasRun = useRef(false);

useEffect(() => {
  if (hasRun.current) return; // 🚫 stop second call
  hasRun.current = true;

  const sessionId = params.get("session_id");
  if (!sessionId) return;

  const run = async () => {
    try {
      await apiClient.get("/payments/success", {
        params: { session_id: sessionId },
      });

      toast.success("Order placed successfully 🎉");

      setTimeout(() => {
        navigate("/orders");
      }, 2000);

    } catch (err) {
      console.error(err);
      toast.error("Order failed");
    }
  };

  run();
}, []);

  return (
    <div className="text-gray-900 text-center mt-20">
      <h1 className="text-3xl font-bold">
        Order Successful 🎉
      </h1>
      <p>Processing your order...</p>
    </div>
  );
}
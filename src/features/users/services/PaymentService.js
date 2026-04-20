import apiClient from "@/config/axiosClient";

export const createCheckoutSession = async (planName, userId) => {
  const res = await apiClient.post(
    "/payments/create-checkout-session",
    { planName, userId }
  );
  return res.data;
};
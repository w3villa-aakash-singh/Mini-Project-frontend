import apiClient from "../../../config/axiosClient";

// Buy product
export const buyProduct = async (productId, userId) => {
  return apiClient.post("/payments/create-product-session", {
    productId,
    userId,
  });
};

export const checkoutCart = async (cart) => {
  const payload = {
    items: cart.map(item => ({
      productId: item.id,
      quantity: item.qty
    }))
  };

  console.log("apiClient:", apiClient);

  const res = await apiClient.post("/payments/checkout/cart", payload);
  return res.data;
};

// Get orders
export const getOrders = () => {
  return apiClient.get("/orders");
};
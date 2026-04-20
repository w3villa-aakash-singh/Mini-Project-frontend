import { useEffect, useState } from "react";
import { getOrders } from "@/features/orders/services/OrderService";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true); // ✅ NEW
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true); // ✅ start loading

      try {
        const res = await getOrders();
        setOrders(res.data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load orders");
      } finally {
        setLoading(false); // ✅ stop loading
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 p-6">
      <h1 className="text-3xl font-bold mb-6">My Orders</h1>

      {/* ✅ LOADER */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
        </div>
      ) : orders.length === 0 ? (
        <p>No orders found</p>
      ) : (
        <div className="grid gap-4">
          {orders.map((order) => (
            <div
              key={order.id}
              onClick={() => navigate(`/product/${order.productId}`)}
              className="bg-white border border-gray-200 p-4 rounded-lg flex gap-4 items-center cursor-pointer hover:bg-gray-50 transition"
            >

              {/* IMAGE */}
              <img
                src={order.imageUrl || "/placeholder.png"}
                alt={order.productName}
                className="w-20 h-20 object-contain rounded bg-gray-100"
              />

              {/* DETAILS */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {order.productName}
                </h2>

                <p className="text-gray-700">
                  Amount: $ {order.paidAmount}
                </p>

                <p className="text-gray-700">
                  Quantity: {order.quantity}
                </p>

                <p className="text-sm text-gray-500">
                  {new Date(order.purchaseDate).toLocaleString()}
                </p>

                <p className="text-xs text-blue-600 mt-1">
                  Click to view →
                </p>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}
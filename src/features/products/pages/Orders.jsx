import { useEffect, useState } from "react";
import apiClient from "../../../config/axiosClient";

export default function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    apiClient.get("/orders").then(res => setOrders(res.data));
  }, []);

  return (
    <div className="bg-gray-100 text-gray-900 p-6 min-h-screen">
      <h1 className="text-3xl mb-6">Order History 📦</h1>

      {orders.length === 0 ? (
        <p>No orders yet</p>
      ) : (
        orders.map(o => (
          <div key={o.id} className="bg-slate-800 p-4 mb-4">
            <h2 className="font-bold">{o.product.name}</h2>
            <p>$ {o.paidAmount}</p>
          </div>
        ))
      )}
    </div>
  );
}
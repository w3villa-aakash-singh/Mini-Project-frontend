import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { getProduct } from "../services/ProductService";
import { buyProduct } from "../../orders/services/OrderService";
import useCart from "../store/cart";
import useAuth from "@/features/auth/store/store";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { Loader2 } from "lucide-react";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const user = useAuth((state) => state.user);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [buyLoading, setBuyLoading] = useState(false);
  const addToCart = useCart((state) => state.addToCart);

  useEffect(() => {
    getProduct(id).then(setProduct);
  }, [id]);

  const handleBuy = async () => {
    if (!user) {
      toast.error("Please login");
      navigate("/login");
      return;
    }

    try {
      const res = await buyProduct(product.id, user.id);

      if (res?.data?.url) {
        window.location.href = res.data.url;
      } else {
        toast.error("Payment URL not found");
      }
    } catch (err) {
      console.error(err);
      toast.error("Payment failed");
    }
  };

  if (!product) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="bg-white/70 backdrop-blur-md shadow-xl rounded-2xl px-8 py-6 flex flex-col items-center gap-4 border">
          <Loader2 className="h-10 w-10 animate-spin text-red-500" />
          <p className="text-gray-700 font-medium">Fetching product details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen px-4 py-10">

      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10">

        {/* 🖼️ IMAGE CARD */}
        <div className="bg-white border rounded-xl p-6 shadow-sm flex items-center justify-center h-[400px]">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="max-h-full object-contain"
          />
        </div>

        {/* 📦 DETAILS CARD */}
        <div className="bg-white border rounded-xl p-6 shadow-sm flex flex-col gap-4">

          {/* TITLE */}
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-800">
            {product.name}
          </h1>

          {/* RATING */}
          <div className="flex items-center gap-2 text-yellow-500 text-sm">
            ⭐⭐⭐⭐☆
            <span className="text-gray-500">(120 reviews)</span>
          </div>

          {/* PRICE */}
          <div className="flex items-center gap-3 mt-2">
            <span className="text-3xl font-bold text-red-600">
              $ {product.discountedPrice}
            </span>

            {product.discountPercent > 0 && (
              <>
                <span className="line-through text-gray-400">
                  $ {product.basePrice}
                </span>
                <span className="text-green-600 text-sm font-medium">
                  {product.discountPercent}% OFF
                </span>
              </>
            )}
          </div>

          {/* DESCRIPTION */}
          <p className="text-gray-600 leading-relaxed mt-3">
            {product.description}
          </p>

          {/* DELIVERY INFO */}
          <div className="bg-gray-50 border rounded-lg p-4 text-sm text-gray-700 mt-4 space-y-1">
            <p>🚚 Free delivery in 2-4 days</p>
            <p>🔒 Secure payment</p>
            <p>↩️ 7-day return policy</p>
          </div>

          {/* BUTTONS */}
          <div className="flex gap-4 mt-6">

            <button
              onClick={async () => {
                setLoading(true);
                try {
                  await addToCart(product);
                } finally {
                  setLoading(false);
                }
              }}
              disabled={loading}
              className="flex-1 bg-yellow-400 text-black font-medium py-3 rounded-lg hover:bg-yellow-500 transition flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? (
                <>
                  <span className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  Adding...
                </>
              ) : (
                "Add to Cart"
              )}
            </button>

            <button
  onClick={async () => {
    setBuyLoading(true);
    try {
      await handleBuy(); // your existing function
    } finally {
      setBuyLoading(false);
    }
  }}
  disabled={buyLoading}
  className="flex-1 bg-red-600 text-white font-medium py-3 rounded-lg hover:bg-red-700 transition flex items-center justify-center gap-2 disabled:opacity-70"
>
  {buyLoading ? (
    <>
      <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
      Processing...
    </>
  ) : (
    "Buy Now"
  )}
</button>

          </div>

        </div>

      </div>

    </div>
  );
}
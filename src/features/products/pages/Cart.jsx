import { useEffect, useState } from "react";
import useCart from "../store/cart";
import useAuth from "../../auth/store/store";
import { useNavigate } from "react-router";
import { checkoutCart } from "../../../api";
import toast from "react-hot-toast";

export default function Cart() {
  const navigate = useNavigate();

  const {
    cart,
    fetchCart,
    removeFromCart,
    updateQty
  } = useCart();

  const { authStatus } = useAuth();
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [removingId, setRemovingId] = useState(null);

  useEffect(() => {
    if (authStatus) fetchCart();
  }, [authStatus]);

  // 🔒 NOT LOGGED IN
  if (!authStatus) {
    return (
      <div className="bg-gray-50 min-h-screen flex flex-col items-center justify-center text-center p-6">
        <h1 className="text-3xl font-semibold mb-3">🛒 Your Cart is Waiting</h1>
        <p className="text-gray-600 mb-6 max-w-md">
          Please login or create an account to view your cart.
        </p>

        <div className="flex gap-4">
          <button
            onClick={() => navigate("/login")}
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"
          >
            Login
          </button>

          <button
            onClick={() => navigate("/signup")}
            className="bg-gray-200 px-6 py-2 rounded-lg hover:bg-gray-300"
          >
            Signup
          </button>
        </div>
      </div>
    );
  }

  const total = cart.reduce(
    (sum, item) =>
      sum + (item.product?.basePrice || 0) * item.quantity,
    0
  );

  const handleCheckout = async () => {
    try {
      const totalAmount = total;

      const res = await checkoutCart({
        userId: JSON.parse(localStorage.getItem("app_state"))?.state?.user?.id,
        totalAmount: String(totalAmount * 100)
      });

      window.location.href = res.data.url;

    } catch (err) {
      console.error(err);
      toast.error("Checkout failed");
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen px-4 py-8">

      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">

        {/* 🛒 LEFT: CART ITEMS */}
        <div className="md:col-span-2 space-y-4">

          <h1 className="text-2xl font-semibold">My Cart</h1>

          {cart.length === 0 ? (
            <div className="bg-white border rounded-lg p-6 text-center text-gray-500">
              Your cart is empty
            </div>
          ) : (
            cart.map(item => (
              <div
                key={item.id}
                className="bg-white border rounded-lg p-4 flex gap-4 items-center hover:shadow-sm transition"
              >

                {/* IMAGE */}
                <img
                  src={item.product?.imageUrl || "/placeholder.png"}
                  alt={item.product?.name}
                  className="w-20 h-20 object-contain"
                />

                {/* DETAILS */}
                <div className="flex-1">
                  <h2
                    onClick={() => navigate(`/product/${item.product?.id}`)}
                    className="font-medium cursor-pointer hover:text-red-600"
                  >
                    {item.product?.name}
                  </h2>

                  <p className="text-gray-600 text-sm">
                    $ {item.product?.basePrice}
                  </p>
                </div>

                {/* QTY */}
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-2 border rounded-lg px-2 py-1"
                >
                  <button
                    onClick={() => updateQty(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    className="px-2"
                  >
                    -
                  </button>

                  <span className="text-sm">{item.quantity}</span>

                  <button
                    onClick={() => updateQty(item.id, item.quantity + 1)}
                    className="px-2"
                  >
                    +
                  </button>
                </div>

                {/* REMOVE */}
                <button
  onClick={async (e) => {
    e.stopPropagation();
    setRemovingId(item.id);

    try {
      await removeFromCart(item.id);
    } finally {
      setRemovingId(null);
    }
  }}
  disabled={removingId === item.id}
  className="text-red-600 text-sm hover:underline flex items-center gap-1 disabled:opacity-50"
>
  {removingId === item.id ? (
    <span className="w-3 h-3 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></span>
  ) : (
    "Remove"
  )}
</button>
              </div>
            ))
          )}

        </div>

        {/* 💳 RIGHT: SUMMARY */}
        <div className="bg-white border rounded-lg p-6 h-fit shadow-sm">

          <h2 className="text-lg font-semibold mb-4">
            Order Summary
          </h2>

          <div className="flex justify-between text-sm mb-2">
            <span>Items</span>
            <span>{cart.length}</span>
          </div>

          <div className="flex justify-between text-sm mb-4">
            <span>Total</span>
            <span className="font-medium">$ {total}</span>
          </div>

          <button
            onClick={async () => {
              setCheckoutLoading(true);
              try {
                await handleCheckout();
              } finally {
                setCheckoutLoading(false);
              }
            }}
            disabled={checkoutLoading}
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {checkoutLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              "Checkout"
            )}
          </button>

        </div>

      </div>
    </div>
  );
}
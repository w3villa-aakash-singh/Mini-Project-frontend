import { useEffect, useState } from "react";
import {
  getProducts,
  searchProducts,
  getByCategory,
  getCategories
} from "../services/ProductService";
import { useNavigate, useLocation } from "react-router";
import useCart from "../store/cart.js";

export default function ProductList() {
  const [allProducts, setAllProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true); // ✅ NEW

  const PRODUCTS_PER_PAGE = 20;

  const navigate = useNavigate();
  const location = useLocation();
  const addToCart = useCart(state => state.addToCart);
  const [loadingId, setLoadingId] = useState(null);

  const totalPages = Math.ceil(allProducts.length / PRODUCTS_PER_PAGE);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get("search");

    if (q) {
      setLoading(true);
      searchProducts(q)
        .then(data => {
          setAllProducts(data);
          setCurrentPage(1);
        })
        .finally(() => setLoading(false));
    } else {
      loadProducts();
    }
  }, [location.search]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const res = await getProducts();
      setAllProducts(res.content);
      setCurrentPage(1);
    } finally {
      setLoading(false);
    }
    setSelectedCategory(null);
  };

  const loadCategories = async () => {
    const data = await getCategories();
    setCategories(data);
  };

  const handleCategory = async (id) => {
    setSelectedCategory(id);
    setLoading(true);

    try {
      const data = await getByCategory(id);
      setAllProducts(data);
      setCurrentPage(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const start = (currentPage - 1) * PRODUCTS_PER_PAGE;
    const end = start + PRODUCTS_PER_PAGE;
    setProducts(allProducts.slice(start, end));
  }, [allProducts, currentPage]);

  return (
    <div className="bg-gray-100 text-gray-900 min-h-screen">

      {/* CATEGORY BAR */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex gap-4 overflow-x-auto">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => handleCategory(cat.id)}
            className={`text-sm whitespace-nowrap px-3 py-1 rounded-full ${
              selectedCategory === cat.id
                ? "bg-gray-900 text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            {cat.name}
          </button>
        ))}

        <button
          onClick={loadProducts}
          className="px-3 py-1 bg-gray-100 rounded-full hover:bg-gray-200"
        >
          All
        </button>
      </div>

      {/* PRODUCTS */}
      <div className="px-10 py-10 max-w-7xl mx-auto">

        {loading ? (
          // ✅ LOADER
          <div className="flex justify-center items-center h-64">
            <div className="w-12 h-12 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">

            {products.map(p => (
              <div
                key={p.id}
                onClick={() => navigate(`/product/${p.id}`)}
                className="bg-white rounded-xl border border-gray-200 hover:shadow-md transition duration-300 cursor-pointer"
              >

                {/* IMAGE */}
                <div className="h-48 w-full bg-white flex items-center justify-center p-4">
                  <img
                    src={p.imageUrl}
                    alt={p.name}
                    className="h-full w-full object-contain transition-transform duration-300 hover:scale-105"
                  />
                </div>

                {/* CONTENT */}
                <div className="p-4 flex flex-col gap-2">

                  <h2 className="text-sm text-gray-800 line-clamp-2">
                    {p.name}
                  </h2>

                  {/* PRICE */}
                  <div className="flex gap-2 items-center flex-wrap">
                    <p className="text-red-500 font-bold text-lg">
                      $ {Math.round(p.discountedPrice)}
                    </p>

                    {p.discountPercent > 0 && (
                      <>
                        <p className="line-through text-sm text-gray-400">
                          $ {Math.round(p.basePrice)}
                        </p>
                        <span className="text-green-600 text-xs font-semibold">
                          {p.discountPercent}% OFF
                        </span>
                      </>
                    )}
                  </div>

                  {/* BUTTONS */}
                  <div className="flex gap-2 mt-3">

                    <button
                      onClick={async (e) => {
                        e.stopPropagation();
                        setLoadingId(p.id);

                        try {
                          await addToCart(p);
                        } finally {
                          setLoadingId(null);
                        }
                      }}
                      disabled={loadingId === p.id}
                      className="flex-1 bg-yellow-400 hover:bg-yellow-300 text-black py-2 rounded text-sm font-semibold flex items-center justify-center"
                    >
                      {loadingId === p.id ? (
                        <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      ) : (
                        "Add to Cart"
                      )}
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/product/${p.id}`);
                      }}
                      className="flex-1 bg-gray-900 text-white hover:bg-gray-800 py-2 rounded text-sm"
                    >
                      View
                    </button>

                  </div>

                </div>
              </div>
            ))}

          </div>
        )}

      </div>

      {/* PAGINATION */}
      <div className="flex justify-center mt-10 gap-2 flex-wrap pb-10">

        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(prev => prev - 1)}
          className="px-3 py-1 bg-white border border-gray-300 disabled:opacity-50"
        >
          Prev
        </button>

        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 rounded ${
              currentPage === i + 1
                ? "bg-gray-900 text-white"
                : "bg-white border border-gray-300 hover:bg-gray-100"
            }`}
          >
            {i + 1}
          </button>
        ))}

        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(prev => prev + 1)}
          className="px-3 py-1 bg-white border border-gray-300 disabled:opacity-50"
        >
          Next
        </button>

      </div>
       {/* FOOTER (LIGHT MODE FIXED, NOT REMOVED) */}
      <footer className="bg-white text-gray-700 border-t border-gray-200">

        {/* Back to top */}
        <div
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="text-center py-3 bg-gray-200 cursor-pointer hover:bg-gray-300"
        >
          Back to top
        </div>

        {/* Footer Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 px-10 py-10 text-sm">

          <div>
            <h3 className="font-bold mb-3">Get to Know Us</h3>
            <p>About</p>
            <p>Careers</p>
            <p>Press Releases</p>
          </div>

          <div>
            <h3 className="font-bold mb-3">Connect with Us</h3>
            <p>Facebook</p>
            <p>Twitter</p>
            <p>Instagram</p>
          </div>

          <div>
            <h3 className="font-bold mb-3">Make Money with Us</h3>
            <p>Sell on ShopHub</p>
            <p>Affiliate</p>
            <p>Advertise</p>
          </div>

          <div>
            <h3 className="font-bold mb-3">Let Us Help You</h3>
            <p>Your Account</p>
            <p>Returns</p>
            <p>Help</p>
          </div>

        </div>

        {/* Bottom */}
        <div className="text-center py-4 border-t border-gray-200 text-sm">
          © 2026 ShopHub Clone
        </div>

      </footer>

    </div>
  );
}
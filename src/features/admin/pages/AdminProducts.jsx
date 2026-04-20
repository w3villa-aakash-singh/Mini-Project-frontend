import { useEffect, useState } from "react";
import {
  getProducts,
  addProduct,
  deleteProduct,
  getCategories,
  addCategory,
  updateProduct
} from "../services/AdminProductService";
import toast, { Toaster } from "react-hot-toast";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    basePrice: "",
    imageUrl: "",
    categoryId: ""
  });

  const [addingProduct, setAddingProduct] = useState(false);
  const [addingCategory, setAddingCategory] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoadingProducts(true);
    try {
      const [p, c] = await Promise.all([
        getProducts(),
        getCategories()
      ]);
      setProducts(p);
      setCategories(c);
    } catch {
      toast.error("Failed to load data");
    } finally {
      setLoadingProducts(false);
    }
  };

  /* CATEGORY */
  const handleAddCategory = async () => {
    if (!newCategory.trim()) {
      toast.error("Category name required");
      return;
    }

    const load = toast.loading("Adding category...");
    try {
      await addCategory({ name: newCategory });
      toast.success("Category added", { id: load });
      setNewCategory("");
      loadData();
    } catch {
      toast.error("Failed", { id: load });
    }
  };

  /* PRODUCT */
  const handleAddProduct = async () => {
    const price = Number(form.basePrice);

    if (isNaN(price) || price <= 0) {
      toast.error("Enter valid price");
      return;
    }

    if (!form.categoryId) {
      toast.error("Select category");
      return;
    }

    const payload = {
      name: form.name,
      description: form.description,
      basePrice: price,
      imageUrl: form.imageUrl,
      category: { id: Number(form.categoryId) }
    };

    try {
      if (editingId) {
        await updateProduct(editingId, payload);
        toast.success("Product updated");
      } else {
        await addProduct(payload);
        toast.success("Product added");
      }

      setForm({
        name: "",
        description: "",
        basePrice: "",
        imageUrl: "",
        categoryId: ""
      });

      setEditingId(null);
      loadData();
    } catch {
      toast.error("Failed");
    }
  };

  const handleDelete = async (id) => {
    const load = toast.loading("Deleting...");
    setDeletingId(id);

    try {
      await deleteProduct(id);
      toast.success("Deleted", { id: load });
      loadData();
    } catch {
      toast.error("Failed", { id: load });
    } finally {
      setDeletingId(null);
    }
  };

  const inputClass =
    "bg-gray-50 border rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-red-500 outline-none w-full";

  return (
    <div className="space-y-10 p-6 text-gray-800">
      <Toaster />

      {/* CATEGORY */}
      <div className="bg-white border rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-bold mb-4">Categories</h2>

        <div className="flex gap-3 mb-5">
          <input
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="New category..."
            className="flex-1 bg-gray-50 border rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-green-500"
          />

          <button
            onClick={async () => {
              setAddingCategory(true);
              await handleAddCategory();
              setAddingCategory(false);
            }}
            disabled={addingCategory}
            className="bg-green-600 text-white px-5 rounded-lg flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {addingCategory ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              "Add"
            )}
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <span
              key={c.id}
              className="bg-gray-100 px-3 py-1 text-sm rounded-full"
            >
              {c.name}
            </span>
          ))}
        </div>
      </div>

      {/* PRODUCT FORM */}
      <div className="bg-white border rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-bold mb-6">
          {editingId ? "Update Product" : "Add Product"}
        </h2>

        <div className="grid gap-5 md:grid-cols-2">
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Product name"
            className={inputClass}
          />

          <input
            type="number"
            value={form.basePrice}
            onChange={(e) =>
              setForm({ ...form, basePrice: e.target.value })
            }
            placeholder="Price"
            className={inputClass}
          />

          <input
            value={form.imageUrl}
            onChange={(e) =>
              setForm({ ...form, imageUrl: e.target.value })
            }
            placeholder="Image URL"
            className={`${inputClass} md:col-span-2`}
          />

          <select
            value={form.categoryId}
            onChange={(e) =>
              setForm({ ...form, categoryId: e.target.value })
            }
            className={`${inputClass} md:col-span-2`}
          >
            <option value="">Select category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <textarea
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
            placeholder="Description"
            className={`${inputClass} md:col-span-2`}
          />
        </div>

        <button
          onClick={async () => {
            setAddingProduct(true);
            await handleAddProduct();
            setAddingProduct(false);
          }}
          disabled={addingProduct}
          className="mt-6 w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg flex items-center justify-center gap-2 transition disabled:opacity-70"
        >
          {addingProduct ? (
            <>
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              {editingId ? "Updating..." : "Adding..."}
            </>
          ) : editingId ? (
            "Update Product"
          ) : (
            "Add Product"
          )}
        </button>
      </div>

      {/* PRODUCT LIST */}
      <div>
        <h2 className="text-xl font-bold mb-4">All Products</h2>

        {loadingProducts ? (
          <div className="flex justify-center py-20">
            <span className="w-8 h-8 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {products.map((p) => (
              <div
                key={p.id}
                className="bg-white border rounded-2xl p-4 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all"
              >
                <img
                  src={p.imageUrl}
                  className="h-40 w-full object-contain mb-3 rounded-lg bg-gray-50"
                />

                <h3 className="text-sm font-semibold line-clamp-2">
                  {p.name}
                </h3>
                <p className="text-gray-700 font-medium text-sm">
                  $ {p.basePrice}
                </p>

                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => {
                      setEditingId(p.id);
                      setForm({
                        name: p.name,
                        description: p.description,
                        basePrice: p.basePrice,
                        imageUrl: p.imageUrl,
                        categoryId: p.category?.id || ""
                      });
                    }}
                    className="flex-1 bg-blue-50 text-blue-600 text-sm py-2 rounded-lg hover:bg-blue-100 transition"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(p.id)}
                    disabled={deletingId === p.id}
                    className="flex-1 bg-red-50 text-red-600 text-sm py-2 rounded-lg hover:bg-red-100 transition flex items-center justify-center"
                  >
                    {deletingId === p.id ? (
                      <span className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      "Delete"
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
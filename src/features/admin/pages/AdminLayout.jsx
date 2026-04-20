import { Outlet, NavLink } from "react-router";
import { Users, Package, LayoutDashboard } from "lucide-react";

const AdminLayout = () => {
  return (
    <div className="flex h-screen bg-gray-50 text-gray-800">

      {/* 🔥 SIDEBAR */}
      <aside className="w-64 bg-white border-r shadow-sm flex flex-col">

        {/* LOGO */}
        <div className="h-16 flex items-center px-6 border-b">
          <h2 className="text-xl font-bold text-gray-800">
            Admin<span className="text-red-600">Panel</span>
          </h2>
        </div>

        {/* NAV */}
        <nav className="flex flex-col gap-2 p-4">

          <NavLink
            to="/admin/users"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition ${
                isActive
                  ? "bg-red-50 text-red-600"
                  : "hover:bg-gray-100"
              }`
            }
          >
            <Users size={18} />
            Users
          </NavLink>

          <NavLink
            to="/admin/products"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition ${
                isActive
                  ? "bg-red-50 text-red-600"
                  : "hover:bg-gray-100"
              }`
            }
          >
            <Package size={18} />
            Products
          </NavLink>

        </nav>

        {/* FOOTER */}
        <div className="mt-auto px-6 py-4 text-xs text-gray-400 border-t">
          Admin Dashboard v1
        </div>
      </aside>

      {/* 🔥 MAIN AREA */}
      <div className="flex-1 flex flex-col">

        {/* TOP HEADER (IMPORTANT FOR REAL FEEL) */}
        <header className="h-16 bg-white border-b flex items-center justify-between px-6 shadow-sm">
          <h1 className="text-lg font-semibold">Dashboard</h1>

          <div className="text-sm text-gray-500">
            Welcome, Admin
          </div>
        </header>

        {/* CONTENT */}
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>

      </div>

    </div>
  );
};

export default AdminLayout;
import { Outlet, NavLink } from "react-router";

const AdminLayout = () => {
  return (
    <div className="flex h-screen bg-slate-950 text-white">

      {/* Sidebar
      <div className="w-64 bg-slate-900 p-4 border-r border-gray-800">
        <h2 className="text-xl font-bold mb-6"> Admin Panel</h2>

        <nav className="flex flex-col gap-3">
          <NavLink to="/admin/users" className="hover:text-red-500">
            Users
          </NavLink>

          <NavLink to="/admin/plans" className="hover:text-red-500">
            Plans
          </NavLink>
        </nav>
      </div> */}

      {/* Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
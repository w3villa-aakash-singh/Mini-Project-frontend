import { useEffect, useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Download } from "lucide-react";

import useAuth from "../../auth/store/store.js";

import {
  getAllUsers,
  deleteUserById,
  upgradeUserPlan
} from "../services/AdminService.js";

import { downloadUserProfile } from "../../users/services/UserService.js";

const USERS_PER_PAGE = 5;

const AdminUsers = () => {
  const user = useAuth((state) => state.user);

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  // FETCH USERS
  useEffect(() => {
    getAllUsers().then((data) => {
      setUsers(data);
      setLoading(false);
    });
  }, []);

  // DELETE USER
  const deleteUser = async (id) => {
    try {
      setDeletingId(id);

      await deleteUserById(id);

      // remove user from UI (no refresh needed)
      setUsers(prev => prev.filter(u => u.id !== id));

    } catch (err) {
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  // UPGRADE PLAN
  const upgradePlan = async (id, planType) => {
    await upgradeUserPlan(id, planType);

    setUsers(prev =>
      prev.map(u =>
        u.id === id ? { ...u, planType } : u
      )
    );
  };

  // 🔥 DOWNLOAD USER PDF
  const handleDownloadUser = async (u) => {
    try {
      const data = await downloadUserProfile(u.id);

      const url = URL.createObjectURL(new Blob([data]));
      const link = document.createElement("a");

      link.href = url;
      link.download = `Profile_${u.name}.pdf`;

      link.click();
    } catch (err) {
      console.error(err);
      alert("Download failed");
    }
  };

  // FILTER
  const filteredUsers = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * USERS_PER_PAGE,
    currentPage * USERS_PER_PAGE
  );

  // 📊 STATS
  const totalUsers = users.length;
  const premiumUsers = users.filter(u => u.planType === "GOLD").length;

  return (
    <div className="text-gray-800 space-y-6">

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <div className="bg-white p-4 rounded-xl border shadow-sm">
          <p className="text-sm text-gray-500">Total Users</p>
          <h2 className="text-2xl font-semibold">{totalUsers}</h2>
        </div>

        <div className="bg-white p-4 rounded-xl border shadow-sm">
          <p className="text-sm text-gray-500">Premium Users</p>
          <h2 className="text-2xl font-semibold text-yellow-600">
            {premiumUsers}
          </h2>
        </div>

        <div className="bg-white p-4 rounded-xl border shadow-sm">
          <p className="text-sm text-gray-500">Admins</p>
          <h2 className="text-2xl font-semibold text-red-600">
            {users.filter(u => u.roles?.some(r => r.name === "ROLE_ADMIN")).length}
          </h2>
        </div>

      </div>

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between gap-4">

        <h1 className="text-2xl font-semibold">Users Management</h1>

        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="border px-4 py-2 rounded-lg text-sm focus:ring-2 focus:ring-red-400"
        />
      </div>

      {/* TABLE */}
      <div className="bg-white border rounded-xl shadow-sm overflow-hidden">

        {/* HEADER */}
        <div className="grid grid-cols-12 px-6 py-3 text-sm font-medium text-gray-500 border-b bg-gray-50 sticky top-0">
          <div className="col-span-3">User</div>
          <div className="col-span-3">Email</div>
          <div className="col-span-2">Role</div>
          <div className="col-span-2">Plan</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="flex items-center justify-center gap-3 py-10 text-gray-500">
            <span className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm font-medium">Loading users...</span>
          </div>
        )}

        {/* EMPTY */}
        {!loading && paginatedUsers.length === 0 && (
          <div className="p-6 text-center text-gray-500">
            No users found
          </div>
        )}

        {/* USERS */}
        {paginatedUsers.map(u => {
          const isAdminUser = u.roles?.some(r => r.name === "ROLE_ADMIN");

          return (
            <div
              key={u.id}
              className="grid grid-cols-12 items-center px-6 py-4 border-b hover:bg-gray-50"
            >
              {/* USER */}
              <div className="col-span-3 flex items-center gap-3">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={u.image} />
                  <AvatarFallback>{u.name?.[0]}</AvatarFallback>
                </Avatar>
                <span className="font-medium">{u.name}</span>
              </div>

              {/* EMAIL */}
              <div className="col-span-3 text-sm text-gray-600">
                {u.email}
              </div>

              {/* ROLE */}
              <div className="col-span-2">
                <span
                  className={`px-2 py-1 text-xs rounded-full ${isAdminUser
                      ? "bg-red-100 text-red-600"
                      : "bg-gray-100 text-gray-600"
                    }`}
                >
                  {isAdminUser ? "ADMIN" : "USER"}
                </span>
              </div>

              {/* PLAN */}
              <div className="col-span-2">
                <select
                  value={u.planType || "FREE"}
                  onChange={(e) =>
                    upgradePlan(u.id, e.target.value)
                  }
                  className="border rounded px-2 py-1 text-xs"
                >
                  <option value="FREE">FREE</option>
                  <option value="SILVER">SILVER</option>
                  <option value="GOLD">GOLD</option>
                </select>
              </div>

              {/* ACTIONS */}
              <div className="col-span-2 flex justify-end gap-3">

                {/* EXPORT */}
                <button
                  onClick={() => handleDownloadUser(u)}
                  className="text-blue-600 hover:text-blue-800"
                  title="Export User PDF"
                >
                  <Download className="w-4 h-4" />
                </button>

                {/* DELETE */}
                {!isAdminUser && (
                  <button
                    onClick={() => deleteUser(u.id)}
                    disabled={deletingId === u.id}
                    className="text-xs text-red-600 hover:underline flex items-center gap-2"
                  >
                    {deletingId === u.id ? (
                      <>
                        <span className="w-3 h-3 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></span>
                        Deleting...
                      </>
                    ) : (
                      "Delete"
                    )}
                  </button>
                )}

              </div>
            </div>
          );
        })}
      </div>

      {/* PAGINATION */}
      <div className="flex justify-between items-center text-sm text-gray-500">

        <span>
          Showing {(currentPage - 1) * USERS_PER_PAGE + 1}–
          {Math.min(currentPage * USERS_PER_PAGE, filteredUsers.length)} of{" "}
          {filteredUsers.length}
        </span>

        <div className="flex gap-2">
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded ${currentPage === i + 1
                  ? "bg-red-600 text-white"
                  : "border hover:bg-gray-100"
                }`}
            >
              {i + 1}
            </button>
          ))}
        </div>

      </div>
    </div>
  );
};

export default AdminUsers;
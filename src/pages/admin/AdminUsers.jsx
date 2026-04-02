import { useEffect, useState } from "react";
import { useAuth } from "../../contex/AuthContex";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const USERS_PER_PAGE = 5;

const AdminUsers = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // FETCH USERS
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/users`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`
      }
    })
      .then(res => res.json())
      .then(setUsers);
  }, []);

  // DELETE USER
  const deleteUser = async (id) => {
    if (!confirm("Delete this user?")) return;

    await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/users/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`
      }
    });

    setUsers(prev => prev.filter(u => u.id !== id));
  };

  // UPGRADE PLAN
  const upgradePlan = async (id, planType) => {
    await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/api/v1/users/${id}/upgrade?planType=${planType}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`
        }
      }
    );

    setUsers(prev =>
      prev.map(u =>
        u.id === id ? { ...u, planType } : u
      )
    );
  };

  // SEARCH
  const filteredUsers = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  // PAGINATION
  const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * USERS_PER_PAGE,
    currentPage * USERS_PER_PAGE
  );

  return (
    <div className="text-white">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold"> Users Management</h1>

        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="bg-slate-800 text-white px-4 py-2 rounded border border-gray-700"
        />
      </div>

      {/* USERS */}
      <div className="grid gap-4">

        {paginatedUsers.map(u => {
          const isAdminUser = u.roles?.some(r => r.name === "ROLE_ADMIN");

          return (
            <div
              key={u.id}
              className="bg-slate-800 p-4 rounded flex justify-between items-center hover:bg-slate-700 hover:scale-[1.01] transition"
            >

              {/* LEFT */}
              <div className="flex items-center gap-4">

                {/* AVATAR */}
                {/* AVATAR */}
                <Avatar className="h-10 w-10 border-2 border-slate-700 group-hover:border-red-600 transition-all">
                  <AvatarImage
                    src={
                      u?.image // Use 'u' (the specific user in the list), not 'user' (the logged-in admin)
                        ? u.image
                        : u?.picture // OAuth fallback for the specific user
                    }
                    alt={u?.name}
                  />
                  <AvatarFallback className="bg-slate-800 text-white">
                    {u?.name?.charAt(0)?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                {/* DETAILS */}
                <div>
                  <p className="font-bold text-white">{u.name}</p>
                  <p className="text-sm text-gray-400">{u.email}</p>

                  <p className="text-xs text-gray-500">
                    Joined: {new Date(u.createdAt).toLocaleDateString()}
                  </p>

                  <div className="flex gap-2 mt-2 text-xs">

                    {/* PLAN */}
                    <span className="px-2 py-1 bg-purple-600 rounded">
                      {u.planType || "FREE"}
                    </span>

                    {/* STATUS */}
                    <span className={`px-2 py-1 rounded ${u.enabled ? "bg-green-600" : "bg-red-600"
                      }`}>
                      {u.enabled ? "ACTIVE" : "DISABLED"}
                    </span>

                    {/* ROLE */}
                    {isAdminUser && (
                      <span className="px-2 py-1 bg-yellow-500 text-black rounded">
                        ADMIN
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* ACTIONS */}
              <div className="flex flex-wrap gap-2">

                {/* PLAN BUTTONS */}
                <button
                  onClick={() => upgradePlan(u.id, "GOLD")}
                  className="bg-yellow-500 text-black px-3 py-1 rounded text-sm"
                >
                  GOLD
                </button>

                <button
                  onClick={() => upgradePlan(u.id, "SILVER")}
                  className="bg-gray-400 text-black px-3 py-1 rounded text-sm"
                >
                  SILVER
                </button>

                {/* DELETE (NOT FOR ADMIN) */}
                {!isAdminUser && (
                  <button
                    onClick={() => deleteUser(u.id)}
                    className="bg-red-600 px-3 py-1 rounded text-sm"
                  >
                    Delete
                  </button>
                )}
              </div>

            </div>
          );
        })}

      </div>

      {/* PAGINATION */}
      <div className="flex justify-center gap-2 mt-6">

        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 rounded ${currentPage === i + 1
              ? "bg-red-600"
              : "bg-slate-700"
              }`}
          >
            {i + 1}
          </button>
        ))}

      </div>

    </div>
  );
};

export default AdminUsers;
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../colorCustomiser";

function AdminPage() {
  const { colors } = useTheme();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ Fetch all users (you’ll need a backend endpoint for this if not implemented yet)
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const res = await fetch("http://localhost:8000/api/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to load users");
        const data = await res.json();
        setUsers(data.users || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // ✅ Assign role
  const setRole = async (uid, role) => {
    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch(`http://localhost:8000/api/users/${uid}/role?role=${role}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || "Failed to set role");
      }
      setUsers((prev) =>
        prev.map((u) => (u.id === uid ? { ...u, role } : u))
      );
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  if (loading) return <p>Loading users...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div
      className="min-h-screen flex flex-col relative"
      style={{ backgroundColor: colors.global?.bg }}
    >
      <div
        className="rounded-2xl shadow-xl p-8 w-full max-w-4xl mx-auto mt-10"
        style={{ backgroundColor: colors.global?.box }}
      >
        <button
          onClick={() => navigate("/main")}
          className="text-gray-600 hover:text-gray-800 transition text-2xl font-bold mb-4"
        >
          ← Back
        </button>

        <h1
          className="text-4xl font-bold mb-6"
          style={{ color: colors.global?.title }}
        >
          User Management
        </h1>

        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border p-2">Email</th>
              <th className="border p-2">UID</th>
              <th className="border p-2">Role</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td className="border p-2">{u.email}</td>
                <td className="border p-2">{u.id}</td>
                <td className="border p-2">{u.role}</td>
                <td className="border p-2">
                  {["admin", "editor", "visitor"].map((r) => (
                    <button
                      key={r}
                      onClick={() => setRole(u.id, r)}
                      className={`px-2 py-1 m-1 rounded ${
                        u.role === r
                          ? "bg-green-500 text-white"
                          : "bg-gray-200"
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminPage;

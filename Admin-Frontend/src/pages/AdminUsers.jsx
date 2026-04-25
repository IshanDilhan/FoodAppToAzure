import React, { useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

export default function AdminUsers({ token }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [search, setSearch] = useState("");

  const API_URL = import.meta.env.VITE_USER_API_URL

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${API_URL}/auth/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const fetchedUsers = Array.isArray(response.data)
          ? response.data
          : response.data.users;
        setUsers(fetchedUsers || []);
      } catch (err) {
        setError("Failed to fetch users.");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [token]);

  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`https://island-rasa-food-delivery-user-mana.vercel.app/api/auth/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers((prev) => prev.filter((u) => u._id !== userId));
        setSuccessMessage("User deleted successfully!");
        setTimeout(() => setSuccessMessage(""), 3000);
      } catch {
        setError("Failed to delete user.");
      }
    }
  };

  // Mini chart for cards
  const miniChartData = (color) => ({
    labels: ["", "", "", "", "", "", ""],
    datasets: [
      {
        data: [9, 8, 10, 8, 12, 11, 9],
        borderColor: color,
        backgroundColor: "transparent",
        tension: 0.4,
        pointRadius: 0,
      },
    ],
  });
  const miniChartOptions = {
    plugins: { legend: { display: false }, tooltip: { enabled: false } },
    scales: { x: { display: false }, y: { display: false } },
    elements: { line: { borderWidth: 2 } },
  };

  // Stats for cards
  const totalUsers = users.length;
  const withProfilePic = users.filter((u) => u.profilePic).length;
  const withoutProfilePic = totalUsers - withProfilePic;

  // Filtered users
  const filteredUsers = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F5F7FB] px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-semibold mb-8 text-orange-600 flex items-center gap-3">
          All Registered Users
        </h2>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-blue-500 rounded-xl shadow p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-white text-2xl font-bold">{totalUsers}</div>
                <div className="text-blue-100 text-sm">Total Users</div>
              </div>
              <div className="w-16 h-10">
                <Line data={miniChartData("#fff")} options={miniChartOptions} />
              </div>
            </div>
          </div>
          <div className="bg-cyan-500 rounded-xl shadow p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-white text-2xl font-bold">{withProfilePic}</div>
                <div className="text-blue-100 text-sm">With Profile Pic</div>
              </div>
              <div className="w-16 h-10">
                <Line data={miniChartData("#fff")} options={miniChartOptions} />
              </div>
            </div>
          </div>
          <div className="bg-yellow-400 rounded-xl shadow p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-white text-2xl font-bold">{withoutProfilePic}</div>
                <div className="text-yellow-100 text-sm">No Profile Pic</div>
              </div>
              <div className="w-16 h-10">
                <Line data={miniChartData("#fff")} options={miniChartOptions} />
              </div>
            </div>
          </div>
          <div className="bg-red-400 rounded-xl shadow p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-white text-2xl font-bold">
                  {users.filter((u) => u.email?.endsWith("@gmail.com")).length}
                </div>
                <div className="text-red-100 text-sm">Gmail Users</div>
              </div>
              <div className="w-16 h-10">
                <Line data={miniChartData("#fff")} options={miniChartOptions} />
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by name or email..."
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {successMessage && (
          <div className="mb-4 p-4 text-green-700 bg-green-100 border-l-4 border-green-500 rounded">
            {successMessage}
          </div>
        )}
        {error && (
          <div className="mb-4 p-4 text-red-700 bg-red-100 border-l-4 border-red-500 rounded">
            {error}
          </div>
        )}

        {/* Users Table */}
        <div className="overflow-x-auto shadow-lg border border-gray-200 rounded-lg bg-white">
          <table className="min-w-full table-auto">
            <thead className="bg-[#f5f7fa] text-[#495057]">
              <tr>
                <th className="px-6 py-3 font-semibold">#</th>
                <th className="px-6 py-3 font-semibold">Profile</th>
                <th className="px-6 py-3 font-semibold">Name</th>
                <th className="px-6 py-3 font-semibold">Email</th>
                <th className="px-6 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-4 text-center text-gray-500">
                    Loading users...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-4 text-center text-gray-500">
                    No users found.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user, index) => (
                  <tr
                    key={user._id || index}
                    className={`${
                      index % 2 === 0 ? "bg-white" : "bg-[#f5f7fa]"
                    } text-center hover:bg-[#e9ecef] transition`}
                  >
                    <td className="px-6 py-3">{index + 1}</td>
                    <td className="px-6 py-3">
                      {user.profilePic ? (
                        <img
                          src={user.profilePic}
                          alt="Profile"
                          className="w-10 h-10 rounded-full object-cover border border-gray-300 shadow"
                        />
                      ) : (
                        <span className="text-gray-500">No Image</span>
                      )}
                    </td>
                    <td className="px-6 py-3 font-semibold text-[#212529]">
                      {user.name || "N/A"}
                    </td>
                    <td className="px-6 py-3 text-[#495057]">
                      {user.email || "N/A"}
                    </td>
                    <td className="px-6 py-3">
                      <button
                        className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 transition"
                        onClick={() => handleDelete(user._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

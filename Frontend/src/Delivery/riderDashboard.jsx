import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaClipboardList,
  FaCheckCircle,
  FaTruck,
  FaSignOutAlt,
  FaSearch,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_DELIVER_API_URL;
const ORDER_API_URL = import.meta.env.VITE_ORDER_API_URL;

function StatCard({ icon, label, value, color }) {
  return (
    <div className={`flex-1 bg-white rounded-xl shadow p-6 flex items-center gap-4 border-t-4 ${color}`}>
      <div className="text-3xl">{icon}</div>
      <div>
        <div className="text-2xl font-bold">{value}</div>
        <div className="text-gray-500 text-sm">{label}</div>
      </div>
    </div>
  );
}

function AssignedOrders({ onCountChange }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [actionLoading, setActionLoading] = useState("");

  useEffect(() => {
    const fetchAssigned = async () => {
      setLoading(true);
      try {
        const accessToken = localStorage.getItem("accessToken");
        const res = await axios.get(`${ORDER_API_URL}/order/rider-assigned`, {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        setOrders(res.data.orders || []);
        if (onCountChange) onCountChange(res.data.orders || []);
      } catch {
        setOrders([]);
        if (onCountChange) onCountChange([]);
      }
      setLoading(false);
    };
    fetchAssigned();
    // eslint-disable-next-line
  }, []);

  const handleStatus = async (orderId, status) => {
    setActionLoading(orderId + status);
    const accessToken = localStorage.getItem("accessToken");
    await axios.post(`${ORDER_API_URL}/order/rider/update-status`, {
      orderId, status
    }, { headers: { Authorization: `Bearer ${accessToken}` } });
    setOrders(orders =>
      orders.map(o => o._id === orderId ? { ...o, riderStatus: status } : o)
    );
    setActionLoading("");
  };

  const filteredOrders = orders.filter(order =>
    order.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
    order.address?.toLowerCase().includes(search.toLowerCase()) ||
    order._id?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Assigned Orders</h2>
        <div className="relative">
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search orders..."
            className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>
      {loading ? (
        <div className="text-orange-500">Loading...</div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-gray-500">No assigned orders.</div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map(order => (
            <div key={order._id} className="bg-white rounded-xl shadow p-4 border-l-4 border-blue-500">
              <div className="font-bold text-blue-600 mb-2">
                <FaClipboardList className="inline mr-2" />
                Order #{order._id.slice(-6).toUpperCase()}
              </div>
              <div className="mb-2">Customer: <span className="font-semibold">{order.user?.name}</span></div>
              <div className="mb-2">Address: <span className="font-semibold">{order.address}</span></div>
              <div className="mb-2">Status: <span className="font-bold">{order.riderStatus}</span></div>
              {order.riderStatus === "PENDING" && (
                <div className="flex gap-2">
                  <button
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                    onClick={() => handleStatus(order._id, "ACCEPTED")}
                    disabled={actionLoading === order._id + "ACCEPTED"}
                  >
                    {actionLoading === order._id + "ACCEPTED" ? "Accepting..." : "Accept"}
                  </button>
                  <button
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                    onClick={() => handleStatus(order._id, "REJECTED")}
                    disabled={actionLoading === order._id + "REJECTED"}
                  >
                    {actionLoading === order._id + "REJECTED" ? "Rejecting..." : "Reject"}
                  </button>
                </div>
              )}
              {order.riderStatus === "ACCEPTED" && (
                <button
                  className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                  onClick={() => handleStatus(order._id, "PICKED_UP")}
                  disabled={actionLoading === order._id + "PICKED_UP"}
                >
                  {actionLoading === order._id + "PICKED_UP" ? "Updating..." : "Mark as Picked Up"}
                </button>
              )}
              {order.riderStatus === "PICKED_UP" && (
                <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded font-semibold">Order Picked Up</span>
              )}
              {order.riderStatus === "DELIVERED" && (
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded font-semibold">Delivered</span>
              )}
              {order.riderStatus === "REJECTED" && (
                <span className="bg-red-100 text-red-700 px-3 py-1 rounded font-semibold">Rejected</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const RiderProfileDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [tab, setTab] = useState("dashboard");
  const [assignedOrders, setAssignedOrders] = useState([]);
  const [allOrders, setAllOrders] = useState([]);
  const [completedOrders, setCompletedOrders] = useState([]);
  const navigate = useNavigate();

  // Fetch profile and all orders for stats
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const res = await axios.get(`${API_URL}/rider/me`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setProfile(res.data.rider);
      } catch (err) {
        setProfile(null);
      }
    };

    const fetchAllOrders = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const res = await axios.get(`${ORDER_API_URL}/order/rider-all`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setAllOrders(res.data.orders || []);
        setCompletedOrders((res.data.orders || []).filter(o => o.riderStatus === "DELIVERED"));
      } catch {
        setAllOrders([]);
        setCompletedOrders([]);
      }
    };

    fetchProfile();
    fetchAllOrders();
  }, []);

  // For assigned orders count
  const handleAssignedOrders = (orders) => setAssignedOrders(orders);

  // Sign out handler
  const handleSignOut = () => {
    localStorage.removeItem("accessToken");
    navigate("/");
  };

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="text-lg text-gray-600">Loading profile...</span>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#f6f8fc]">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-[#6c63ff] to-[#5e60ce] text-white flex flex-col items-center py-10 shadow-lg">
        <div className="font-bold text-2xl mb-8 tracking-wide">DASHBOARD</div>
        <nav className="w-full px-6">
          <ul className="space-y-3">
            <li
              className={`px-4 py-2 rounded cursor-pointer font-semibold ${tab === "dashboard" ? "bg-white/20" : "hover:bg-white/10"}`}
              onClick={() => setTab("dashboard")}
            >
              <FaTruck className="inline mr-2" /> Dashboard
            </li>
            <li
              className={`px-4 py-2 rounded cursor-pointer ${tab === "profile" ? "bg-white/20 font-semibold" : "hover:bg-white/10"}`}
              onClick={() => setTab("profile")}
            >
              <FaClipboardList className="inline mr-2" /> Profile
            </li>
            <li
              className={`px-4 py-2 rounded cursor-pointer ${tab === "orders" ? "bg-white/20 font-semibold" : "hover:bg-white/10"}`}
              onClick={() => setTab("orders")}
            >
              <FaCheckCircle className="inline mr-2" />
              Orders
              <span className="ml-2 bg-white/30 px-2 rounded text-xs">{assignedOrders.length}</span>
            </li>
          </ul>
        </nav>
        <div className="flex-1" />
        <button
          className="flex items-center gap-2 px-4 py-2 mt-8 bg-red-500 hover:bg-red-600 rounded text-white font-semibold shadow transition"
          onClick={handleSignOut}
        >
          <FaSignOutAlt /> Sign Out
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10">
        {tab === "dashboard" && (
          <>
            <h1 className="text-2xl font-bold mb-6">Rider Profile</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <StatCard
                icon={<FaClipboardList className="text-blue-500" />}
                label="Total Orders"
                value={allOrders.length}
                color="border-blue-500"
              />
              <StatCard
                icon={<FaCheckCircle className="text-yellow-500" />}
                label="Assigned Orders"
                value={assignedOrders.length}
                color="border-yellow-500"
              />
              <StatCard
                icon={<FaTruck className="text-green-500" />}
                label="Completed Orders"
                value={completedOrders.length}
                color="border-green-500"
              />
            </div>
            <section className="bg-white rounded-2xl shadow p-8 flex-1 flex flex-col">
              <div className="flex items-center gap-8">
                <img
                  src={profile.profile.profilePicture}
                  alt={profile.profile.name}
                  className="w-28 h-28 rounded-full object-cover border-4 border-[#e0e7ff]"
                />
                <div>
                  <h2 className="text-xl font-bold mb-1">{profile.profile.name}</h2>
                  <div className="text-gray-500 text-sm mb-2">Registration Date: <span className="font-medium">{profile.registrationDate}</span></div>
                  <div className="text-gray-500 text-sm mb-2">Address: <span className="font-medium">{profile.profile.address}</span></div>
                  <div className="text-gray-500 text-sm mb-2">E-mail: <span className="font-medium">{profile.email}</span></div>
                  <div className="text-gray-500 text-sm mb-2">Phone: <span className="font-medium">{profile.profile.phone}</span></div>
                </div>
              </div>
            </section>
          </>
        )}
        {tab === "orders" && (
          <div className="mt-4">
            <AssignedOrders onCountChange={handleAssignedOrders} />
          </div>
        )}
        {tab === "profile" && (
          <div className="mt-4">
            <section className="bg-white rounded-2xl shadow p-8 flex-1 flex flex-col">
              <div className="flex items-center gap-8">
                <img
                  src={profile.profile.profilePicture}
                  alt={profile.profile.name}
                  className="w-28 h-28 rounded-full object-cover border-4 border-[#e0e7ff]"
                />
                <div>
                  <h2 className="text-xl font-bold mb-1">{profile.profile.name}</h2>
                  <div className="text-gray-500 text-sm mb-2">Registration Date: <span className="font-medium">{profile.registrationDate}</span></div>
                  <div className="text-gray-500 text-sm mb-2">Address: <span className="font-medium">{profile.profile.address}</span></div>
                  <div className="text-gray-500 text-sm mb-2">E-mail: <span className="font-medium">{profile.email}</span></div>
                  <div className="text-gray-500 text-sm mb-2">Phone: <span className="font-medium">{profile.profile.phone}</span></div>
                </div>
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
};

export default RiderProfileDashboard;

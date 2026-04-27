import React, { useEffect, useState } from "react";
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

export default function AdminDashboard({ token }) {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [approveLoading, setApproveLoading] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const RESTAURANT_API_URL = import.meta.env.VITE_RESTAURANT_API_URL;

  useEffect(() => {
    const fetchRestaurants = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${RESTAURANT_API_URL}/restaurants/all`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setRestaurants(data.data || []);
      } catch (err) {
        setError("Failed to fetch restaurants");
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurants();
  }, [token, success]);

  const handleApprove = async (id) => {
    setApproveLoading(id);
    setError("");
    setSuccess("");
    try {
      const res = await fetch(`${RESTAURANT_API_URL}/admin/approve/${id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Approval failed");
      setSuccess(data.message);
    } catch (err) {
      setError(err.message);
    } finally {
      setApproveLoading("");
    }
  };

  const filteredRestaurants = restaurants.filter(r => {
    const term = searchTerm.toLowerCase();
    return (
      r.name.toLowerCase().includes(term) ||
      r.email.toLowerCase().includes(term)
    );
  });

  const approvedCount = restaurants.filter(r => r.isApproved).length;
  const pendingCount = restaurants.length - approvedCount;

  // Chart Data
  const trafficChartData = {
    labels: ["M", "T", "W", "T", "F", "S", "S", "M", "T", "W", "T", "F", "S", "S"],
    datasets: [
      {
        label: "Visits",
        data: [120, 100, 140, 180, 160, 200, 220, 170, 150, 190, 210, 230, 240, 200],
        borderColor: "#39f",
        backgroundColor: "rgba(51,153,255,0.1)",
        tension: 0.4,
        fill: true,
        pointRadius: 0,
      },
      {
        label: "Unique",
        data: [80, 60, 100, 120, 110, 140, 160, 120, 100, 130, 150, 180, 170, 140],
        borderColor: "#f9b115",
        backgroundColor: "rgba(249,177,21,0.08)",
        tension: 0.4,
        fill: true,
        pointRadius: 0,
      },
    ],
  };

  const trafficChartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { mode: "index", intersect: false },
    },
    scales: {
      x: { grid: { display: false } },
      y: { grid: { color: "#f3f4f6" }, min: 0, max: 250, ticks: { stepSize: 50 } },
    },
  };

  return (
    <div className="min-h-screen bg-[#F5F7FB] px-4 py-8">
      <div className="max-w-7xl mx-auto">

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-[#39f] rounded-xl shadow p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-white text-2xl font-bold">{restaurants.length}</div>
                <div className="text-blue-100 text-sm">Total Restaurants</div>
              </div>
            </div>
          </div>
          <div className="bg-[#20c997] rounded-xl shadow p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-white text-2xl font-bold">{approvedCount}</div>
                <div className="text-green-100 text-sm">Approved</div>
              </div>
            </div>
          </div>
          <div className="bg-[#f9b115] rounded-xl shadow p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-white text-2xl font-bold">{pendingCount}</div>
                <div className="text-yellow-100 text-sm">Pending</div>
              </div>
            </div>
          </div>
          <div className="bg-[#e55353] rounded-xl shadow p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-white text-2xl font-bold">
                  {restaurants.filter(r => r.isApproved).reduce((acc, r) => acc + (r.visits || 0), 0)}
                </div>
                <div className="text-red-100 text-sm">Visits (demo)</div>
              </div>
            </div>
          </div>
        </div>

        {/* Traffic Chart */}
        <div className="bg-white rounded-xl shadow p-8 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-700">Restaurant Traffic</h2>
            <div className="flex gap-2">
              <button className="px-3 py-1 rounded bg-gray-100 text-gray-600 font-semibold">Day</button>
              <button className="px-3 py-1 rounded bg-gray-200 text-gray-800 font-bold">Month</button>
              <button className="px-3 py-1 rounded bg-gray-100 text-gray-600 font-semibold">Year</button>
            </div>
          </div>
          <Line data={trafficChartData} options={trafficChartOptions} height={110} />
          <div className="flex justify-between mt-6 text-center">
            <div>
              <div className="text-green-700 font-bold">29,703</div>
              <div className="text-xs text-gray-500">Visits</div>
            </div>
            <div>
              <div className="text-blue-700 font-bold">24,093</div>
              <div className="text-xs text-gray-500">Unique</div>
            </div>
            <div>
              <div className="text-pink-700 font-bold">78,706</div>
              <div className="text-xs text-gray-500">Pageviews</div>
            </div>
            <div>
              <div className="text-orange-700 font-bold">22,123</div>
              <div className="text-xs text-gray-500">New Users</div>
            </div>
            <div>
              <div className="text-indigo-700 font-bold">40.15%</div>
              <div className="text-xs text-gray-500">Bounce Rate</div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by name or email..."
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#39f]"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        {error && <div className="text-red-500 mb-4">{error}</div>}
        {success && <div className="text-green-600 mb-4">{success}</div>}

        {/* Restaurant Table */}
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 rounded-lg shadow bg-white">
            <thead>
              <tr className="bg-[#f5f7fa] text-[#495057]">
                <th className="p-3 text-left font-semibold">Logo</th>
                <th className="p-3 text-left font-semibold">Name</th>
                <th className="p-3 text-left font-semibold">Email</th>
                <th className="p-3 text-left font-semibold">Contact</th>
                <th className="p-3 text-center font-semibold">Approved</th>
                <th className="p-3 text-center font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-4 text-center text-gray-500">
                    Loading restaurants...
                  </td>
                </tr>
              ) : filteredRestaurants.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-4 text-center text-gray-500">
                    No restaurants found.
                  </td>
                </tr>
              ) : (
                filteredRestaurants.map((r, idx) => (
                  <tr
                    key={r._id}
                    className={`${
                      idx % 2 === 0 ? "bg-white" : "bg-[#f5f7fa]"
                    } border-t hover:bg-[#e9ecef] transition`}
                  >
                    <td className="p-2">
                      <img
                        src={r.logo}
                        alt={`${r.name} logo`}
                        className="h-12 w-12 rounded-full object-cover border border-gray-300 shadow"
                        style={{ background: "#f3f3f3" }}
                      />
                    </td>
                    <td className="p-2 font-semibold text-[#212529]">{r.name}</td>
                    <td className="p-2 text-[#495057]">{r.email}</td>
                    <td className="p-2 text-[#495057]">{r.contactNumber}</td>
                    <td className="p-2 text-center">
                      {r.isApproved ? (
                        <span className="text-green-600 font-bold">✅</span>
                      ) : (
                        <span className="text-red-600 font-bold">❌</span>
                      )}
                    </td>
                    <td className="p-2 text-center">
                      {!r.isApproved && (
                        <button
                          className="bg-[#20c997] text-white px-3 py-1 rounded hover:bg-[#17a589] transition"
                          onClick={() => handleApprove(r._id)}
                          disabled={approveLoading === r._id}
                        >
                          {approveLoading === r._id ? "Approving..." : "Approve"}
                        </button>
                      )}
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

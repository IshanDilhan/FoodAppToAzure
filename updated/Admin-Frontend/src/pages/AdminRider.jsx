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

export default function RiderManagement({ token }) {
  const [riders, setRiders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusLoading, setStatusLoading] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [search, setSearch] = useState("");

  const API_URL = import.meta.env.VITE_DELIVER_API_URL;

  useEffect(() => {
    const fetchRiders = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`${API_URL}/admin/riders`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setRiders(data.riders || []);
      } catch (err) {
        setError("Failed to fetch riders.");
      } finally {
        setLoading(false);
      }
    };
    fetchRiders();
  }, [token, success]);

  const handleStatusUpdate = async (id, status) => {
    setStatusLoading(id + status);
    setError("");
    setSuccess("");
    try {
      const res = await fetch(`${API_URL}/admin/update-status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ riderId: id, status })
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Update failed");
      setSuccess(data.message);
    } catch (err) {
      setError(err.message);
    } finally {
      setStatusLoading("");
    }
  };

  // Stats
  const totalRiders = riders.length;
  const approvedRiders = riders.filter(r => r.status === "APPROVED").length;
  const pendingRiders = riders.filter(r => r.status === "PENDING").length;

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

  // Demo traffic chart data
  const trafficChartData = {
    labels: ["M", "T", "W", "T", "F", "S", "S", "M", "T", "W", "T", "F", "S", "S"],
    datasets: [
      {
        label: "Deliveries",
        data: [40, 60, 55, 70, 65, 80, 90, 60, 70, 85, 95, 100, 110, 90],
        borderColor: "#39f",
        backgroundColor: "rgba(51,153,255,0.15)",
        tension: 0.4,
        fill: true,
        pointRadius: 0,
      },
      {
        label: "Active Riders",
        data: [20, 30, 25, 40, 35, 50, 60, 35, 45, 55, 60, 70, 80, 65],
        borderColor: "#f9b115",
        backgroundColor: "rgba(249,177,21,0.1)",
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
      y: { grid: { color: "#f3f4f6" }, min: 0, max: 120, ticks: { stepSize: 20 } },
    },
  };

  // Filtered riders
  const filteredRiders = riders.filter(
    (r) =>
      r.email?.toLowerCase().includes(search.toLowerCase()) ||
      r.vehicleType?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F5F7FB] px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-semibold mb-8 text-blue-600 flex items-center gap-3">
          Rider Management
        </h2>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-blue-500 rounded-xl shadow p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-white text-2xl font-bold">{totalRiders}</div>
                <div className="text-blue-100 text-sm">Total Riders</div>
              </div>
              <div className="w-16 h-10">
                <Line data={miniChartData("#fff")} options={miniChartOptions} />
              </div>
            </div>
          </div>
          <div className="bg-green-500 rounded-xl shadow p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-white text-2xl font-bold">{approvedRiders}</div>
                <div className="text-green-100 text-sm">Approved</div>
              </div>
              <div className="w-16 h-10">
                <Line data={miniChartData("#fff")} options={miniChartOptions} />
              </div>
            </div>
          </div>
          <div className="bg-yellow-400 rounded-xl shadow p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-white text-2xl font-bold">{pendingRiders}</div>
                <div className="text-yellow-100 text-sm">Pending</div>
              </div>
              <div className="w-16 h-10">
                <Line data={miniChartData("#fff")} options={miniChartOptions} />
              </div>
            </div>
          </div>
        </div>

        {/* Traffic Chart */}
        <div className="bg-white rounded-xl shadow p-8 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-700">Rider Activity</h2>
            <div className="flex gap-2">
              <button className="px-3 py-1 rounded bg-gray-100 text-gray-600 font-semibold">Day</button>
              <button className="px-3 py-1 rounded bg-gray-200 text-gray-800 font-bold">Month</button>
              <button className="px-3 py-1 rounded bg-gray-100 text-gray-600 font-semibold">Year</button>
            </div>
          </div>
          <Line data={trafficChartData} options={trafficChartOptions} height={110} />
          <div className="flex justify-between mt-6 text-center">
            <div>
              <div className="text-blue-700 font-bold">1,200</div>
              <div className="text-xs text-gray-500">Deliveries</div>
            </div>
            <div>
              <div className="text-green-700 font-bold">350</div>
              <div className="text-xs text-gray-500">Active Riders</div>
            </div>
            <div>
              <div className="text-yellow-700 font-bold">80</div>
              <div className="text-xs text-gray-500">Pending</div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by email or vehicle type..."
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {error && (
          <div className="mb-4 p-4 text-red-700 bg-red-100 border-l-4 border-red-500 rounded">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-4 text-green-700 bg-green-100 border-l-4 border-green-500 rounded">
            {success}
          </div>
        )}

        {/* Riders Table */}
        <div className="overflow-x-auto shadow-lg border border-gray-200 rounded-lg bg-white">
          <table className="min-w-full table-auto">
            <thead className="bg-blue-100 text-blue-800">
              <tr>
                <th className="px-6 py-3 font-semibold">Profile</th>
                <th className="px-6 py-3 font-semibold">Email</th>
                <th className="px-6 py-3 font-semibold">Status</th>
                <th className="px-6 py-3 font-semibold">Vehicle</th>
                <th className="px-6 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-4 text-center text-gray-500">
                    Loading riders...
                  </td>
                </tr>
              ) : filteredRiders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-4 text-center text-gray-500">
                    No riders found.
                  </td>
                </tr>
              ) : (
                filteredRiders.map((r, idx) => (
                  <tr
                    key={r.id}
                    className={`${
                      idx % 2 === 0 ? "bg-white" : "bg-blue-50"
                    } border-t hover:bg-blue-100 transition`}
                  >
                    <td className="p-2">
                      <img
                        src={r.profilePictureUrl}
                        alt="Profile"
                        className="h-10 w-10 rounded-full object-cover border shadow"
                      />
                    </td>
                    <td className="p-2 font-semibold text-gray-800">{r.email}</td>
                    <td className="p-2">
                      <span
                        className={`px-2 py-1 rounded text-xs font-bold ${
                          r.status === "APPROVED"
                            ? "bg-green-100 text-green-700"
                            : r.status === "PENDING"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>
                    <td className="p-2 text-gray-700">{r.vehicleType}</td>
                    <td className="p-2">
                      {r.status !== "APPROVED" && (
                        <button
                          className="bg-green-500 text-white px-3 py-1 rounded mr-2 hover:bg-green-600 transition"
                          onClick={() => handleStatusUpdate(r.id, "APPROVED")}
                          disabled={statusLoading === r.id + "APPROVED"}
                        >
                          {statusLoading === r.id + "APPROVED" ? "Approving..." : "Approve"}
                        </button>
                      )}
                      {r.status !== "REJECTED" && (
                        <button
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                          onClick={() => handleStatusUpdate(r.id, "REJECTED")}
                          disabled={statusLoading === r.id + "REJECTED"}
                        >
                          {statusLoading === r.id + "REJECTED" ? "Rejecting..." : "Reject"}
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

import React, { useEffect, useState } from "react";
import axios from "axios";
import { AssignRiderModal } from "../Delivery/AssignRiderModal";
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

const ORDER_API_URL = import.meta.env.VITE_ORDER_API_URL;

const ORDER_STEPS = [
  "Pending",
  "Confirmed",
  "Processing",
  "Preparing",
  "Handover",
  "Out for Delivery",
  "Delivered",
];

function getOrderStepIndex(status) {
  const map = {
    pending: 0,
    confirmed: 1,
    processing: 2,
    preparing: 3,
    handover: 4,
    "out for delivery": 5,
    delivered: 6,
  };
  return map[status?.toLowerCase()] ?? 0;
}

function getStatusCounts(orders) {
  const counts = {};
  for (const order of orders) {
    const status = order.status?.toLowerCase() || "unknown";
    counts[status] = (counts[status] || 0) + 1;
  }
  return counts;
}

export default function RestaurantOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [assignModal, setAssignModal] = useState({ open: false, order: null });

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("restaurantToken");
      const res = await axios.get(`${ORDER_API_URL}/order/restaurant/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data.orders || []);
    } catch {
      setOrders([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleStatusChange = async (orderId, status) => {
    setUpdating(orderId);
    try {
      const token = localStorage.getItem("restaurantToken");
      await axios.patch(
        `${ORDER_API_URL}/order/${orderId}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchOrders();
    } catch (err) {
      alert("Failed to update order status");
    }
    setUpdating(null);
  };

  const totalOrders = orders.length;
  const statusCounts = getStatusCounts(orders);

  // Prepare Line Chart Data: Orders per day (last 7 days)
  const daysAgo = (n) => {
    const d = new Date();
    d.setDate(d.getDate() - n);
    return d.toLocaleDateString();
  };
  const last7Days = Array.from({ length: 7 }, (_, i) => daysAgo(6 - i));

  // Count orders per day
  const ordersPerDay = last7Days.map((day) =>
    orders.filter((order) => new Date(order.createdAt).toLocaleDateString() === day).length
  );

  const lineChartData = {
    labels: last7Days,
    datasets: [
      {
        label: "Orders per Day",
        data: ordersPerDay,
        fill: false,
        borderColor: "rgba(251, 146, 60, 0.7)",
        backgroundColor: "rgba(251, 146, 60, 0.7)",
        tension: 0.4,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  };

  const lineChartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => `Orders: ${ctx.parsed.y}`,
        },
      },
    },
    scales: {
      x: { grid: { display: false } },
      y: { grid: { color: "#f3f4f6" }, beginAtZero: true },
    },
  };

  if (loading) {
    return <div className="text-center py-10 text-orange-500">Loading orders...</div>;
  }

  return (
    <div className="container mx-auto p-4 sm:p-6">
      {/* Counts Summary */}
      <div className="flex flex-wrap gap-4 mb-8">
        <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded font-bold whitespace-nowrap">
          Total Orders: {totalOrders}
        </div>
        {ORDER_STEPS.map((step) => {
          const key = step.toLowerCase();
          const color =
            key === "pending"
              ? "bg-blue-100 text-blue-700"
              : key === "delivered"
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700";
          return (
            <div key={key} className={`${color} px-4 py-2 rounded font-bold whitespace-nowrap`}>
              {step}: {statusCounts[key] || 0}
            </div>
          );
        })}
      </div>

      {/* Orders Per Day Line Chart */}
      <div className="bg-white rounded-xl shadow p-6 mb-8">
        <h3 className="text-lg font-bold mb-4 text-gray-700">Orders Per Day (Last 7 Days)</h3>
        <Line data={lineChartData} options={lineChartOptions} height={120} />
      </div>

      {/* Orders List */}
      {!orders.length ? (
        <div className="text-center py-10 text-gray-400">No orders found.</div>
      ) : (
        <div className="space-y-8">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-xl shadow p-6 max-w-full w-full mx-auto"
            >
              {/* Header: Order Number, Date, Status, Total */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3 flex-wrap">
                <div className="flex flex-col space-y-1 overflow-hidden">
                  <span className="font-bold text-blue-600 truncate max-w-xs" title={order.orderNo || order._id?.slice(-6).toUpperCase()}>
                    #{order.orderNo || order._id?.slice(-6).toUpperCase()}
                  </span>
                  <span className="text-xs text-gray-500 whitespace-nowrap">
                    {new Date(order.createdAt).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <select
                    value={order.status}
                    disabled={updating === order._id}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    className={`text-xs font-bold rounded px-2 py-1 border focus:outline-none focus:ring-2 ${
                      order.status === "pending"
                        ? "bg-blue-100 text-blue-700"
                        : order.status === "delivered"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                    aria-label="Change order status"
                  >
                    {ORDER_STEPS.map((status) => (
                      <option key={status} value={status.toLowerCase()}>
                        {status}
                      </option>
                    ))}
                  </select>
                  <span className="text-lg font-bold text-green-600 whitespace-nowrap">
                    LKR{" "}
                    {order.total?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
              {/* Progress Bar */}
              <div className="flex items-center gap-1 mb-4 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                {ORDER_STEPS.map((step, idx) => (
                  <React.Fragment key={step}>
                    <div className="flex flex-col items-center min-w-[45px]">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0
                        ${
                          idx <= getOrderStepIndex(order.status)
                            ? "bg-green-500 text-white"
                            : "bg-gray-200 text-gray-400"
                        }`}
                        aria-label={`Step ${idx + 1}: ${step}`}
                      >
                        {idx + 1}
                      </div>
                      <div className="text-xs text-gray-500 mt-1 whitespace-nowrap">{step}</div>
                    </div>
                    {idx < ORDER_STEPS.length - 1 && (
                      <div
                        className={`flex-1 h-1 min-w-[15px] shrink grow ${
                          idx < getOrderStepIndex(order.status) ? "bg-green-500" : "bg-gray-200"
                        }`}
                        aria-hidden="true"
                      />
                    )}
                  </React.Fragment>
                ))}
              </div>
              {/* Items */}
              <div className="divide-y">
                {order.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col sm:flex-row items-center gap-4 py-2"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 rounded object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold truncate">{item.name}</div>
                      {item.sides?.length > 0 && (
                        <div className="text-xs text-gray-500 truncate">
                          Sides: {item.sides.map((s) => s.name).join(", ")}
                        </div>
                      )}
                    </div>
                    <div className="text-sm font-bold whitespace-nowrap">×{item.quantity}</div>
                    <div className="font-bold whitespace-nowrap">
                      LKR{" "}
                      {(item.price * item.quantity).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                      })}
                    </div>
                  </div>
                ))}
              </div>
              {/* Customer info */}
              <div className="text-sm mt-4 space-y-1">
                <div className="truncate">
                  <span className="font-bold">Customer: </span>
                  {order.user?.name || "-"}
                </div>
                <div className="truncate">
                  <span className="font-bold">Address: </span>
                  {order.address || "-"}
                </div>
                <div className="truncate">
                  <span className="font-bold">Phone: </span>
                  {order.phone || "-"}
                </div>
                <div className="truncate">
                  <span className="font-bold">Delivery Type: </span>
                  {order.deliveryType || "-"}
                </div>
                <div className="truncate">
                  <span className="font-bold">Instructions: </span>
                  {order.instructions || "-"}
                </div>
                <div className="flex justify-between mt-2">
                  <span className="font-bold">Payment: </span>
                  <span className="uppercase truncate">{order.paymentMethod || "-"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold">Payment Status: </span>
                  <span
                    className={`px-2 py-1 rounded text-xs font-bold whitespace-nowrap ${
                      order.paymentStatus === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {order.paymentStatus || "-"}
                  </span>
                </div>
                {/* Assign to Delivery Rider Button */}
                <div className="mt-4">
                  <button
                    className="bg-black text-white px-4 py-2 rounded font-semibold w-full sm:w-auto"
                    onClick={() => setAssignModal({ open: true, order })}
                    disabled={!!order.assignedRider}
                    aria-disabled={!!order.assignedRider}
                  >
                    {order.assignedRider ? "Assigned" : "Assign to Delivery Rider"}
                  </button>
                </div>
                {/* Assigned Rider and Status */}
                {order.assignedRider && (
                  <div className="mt-3 space-y-1">
                    <div className="font-bold">
                      Assigned Rider:{" "}
                      <span className="text-black">{order.assignedRider?.name || order.assignedRider}</span>
                    </div>
                    <div>
                      Rider Status:{" "}
                      <span
                        className={`font-bold ${
                          order.riderStatus === "ACCEPTED"
                            ? "text-green-700"
                            : order.riderStatus === "REJECTED"
                            ? "text-red-700"
                            : order.riderStatus === "PENDING"
                            ? "text-yellow-700"
                            : ""
                        }`}
                      >
                        {order.riderStatus || "PENDING"}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Assign Rider Modal */}
      <AssignRiderModal
        open={assignModal.open}
        order={assignModal.order}
        onClose={() => setAssignModal({ open: false, order: null })}
        onAssigned={fetchOrders}
      />
    </div>
  );
}

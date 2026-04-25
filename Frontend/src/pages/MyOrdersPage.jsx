import React, { useEffect, useState } from "react";
import axios from "axios";

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

export default function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("recent");

  useEffect(() => {
    let interval;
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${ORDER_API_URL}/order/history`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(res.data.orders || []);
      } catch {
        setOrders([]);
      }
      setLoading(false);
    };
    fetchOrders();
    interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, []);

  // Filter orders by tab
  const filteredOrders = orders.filter(order => {
    if (tab === "recent") return order.status !== "delivered";
    if (tab === "delivered") return order.status === "delivered";
    if (tab === "paid") return order.paymentMethod === "stripe";
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">Order Summary</h1>
      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b">
        <button
          className={`px-4 py-2 font-semibold ${tab === "recent" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500"}`}
          onClick={() => setTab("recent")}
        >
          Recent Orders
        </button>
        <button
          className={`px-4 py-2 font-semibold ${tab === "delivered" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500"}`}
          onClick={() => setTab("delivered")}
        >
          Delivered Orders
        </button>
        <button
          className={`px-4 py-2 font-semibold ${tab === "paid" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500"}`}
          onClick={() => setTab("paid")}
        >
          Paid Orders
        </button>
      </div>

      {loading ? (
        <div className="text-center text-orange-500">Loading orders...</div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center text-gray-400">No orders yet.</div>
      ) : (
        <div className="space-y-8">
          {filteredOrders.map(order => (
            <div key={order._id} className="bg-white rounded-xl shadow p-6">
              {/* Header: Order Number, Date, Status, Total */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="font-bold text-blue-600 mr-2">#{order.orderNo || order._id?.slice(-6).toUpperCase()}</span>
                  <span className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold rounded px-2 py-1 ${order.status === "pending" ? "bg-blue-100 text-blue-700" : order.status === "delivered" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                    {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                  </span>
                  <span className="text-lg font-bold text-green-600">
                    LKR {order.total?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="flex items-center gap-1 mb-4">
                {ORDER_STEPS.map((step, idx) => (
                  <React.Fragment key={step}>
                    <div className="flex flex-col items-center">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold
                        ${idx <= getOrderStepIndex(order.status) ? "bg-green-500 text-white" : "bg-gray-200 text-gray-400"}`}>
                        {idx + 1}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">{step}</div>
                    </div>
                    {idx < ORDER_STEPS.length - 1 && (
                      <div className={`flex-1 h-1 ${idx < getOrderStepIndex(order.status) ? "bg-green-500" : "bg-gray-200"}`}></div>
                    )}
                  </React.Fragment>
                ))}
              </div>

              {/* Items */}
              <div className="divide-y">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4 py-2">
                    <img src={item.image} alt={item.name} className="w-12 h-12 rounded object-cover" />
                    <div className="flex-1">
                      <div className="font-semibold">{item.name}</div>
                      {item.sides?.length > 0 && (
                        <div className="text-xs text-gray-500">
                          Sides: {item.sides.map(s => s.name).join(", ")}
                        </div>
                      )}
                    </div>
                    <div className="text-sm font-bold">×{item.quantity}</div>
                    <div className="font-bold">
                      LKR {(item.price * item.quantity).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Details and Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 bg-gray-50 p-4 rounded">
                <div className="text-sm space-y-1">
                  <div>
                    <span className="font-bold">RESTAURANT</span><br />
                    <div className="flex items-center gap-2 mt-1">
                      {order.restaurant?.logo && (
                        <img
                          src={order.restaurant.logo}
                          alt={order.restaurant.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      )}
                      <span>{order.restaurant?.name || "Unknown Restaurant"}</span>
                    </div>
                  </div>
                  <div><span className="font-bold">DELIVERY ADDRESS</span><br />{order.address || "-"}</div>
                  <div><span className="font-bold">PHONE</span><br />{order.phone || "-"}</div>
                  <div><span className="font-bold">DELIVERY</span><br />{order.deliveryType || "-"} / {order.deliveryOption || "-"}</div>
                  <div><span className="font-bold">DROPOFF</span><br />{order.dropoffOption || "-"}</div>
                  <div><span className="font-bold">INSTRUCTIONS</span><br />{order.instructions || "-"}</div>
                </div>
                <div className="text-sm space-y-1">
                  <div className="flex justify-between"><span>Subtotal</span><span>LKR {order.subtotal?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></div>
                  <div className="flex justify-between"><span>Delivery Fee</span><span>LKR {order.shippingFee?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></div>
                  <div className="flex justify-between font-bold text-lg"><span>Total</span><span className="text-green-600">LKR {order.total?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></div>
                  <div className="flex justify-between"><span>Payment</span><span className="uppercase">{order.paymentMethod || "-"}</span></div>
                  <div className="flex justify-between"><span>Payment Status</span>
                    <span className={`px-2 py-1 rounded text-xs font-bold ${order.paymentStatus === "pending" ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700"}`}>
                      {order.paymentStatus || "-"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

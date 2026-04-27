import React from "react";
import { FaTachometerAlt, FaUsers, FaUtensils, FaTruck, FaStar } from "react-icons/fa";

const items = [
  { key: "dashboard", label: "Dashboard", icon: <FaTachometerAlt /> },
  { key: "users", label: "Users", icon: <FaUsers /> },
  { key: "restaurants", label: "Restaurants", icon: <FaUtensils /> },
  { key: "delivery", label: "Delivery", icon: <FaTruck /> },
  { key: "reviews", label: "Reviews", icon: <FaStar /> },
];

export default function Sidebar({ active, setActive }) {
  return (
    <aside className="w-64 bg-white shadow-lg min-h-screen">
      <div className="h-20 flex items-center justify-center border-b">
        <span className="text-2xl font-bold text-orange-600">COREUI</span>
      </div>
      <nav className="py-4">
        {items.map((item) => (
          <button
            key={item.key}
            className={`w-full flex items-center px-6 py-3 text-lg gap-3 hover:bg-orange-100 transition ${
              active === item.key ? "bg-orange-50 text-orange-600 font-semibold" : "text-gray-700"
            }`}
            onClick={() => setActive(item.key)}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}

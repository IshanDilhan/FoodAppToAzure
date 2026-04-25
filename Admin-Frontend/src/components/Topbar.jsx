import React from "react";
import { FaBell, FaCog, FaUserCircle } from "react-icons/fa";

export default function Topbar({ admin }) {
  return (
    <header className="h-16 bg-white shadow flex items-center justify-between px-8 border-b">
      <div className="flex items-center gap-4">
        <span className="text-xl font-semibold text-gray-700">Dashboard</span>
      </div>
      <div className="flex items-center gap-6">
        <FaBell className="text-xl text-gray-400" />
        <FaCog className="text-xl text-gray-400" />
        <div className="flex items-center gap-2">
          <FaUserCircle className="text-2xl text-gray-400" />
          <span className="text-gray-700">{admin?.name || "Admin"}</span>
        </div>
      </div>
    </header>
  );
}

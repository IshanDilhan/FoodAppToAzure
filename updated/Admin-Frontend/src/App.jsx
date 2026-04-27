import React, { useState } from "react";
import AdminAuthPage from "./pages/AdminAuthPage";
import MainDashboard from "./pages/MainDashboard";

export default function App() {
  const [token, setToken] = useState(() => localStorage.getItem("adminToken") || "");
  const [admin, setAdmin] = useState(() => {
    const a = localStorage.getItem("adminInfo");
    return a ? JSON.parse(a) : null;
  });

  const handleLogin = (token, admin) => {
    setToken(token);
    setAdmin(admin);
    localStorage.setItem("adminToken", token);
    localStorage.setItem("adminInfo", JSON.stringify(admin));
  };

  const handleLogout = () => {
    setToken("");
    setAdmin(null);
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminInfo");
  };

  if (!token) {
    return <AdminAuthPage onLogin={handleLogin} />;
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="flex justify-end p-4">
        <button
          className="bg-red-500 text-white px-4 py-2 rounded"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
      <MainDashboard token={token} admin={admin} />
    </div>
  );
}

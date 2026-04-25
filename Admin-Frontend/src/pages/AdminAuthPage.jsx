import React, { useState } from "react";

export default function AdminAuthPage({ onLogin }) {
  const [tab, setTab] = useState("login");
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const RESTAURANT_API_URL = import.meta.env.VITE_RESTAURANT_API_URL;

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const url = tab === "register"
        ? `${RESTAURANT_API_URL}/admin/register`
        : `${RESTAURANT_API_URL}/admin/login`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Failed");
      setSuccess(data.message);
      if (tab === "login" && onLogin) onLogin(data.token, data.admin);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-8">
        <div className="flex mb-6">
          <button
            className={`flex-1 py-2 font-bold rounded-l-lg ${tab === "login" ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-600"}`}
            onClick={() => setTab("login")}
          >Login</button>
          <button
            className={`flex-1 py-2 font-bold rounded-r-lg ${tab === "register" ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-600"}`}
            onClick={() => setTab("register")}
          >Register</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="email"
            type="email"
            className="w-full border rounded px-3 py-2"
            placeholder="Admin Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            name="password"
            type="password"
            className="w-full border rounded px-3 py-2"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          {error && <div className="text-red-500 text-sm">{error}</div>}
          {success && <div className="text-green-600 text-sm">{success}</div>}
          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 rounded-lg transition"
            disabled={loading}
          >
            {loading ? (tab === "register" ? "Registering..." : "Logging in...") : (tab === "register" ? "Register" : "Login")}
          </button>
        </form>
      </div>
    </div>
  );
}

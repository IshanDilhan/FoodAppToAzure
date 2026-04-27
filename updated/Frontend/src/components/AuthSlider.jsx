import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { FaUser, FaLock, FaCamera, FaHome, FaPhone } from "react-icons/fa";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

const USER_API_URL = import.meta.env.VITE_USER_API_URL;

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function AuthSlider({ onAuthSuccess, onClose }) {
  const [tab, setTab] = useState("signup");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [preview, setPreview] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" }); // { type: "error"|"success", text: string }
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef();
  const { refetchCart } = useCart();
  const navigate = useNavigate();

  // Clear message after 3 seconds if success
  useEffect(() => {
    if (message.type === "success") {
      const timer = setTimeout(() => setMessage({ text: "", type: "" }), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Reset form & messages on tab switch  
  const switchTab = (newTab) => {
    setTab(newTab);
    setMessage({ text: "", type: "" });
    setEmail("");
    setPassword("");
    setName("");
    setAddress("");
    setPhone("");
    setProfilePic(null);
    setPreview("");
  };

  // Preview profile pic for signup
  const handleProfilePicChange = (e) => {
    const file = e.target.files?.[0] || null;
    setProfilePic(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setPreview("");
    }
  };

  // Form submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    // Validation
    if (!isValidEmail(email)) {
      setMessage({ text: "Please enter a valid email address.", type: "error" });
      setLoading(false);
      return;
    }
    if (tab === "signup" && !name.trim()) {
      setMessage({ text: "Please enter your name.", type: "error" });
      setLoading(false);
      return;
    }
    if (!password || password.length < 5) {
      setMessage({ text: "Password must be at least 5 characters.", type: "error" });
      setLoading(false);
      return;
    }

    try {
      let res;

      if (tab === "signup") {
        const formData = new FormData();
        formData.append("name", name.trim());
        formData.append("email", email.trim());
        formData.append("password", password);
        formData.append("address", address.trim());
        formData.append("phone", phone.trim());
        if (profilePic) formData.append("profilePic", profilePic);

        res = await axios.post(`${USER_API_URL}/auth/register`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        res = await axios.post(`${USER_API_URL}/auth/login`, {
          email: email.trim(),
          password,
        });
      }

      // Store token & user
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setMessage({
        text: `${tab === "signup" ? "Registration" : "Login"} refresh the page`,
        type: "success",
      });

      // After success, update UI & route
      setTimeout(() => {
        onAuthSuccess(res.data.user);
        refetchCart();
        onClose();
        navigate("/");
      }, 1500);
    } catch (err) {
      setMessage({
        text: err.response?.data?.message || "An error occurred",
        type: "error",
      });
    }

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-white bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-8 w-full max-w-md shadow-lg relative animate-fadeIn">
        {/* Close Button */}
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-900 transition"
          onClick={onClose}
          aria-label="Close auth form"
        >
          ✕
        </button>

        {/* Tabs */}
        <div className="flex mb-6 border-b border-gray-300" role="tablist">
          <button
            type="button"
            className={`flex-1 py-2 font-semibold text-center ${
              tab === "signup" ? "border-b-2 border-black text-black" : "text-gray-400"
            } transition`}
            onClick={() => switchTab("signup")}
            aria-selected={tab === "signup"}
            role="tab"
          >
            Sign Up
          </button>
          <button
            type="button"
            className={`flex-1 py-2 font-semibold text-center ${
              tab === "login" ? "border-b-2 border-black text-black" : "text-gray-400"
            } transition`}
            onClick={() => switchTab("login")}
            aria-selected={tab === "login"}
            role="tab"
          >
            Sign In
          </button>
        </div>

        {/* Alert Messages */}
        {message.text && (
          <div
            role={message.type === "error" ? "alert" : "status"}
            className={`mb-4 px-4 py-3 rounded ${
              message.type === "success"
                ? "bg-green-100 border border-green-600 text-green-800 animate-slideDown"
                : "bg-red-100 border border-red-600 text-red-800 animate-slideDown"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6" aria-live="polite">
          <h2 className="text-xl font-semibold text-center mb-3">
            {tab === "signup" ? "Create your account" : "Sign in to your account"}
          </h2>

          {/* Signup extra fields */}
          {tab === "signup" && (
            <>
              <div className="flex flex-col items-center gap-2">
                <div className="relative w-24 h-24">
                  <img
                    src={preview || "/user-avatar.png"}
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current.click()}
                    className="absolute bottom-1 right-1 bg-black text-white rounded-full p-2 shadow hover:bg-gray-800 transition"
                    title="Upload profile picture"
                  >
                    <FaCamera />
                  </button>
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleProfilePicChange}
                    className="hidden"
                    aria-label="Upload profile picture"
                  />
                </div>

                <input
                  type="text"
                  className="w-full border rounded px-3 py-2 mt-2 focus:ring-2 focus:ring-black outline-none"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                  required
                />

                <div className="flex items-center border rounded px-3 py-2 w-full focus-within:ring-2 focus-within:ring-black">
                  <FaHome className="mr-2 text-gray-400" aria-hidden="true" />
                  <input
                    type="text"
                    className="flex-1 outline-none"
                    placeholder="Address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    autoComplete="street-address"
                    required
                  />
                </div>

                <div className="flex items-center border rounded px-3 py-2 w-full focus-within:ring-2 focus-within:ring-black">
                  <FaPhone className="mr-2 text-gray-400" aria-hidden="true" />
                  <input
                    type="tel"
                    className="flex-1 outline-none"
                    placeholder="Phone Number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    autoComplete="tel"
                    required
                  />
                </div>
              </div>
            </>
          )}

          {/* Email */}
          <div className="flex items-center border rounded px-3 py-2 focus-within:ring-2 focus-within:ring-black">
            <FaUser className="mr-2 text-gray-400" aria-hidden="true" />
            <input
              type="email"
              className="flex-1 outline-none"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>

          {/* Password */}
          <div className="flex items-center border rounded px-3 py-2 focus-within:ring-2 focus-within:ring-black">
            <FaLock className="mr-2 text-gray-400" aria-hidden="true" />
            <input
              type="password"
              className="flex-1 outline-none"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={tab === "signup" ? "new-password" : "current-password"}
              required
              minLength={5}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full text-white bg-black py-3 rounded-md font-semibold flex justify-center items-center gap-3 hover:bg-gray-900 transition disabled:opacity-50"
          >
            {loading ? (
              <>
                <Spinner />
                Please wait...
              </>
            ) : tab === "signup" ? (
              "Sign Up"
            ) : (
              "Sign In"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

// Spinner component (loading animation)
function Spinner() {
  return (
    <svg
      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
      role="img"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>
  );
}

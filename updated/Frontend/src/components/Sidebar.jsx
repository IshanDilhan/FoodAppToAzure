import React, { useEffect, useState } from "react";
import {
  FaUserCircle,
  FaHome,
  FaBookmark,
  FaHeart,
  FaWallet,
  FaQuestionCircle,
  FaTag,
  FaCrown,
  FaGift,
  FaSignOutAlt,
  FaStore,
  FaMotorcycle,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import axios from "axios";

const USER_API_URL = import.meta.env.VITE_USER_API_URL;

export default function Sidebar({ open, onClose }) {
  const [user, setUser] = useState(null);

  // Fetch latest user profile when sidebar opens
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const res = await axios.get(`${USER_API_URL}/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data.user);
        localStorage.setItem("user", JSON.stringify(res.data.user));
      } catch {
        setUser(null);
      }
    };
    if (open) fetchUser();
  }, [open]);

  return (
    <div
      className={`fixed top-0 left-0 h-full w-80 bg-white shadow-lg z-50 transform ${
        open ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-300`}
    >
      <button
        className="absolute top-4 right-4 text-gray-400 hover:text-black"
        onClick={onClose}
        aria-label="Close sidebar"
      >
        ✕
      </button>
      <div className="flex flex-col items-center mt-8 mb-6">
        {user?.profilePic ? (
          <img
            src={user.profilePic}
            alt={user.name || "Profile"}
            className="w-20 h-20 rounded-full object-cover border-4 border-orange-300 shadow mb-2"
          />
        ) : (
          <FaUserCircle className="text-6xl text-gray-300 mb-2" />
        )}
        <div className="text-lg font-bold">{user?.name || "Guest"}</div>
        <div className="text-xs text-green-600">{user?.email}</div>
        <a
          href="/profile"
          className="text-green-600 text-xs mt-1 hover:underline"
        >
          Manage account
        </a>
      </div>
      <ul className="px-8 flex flex-col gap-3">
        <Link to="/">
          <li className="flex items-center gap-3 cursor-pointer hover:text-orange-500">
            <FaHome /> Home
          </li>
        </Link>

        <Link to="/restaurant/all">
          <li className="flex items-center gap-3 cursor-pointer hover:text-orange-500">
            <FaStore /> Restaurants
          </li>
        </Link>

        <Link to="/orders">
          <li className="flex items-center gap-3 cursor-pointer hover:text-orange-500">
            <FaBookmark /> Orders
          </li>
        </Link>
        <li className="flex items-center gap-3 cursor-pointer hover:text-orange-500">
          <FaHeart /> Favorites
        </li>
        <li className="flex items-center gap-3 cursor-pointer hover:text-orange-500">
          <FaWallet /> Wallet
        </li>
        <li className="flex items-center gap-3 cursor-pointer hover:text-orange-500">
          <FaQuestionCircle /> Help
        </li>
        <li className="flex items-center gap-3 cursor-pointer hover:text-orange-500">
          <FaTag /> Promotions
        </li>
        <li className="flex items-center gap-3 cursor-pointer hover:text-orange-500">
          <FaCrown className="text-yellow-500" />{" "}
          <span>
            Island Rasa{" "}
            <span className="text-xs text-yellow-500">
              Get savings on deliveries and rides
            </span>
          </span>
        </li>
        <li className="flex items-center gap-3 cursor-pointer hover:text-orange-500">
          <FaGift /> Invite friends{" "}
          <span className="text-xs text-gray-500">
            You get LKR 0 Delivery Fee
          </span>
        </li>
      </ul>
      <div className="px-8 mt-6">
        <div>
          <div className="flex items-center mb-2 text-gray-500 hover:text-black text-lg font-bold">
            <FaStore className="mr-2 text-black" />
            Add your restaurant
          </div>
          <div className="flex items-center mb-6 text-gray-500 hover:text-black text-lg">
            <FaMotorcycle className="mr-2 text-black" />
            Sign up to deliver
          </div>
          <button
            className="flex items-center gap-2 text-gray-500 hover:text-red-600"
            onClick={() => {
              localStorage.clear();
              window.location.reload();
            }}
          >
            <FaSignOutAlt className="text-black" /> Sign out
          </button>
        </div>
      </div>
    </div>
  );
}

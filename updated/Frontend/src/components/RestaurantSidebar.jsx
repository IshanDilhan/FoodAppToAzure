import React, { useState } from "react";
import {
  FaUtensils,
  FaChartPie,
  FaListAlt,
  FaUserFriends,
  FaStore,
  FaPlus,
  FaCog,
  FaBars,
  FaSignOutAlt,
} from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";

const sidebarItems = [
  { label: "Dashboard", icon: <FaChartPie />, path: "/restaurant/profile" },
  { label: "Menu List", icon: <FaUtensils />, path: "/restaurant/menus" },
  { label: "Add Menu", icon: <FaPlus />, path: "/menu-add" },
  { label: "Orders", icon: <FaListAlt />, path: "/restaurant/orders" },
  { label: "Customers", icon: <FaUserFriends />, path: "/restaurant/customers" },
  { label: "Online Store", icon: <FaStore />, path: "/restaurant/store" },
  { label: "Settings", icon: <FaCog />, path: "/restaurant/settings" },
];

export default function RestaurantSidebar({ restaurant }) {
  const [open, setOpen] = useState(true); // For desktop toggle (collapse)
  const [mobileOpen, setMobileOpen] = useState(false); // For mobile sidebar open/close
  const [signingOut, setSigningOut] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const handleSignOut = () => {
    setSigningOut(true);
    setTimeout(() => {
      localStorage.removeItem("restaurantToken");
      localStorage.removeItem("restaurantId");
      localStorage.removeItem("restaurant");
      setSigningOut(false);
      navigate("/");
    }, 1800);
  };

  if (signingOut) {
    return (
      <div className="fixed inset-0 z-50 bg-white bg-opacity-80 flex flex-col items-center justify-center">
        <svg
          className="animate-spin h-12 w-12 text-orange-500 mb-6"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          />
        </svg>
        <span className="text-xl text-orange-500 font-bold">You are signing out...</span>
      </div>
    );
  }

  return (
    <>
      {/* Mobile menu toggle button */}
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        aria-label="Open sidebar menu"
        className="fixed top-4 left-4 z-50 p-2 rounded-md bg-[#23263a] text-white md:hidden focus:outline-none focus:ring-2 focus:ring-orange-500"
      >
        <FaBars />
      </button>

      {/* Mobile sidebar backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0  bg-opacity-50 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full bg-white shadow-lg z-50 transform
          transition-transform duration-300 ease-in-out
          w-64 md:relative md:w-auto md:flex md:flex-col md:py-6 md:px-2
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0
          ${open ? "md:w-64" : "md:w-16"}
          flex flex-col
        `}
        aria-label="Sidebar navigation"
      >
        {/* Desktop collapse toggle */}
        <button
          type="button"
          aria-label={open ? "Collapse sidebar" : "Expand sidebar"}
          className="hidden md:absolute md:-right-4 md:top-8 bg-[#23263a] text-white p-2 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-500 z-10"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? (
            <FaBars className="rotate-180" />
          ) : (
            <FaPlus />
          )}
        </button>

        {/* Logo and name */}
        <div
          className={`flex flex-col items-center mb-8 px-3 transition-all duration-200 ${
            open ? "items-center" : "items-center"
          }`}
        >
          <img
            src={restaurant?.logo || "/logo192.png"}
            alt="Logo"
            className={`rounded-xl object-cover border-4 border-white shadow-lg bg-white mb-2 ${
              open ? "w-36 h-20" : "w-10 h-10"
            }`}
          />
          {open && (
            <span className="font-bold text-lg text-[#23263a] truncate max-w-[120px] text-center">
              {restaurant?.name || "Restaurant"}
            </span>
          )}
        </div>

        {/* Navigation links */}
        <nav className="flex-1 overflow-y-auto">
          <ul className="space-y-2">
            {sidebarItems.map((item) => (
              <li key={item.label}>
                <Link
                  to={item.path}
                  onClick={() => setMobileOpen(false)} // Close mobile sidebar on link click
                  className={`flex items-center px-4 py-2 rounded-lg font-medium transition ${
                    location.pathname === item.path
                      ? "bg-[#23263a] text-white"
                      : "text-[#23263a] hover:bg-[#f5f5f5]"
                  }`}
                >
                  <span className="mr-3 text-lg">{item.icon}</span>
                  {open && item.label}
                </Link>
              </li>
            ))}
            <li>
              <button
                type="button"
                onClick={handleSignOut}
                className="flex items-center w-full px-4 py-2 rounded-lg font-medium transition text-red-500 hover:bg-red-50 hover:text-red-700 mt-2 focus:outline-none focus:ring-2 focus:ring-red-600"
              >
                <span className="mr-3 text-lg">
                  <FaSignOutAlt />
                </span>
                {open && "Sign Out"}
              </button>
            </li>
          </ul>
        </nav>
      </aside>
    </>
  );
}

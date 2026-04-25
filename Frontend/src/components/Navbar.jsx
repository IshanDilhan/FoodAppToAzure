import React, { useState } from "react";
import AuthSlider from "./AuthSlider";
import Sidebar from "./Sidebar";
import CartDrawer from "./CartDrawer";
import { FaBars, FaShoppingCart, FaUserCircle } from "react-icons/fa";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const [showLogin, setShowLogin] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const { cart } = useCart();
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  });

  // Calculate cart count from actual cart items
  const cartCount =
    cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0;

  return (
    <>
      <div className="flex justify-between items-center px-4 sm:px-6 md:px-8 py-4 bg-white shadow relative">
        {/* Hamburger icon visible on all screen sizes */}
        <button
          className="text-2xl text-gray-600 mr-4"
          onClick={() => setShowSidebar(true)}
          aria-label="Open menu"
          type="button"
        >
          <FaBars />
        </button>

        {/* Logo */}
        <div className="flex items-center flex-shrink-0">
          <img
            src="/images/isalndlogo.png"
            alt="Island Rasa"
            className="h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 mr-0 md:mr-64"
          />
        </div>

        {/* Navigation - hide on small screens */}
        <nav className="hidden md:flex space-x-6 lg:space-x-8 whitespace-nowrap font-semibold text-gray-700">
          <a href="/" className="text-orange-500 hover:text-orange-600">
            Home
          </a>
          <a href="/all-menu" className="hover:text-orange-500">
            Browse Menu
          </a>
          <a href="#" className="hover:text-orange-500">
            Special Offers
          </a>
          <a href="/restaurant/all" className="hover:text-orange-500">
            Restaurants
          </a>
          <a href="#" className="hover:text-orange-500">
            Track Order
          </a>
        </nav>

        {/* Right side icons */}
        <div className="flex items-center space-x-4">
          {/* Cart Icon */}
          <button
            className="relative text-2xl text-gray-600 hover:text-orange-500 focus:outline-none"
            onClick={() => setShowCart(true)}
            aria-label="Open Cart"
            type="button"
          >
            <FaShoppingCart />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full px-1.5 py-0.5 select-none pointer-events-none">
                {cartCount}
              </span>
            )}
          </button>

          {/* User Profile or Login */}
          {user ? (
            <a
              href="/profile"
              className="flex items-center focus:outline-none focus:ring-2 focus:ring-orange-500 rounded"
            >
              {user.profilePic ? (
                <img
                  src={user.profilePic}
                  alt={user.name || "Profile"}
                  className="w-10 h-10 rounded-full object-cover border-2 border-orange-400 shadow-sm"
                />
              ) : (
                <FaUserCircle
                  className="w-10 h-10 text-orange-400"
                  aria-hidden="true"
                />
              )}
            </a>
          ) : (
            <button
              className="bg-black text-white px-4 py-2 sm:px-6 sm:py-2 rounded text-sm sm:text-base font-semibold hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-orange-500"
              onClick={() => setShowLogin(true)}
              aria-label="Login or Sign up"
              type="button"
            >
              Login / Signup
            </button>
          )}
        </div>
      </div>

      {/* Modals and overlays */}
      {showLogin && (
        <AuthSlider
          onAuthSuccess={(user) => setUser(user)}
          onClose={() => setShowLogin(false)}
        />
      )}
      <Sidebar
        user={user}
        open={showSidebar}
        onClose={() => setShowSidebar(false)}
      />
      <CartDrawer open={showCart} onClose={() => setShowCart(false)} />
    </>
  );
}

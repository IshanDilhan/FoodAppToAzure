import React from "react";
import { Link } from "react-router-dom";

export default function RiderWelcomeInfo() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-200 flex flex-col items-center">
      
      {/* Hero Section */}
      <section className="w-full max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10 px-6 md:px-12 py-10">
        {/* Text */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-black text-white px-3 py-1 rounded-full text-xs font-semibold">Welcome Delivery Partner</span>
            <span className="bg-gray-200 px-2 py-1 rounded text-xs font-medium">Best Delivery Service</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-black mb-4 leading-tight">
            Fastest Delivery<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-black to-gray-700">Easy Pickup</span>
          </h1>
          <p className="text-gray-700 text-lg mb-6 max-w-lg">
            Welcome to the team! As a delivery rider, you help connect people with what they love-quickly, safely, and with a smile. To get started, please complete your profile so we can match you with the best delivery opportunities.
          </p>
          <Link to="/rider/location">
            <button className="bg-black text-white px-6 py-3 rounded-full font-semibold text-lg hover:bg-gray-800 transition">
              Complete My Profile
            </button>
          </Link>
        </div>
        {/* Illustration */}
        <div className="flex-1 flex justify-center items-center">
          {/* Delivery Rider SVG (black and white style) */}
          <svg width="260" height="260" viewBox="0 0 260 260" fill="none">
            <circle cx="130" cy="130" r="120" fill="#f3f3f3"/>
            <rect x="70" y="170" width="120" height="32" rx="16" fill="#222"/>
            <rect x="80" y="110" width="100" height="60" rx="15" fill="#fff" stroke="#222" strokeWidth="3"/>
            <rect x="100" y="80" width="60" height="36" rx="18" fill="#222"/>
            <circle cx="90" cy="202" r="16" fill="#fff" stroke="#222" strokeWidth="5"/>
            <circle cx="170" cy="202" r="16" fill="#fff" stroke="#222" strokeWidth="5"/>
            <rect x="120" y="130" width="20" height="20" rx="10" fill="#222"/>
          </svg>
        </div>
      </section>

      {/* How We Work */}
      <section className="w-full max-w-5xl mx-auto px-6 md:px-12 py-8">
        <h2 className="text-2xl font-bold text-black mb-6 text-center">How We Work</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
            <span className="w-12 h-12 flex items-center justify-center rounded-full bg-black mb-3">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0h4" />
              </svg>
            </span>
            <h3 className="font-semibold text-black mb-2">Connect Your Store</h3>
            <p className="text-gray-600 text-center text-sm">Link up and get ready to start delivering to customers in your area.</p>
          </div>
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
            <span className="w-12 h-12 flex items-center justify-center rounded-full bg-black mb-3">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path d="M16 11V5a1 1 0 00-1-1H5a1 1 0 00-1 1v6m12 0v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6m12 0H4" />
              </svg>
            </span>
            <h3 className="font-semibold text-black mb-2">Sell Products</h3>
            <p className="text-gray-600 text-center text-sm">Deliver a variety of products, from food to essentials, right to the customer’s door.</p>
          </div>
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
            <span className="w-12 h-12 flex items-center justify-center rounded-full bg-black mb-3">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path d="M9 12l2 2 4-4" />
              </svg>
            </span>
            <h3 className="font-semibold text-black mb-2">Order Complete</h3>
            <p className="text-gray-600 text-center text-sm">Confirm successful deliveries and keep your customers happy and satisfied.</p>
          </div>
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
            <span className="w-12 h-12 flex items-center justify-center rounded-full bg-black mb-3">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path d="M12 8v4l3 3" />
              </svg>
            </span>
            <h3 className="font-semibold text-black mb-2">Wait for Delivery</h3>
            <p className="text-gray-600 text-center text-sm">Stay ready for your next delivery and watch your earnings grow.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

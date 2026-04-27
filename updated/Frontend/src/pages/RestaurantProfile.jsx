import React, { useEffect, useState } from "react";
import MenuAddForm from "../components/MenuAddForm";
import RestaurantProfileDashboard from "../components/RestaurantProfileDashboard";
import RestaurantSidebar from "../components/RestaurantSidebar";

const RESTAURANT_API_URL = import.meta.env.VITE_RESTAURANT_API_URL;

export default function RestaurantProfile() {
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restaurantId = localStorage.getItem("restaurantId");
    if (!restaurantId) {
      window.location.href = "/";
      return;
    }
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${RESTAURANT_API_URL}/restaurants/${restaurantId}`);
        const data = await res.json();
        if (data.success) setRestaurant(data.data);
      } catch (err) {
        // handle error
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#FAFAFA]">
        <div className="text-xl text-orange-500">Loading profile...</div>
      </div>
    );
  }
  if (!restaurant) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#FAFAFA]">
        <div className="text-red-500">Profile not found.</div>
      </div>
    );
  }

  // Fallback data if some fields are missing
  const minOrder = restaurant.minOrder || "12 GBP";
  const deliveryTime = restaurant.deliveryTime || "20–25 Minutes";
  const rating = restaurant.rating || 3.4;
  const reviewCount = restaurant.reviewCount || 1360;
  const openUntil = restaurant.availableTime || "3:00 AM";
  const tagline = restaurant.tagline || "I'm lovin' it!";

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col">
      {/* Hero Section */}
      <div className="relative w-full h-[300px] md:h-[280px] flex items-center overflow-hidden rounded-b-2xl">
        {/* Background image with dark overlay */}
        <img
          src={restaurant.coverImage}
          alt="Cover"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#23263a]/90" />
        {/* Content */}
        <div className="relative z-10 flex flex-col md:flex-row w-full h-full items-center justify-between px-4 sm:px-8 py-8">
          {/* Left: Text info */}
          <div className="flex-1 flex flex-col justify-center h-full text-white max-w-full">
            <div className="text-sm mb-2 opacity-80 truncate">{tagline}</div>
            <div className="mb-4 max-w-full overflow-hidden">
              <h1 className="text-3xl md:text-4xl font-bold text-white flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-1">
                <span className="truncate">{restaurant.name}</span>
                <span className="text-lg md:text-xl font-medium text-[#FFD700] mt-2 sm:mt-0 truncate">
                  , {restaurant.address}
                </span>
              </h1>
            </div>

            <div className="flex flex-wrap gap-3 mb-5 max-w-full">
              <span className="flex items-center gap-2 px-4 py-2 bg-[#23263a] rounded-full border border-white/10 text-sm font-medium whitespace-nowrap">
                <i className="fa-solid fa-wallet" aria-hidden="true"></i>
                <span className="truncate">Minimum Order: {minOrder}</span>
              </span>
              <span className="flex items-center gap-2 px-4 py-2 bg-[#23263a] rounded-full border border-white/10 text-sm font-medium whitespace-nowrap">
                <i className="fa-solid fa-motorcycle" aria-hidden="true"></i>
                <span className="truncate">Delivery in {deliveryTime}</span>
              </span>
            </div>
          </div>

          {/* Right: Food image and rating */}
          <div className="flex flex-col items-center sm:items-end justify-center h-full mt-6 md:mt-0 min-w-[190px] max-w-[240px] flex-shrink-0">
            <div className="relative w-full max-w-[240px]">
              <img
                src={restaurant.logo}
                alt="Logo"
                className="w-full h-36 rounded-xl object-cover border-4 border-white shadow-lg bg-white"
              />
              {/* Rating Card */}
              <div className="absolute -left-6 -bottom-6 bg-white rounded-xl px-4 py-2 shadow-lg flex flex-col items-center border border-gray-100 w-24">
                <div className="flex items-center gap-2 text-2xl font-bold text-gray-900">
                  {rating.toFixed(1)}
                  <span className="text-yellow-400 text-lg" aria-label="star rating">
                    <i className="fa-solid fa-star" />
                  </span>
                </div>
                <div className="text-xs text-gray-500">
                  {reviewCount.toLocaleString()} reviews
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Open Until */}
        <div className="absolute left-0 bottom-0">
          <div className="bg-[#ffb300] text-white px-6 py-2 rounded-tr-2xl rounded-bl-2xl flex items-center gap-2 font-semibold text-base shadow-lg whitespace-nowrap">
            <i className="fa-solid fa-clock" aria-hidden="true"></i>
            Open until {openUntil}
          </div>
        </div>
      </div>

      {/* Main content below hero */}
      <div className="flex flex-col md:flex-row flex-1 min-h-0">
        <aside className="md:w-64 bg-white border-r border-gray-200 shrink-0">
          <RestaurantSidebar restaurant={restaurant} />
        </aside>
        <main className="flex-1 overflow-auto p-4 md:p-8 max-w-full">
          <RestaurantProfileDashboard restaurant={restaurant} />
        </main>
      </div>
    </div>
  );
}

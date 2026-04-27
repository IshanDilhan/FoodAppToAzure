import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MenuPage from "./MenuPage";


export default function RestaurantMenu() {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const RESTAURANT_API_URL = import.meta.env.VITE_RESTAURANT_API_URL;


  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const res = await fetch(`${RESTAURANT_API_URL}/restaurants/${id}`);
        const data = await res.json();
        if (data.success) setRestaurant(data.data);
      } catch (err) {
        // handle error
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurant();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#FAFAFA]">
        <div className="text-xl text-orange-500">Loading restaurant...</div>
      </div>
    );
  }
  if (!restaurant) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#FAFAFA]">
        <div className="text-red-500">Restaurant not found.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col pb-12">
      {/* Cover Section */}
      <div className="relative w-full h-[300px] md:h-[280px] flex items-center overflow-hidden rounded-b-2xl mb-8">
        <img
          src={restaurant.coverImage}
          alt="Cover"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#23263a]/80" />
        <div className="relative z-10 flex flex-col md:flex-row w-full h-full items-center justify-between px-8 py-8">
          <div className="flex-1 flex flex-col justify-center h-full text-white">
            <h1 className="text-3xl md:text-4xl font-bold text-white flex items-center mb-2">
              {restaurant.name}
            </h1>
            <div className="text-lg font-medium text-[#FFD700]">{restaurant.address}</div>
          </div>
          <div className="flex flex-col items-end justify-center h-full">
            <div className="relative">
              <img
                src={restaurant.logo}
                alt="Logo"
                className="w-44 h-28 rounded-xl object-cover border-4 border-white shadow-lg bg-white"
              />
            </div>
          </div>
        </div>
      </div>

      <MenuPage restaurantId={restaurant._id} />

    </div>
  );
}

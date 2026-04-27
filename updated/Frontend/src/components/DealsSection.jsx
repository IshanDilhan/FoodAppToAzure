import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function DealsSection() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [foodImg, setFoodImg] = useState("");
  const navigate = useNavigate();
  
  const RESTAURANT_API_URL = import.meta.env.VITE_RESTAURANT_API_URL;


  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const res = await axios.get(`${RESTAURANT_API_URL}/restaurants/approved`);
        setRestaurants(res.data.data);
      } catch (err) {
        console.error("Error fetching restaurants", err);
      }
    };
    fetchRestaurants();
  }, []);

  const handleCardClick = (rest) => {
    setFoodImg(rest.logo || rest.coverImage);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate(`/restaurant/profile/${rest._id}`);
    }, 1200);
  };

  return (
    <section className="px-8 mt-10">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 space-y-3 sm:space-y-0">
  <h2 className="text-xl font-bold text-center sm:text-left">
    Up to <span className="text-orange-500">-40%</span> 🍔 Order.uk exclusive deals
  </h2>
  <div className="flex space-x-2 justify-center sm:justify-start">
    <button className="bg-gray-200 px-3 py-1 rounded text-xs whitespace-nowrap hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500">
      Vegan
    </button>
    <button className="bg-orange-100 text-orange-500 px-3 py-1 rounded text-xs whitespace-nowrap hover:bg-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-500">
      Items & Fast Food
    </button>
  </div>
</div>

      {/* Loading Overlay with Food Image */}
      {loading && (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-black bg-opacity-60 z-50">
          <img
            src={foodImg}
            alt="Loading food"
            className="w-24 h-24 rounded-full object-cover mb-6 animate-bounce"
          />
          <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-orange-500 border-b-4 border-white mb-4"></div>
          <div className="text-xl font-semibold text-white">Loading restaurant...</div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {restaurants.slice(0, 6).map((rest) => (
          <div
            key={rest._id}
            className="bg-white rounded-lg shadow-md relative flex flex-col cursor-pointer transition-transform hover:scale-105"
            onClick={() => handleCardClick(rest)}
          >
            <img
              src={rest.coverImage}
              alt={rest.name}
              className="rounded-t-lg h-40 w-full object-cover"
            />
            <span className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded">
              {rest.discount || "-20%"}
            </span>
            <div className="p-4 flex-1 flex flex-col">
              <h3 className="font-semibold text-lg mb-1">{rest.name}</h3>
              <p className="text-gray-500 text-sm mb-2">Restaurant</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RESTAURANT_API_URL = import.meta.env.VITE_RESTAURANT_API_URL;

export default function AllApprovedRestaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [foodImg, setFoodImg] = useState("");
  const navigate = useNavigate();
  
  

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
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">
          All  Restaurants
        </h2>
      </div>

      {/* Loading Overlay with Food Image */}
      {loading && (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-black bg-opacity-60 z-50">
          <img
            src={foodImg}
            alt="Loading food"
            className="w-24 h-24 rounded-full object-cover mb-6 animate-bounce"
          />
          <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-orange-500 border-b-4 "></div>
          <div className="text-xl font-semibold text-white">Loading restaurant...</div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {restaurants.map((rest) => (
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

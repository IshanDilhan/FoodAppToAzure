import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaStar } from "react-icons/fa";

function MenuCard({ item }) {
  

  return (
    <div className="flex flex-col items-center bg-white rounded-lg shadow p-4">
      <div className="relative mb-2 w-full flex justify-center">
        <img
          src={item.image}
          alt={item.name}
          className="h-20 w-20 object-contain rounded-lg"
        />
        <FaStar className="absolute top-0 right-0 text-yellow-400 text-lg" title="Popular" />
      </div>
      <span className="text-sm font-bold text-[#1c2331] text-center mb-1">
        {item.category}
      </span>
      <span className="text-xs text-gray-500 text-center">
        {item.restaurant?.name && (
          <>From <span className="font-semibold">{item.restaurant.name}</span></>
        )}
      </span>
    </div>
  );
}

export default function PopularMenuSection() {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

  const RESTAURANT_API_URL = import.meta.env.VITE_RESTAURANT_API_URL;


  useEffect(() => {
    const fetchMenus = async () => {
      setLoading(true);
      setFetchError("");
      try {
        const res = await axios.get(`${RESTAURANT_API_URL}/menu/popular`);
        setMenus(res.data.data || []);
      } catch (err) {
        setMenus([]);
        setFetchError(
          err?.response?.data?.message ||
          err?.message ||
          "Failed to fetch popular menus."
        );
        console.error("Error fetching all popular menus:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMenus();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[120px]">
        <div className="text-xl text-orange-500">Loading popular menus...</div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="flex justify-center items-center min-h-[120px]">
        <div className="text-red-500">{fetchError}</div>
      </div>
    );
  }

  if (!menus.length) {
    return (
      <div className="flex justify-center items-center min-h-[120px]">
        <div className="text-gray-400">No popular menus yet.</div>
      </div>
    );
  }

  return (
    <section className="px-8 mt-10">
      <h2 className="text-xl font-bold mb-4">Popular Menus 🍟</h2>
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        {menus.map((item) => (
          <MenuCard key={item._id} item={item} />
        ))}
      </div>
    </section>
  );
}

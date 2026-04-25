import React, { useEffect, useState } from "react";
import axios from "axios";

export default function PopularRestaurants() {
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const res = await axios.get("https://http://restaurant-backend:4000/api/restaurants/approved");
        setRestaurants(res.data.data);
      } catch (error) {
        console.error("Error fetching restaurants:", error);
      }
    };

    fetchRestaurants();
  }, []);

  return (
    <section className="px-4 sm:px-8 mt-10 max-w-screen-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Popular Restaurants</h2>
      <div
        className="
          grid grid-cols-2 gap-6
          max-h-[36rem]  /* approx 2 rows height: 2 * (h-56 = 14rem + gap ~4rem) */
          overflow-y-auto
          sm:max-h-none sm:overflow-visible
          scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100
        "
        aria-label="Popular restaurants list"
      >
        {restaurants.map((rest, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center bg-white rounded-lg shadow p-4 h-56"
          >
            <img
              src={rest.logo}
              alt={rest.name}
              className="h-40 w-full max-w-xs object-contain rounded-lg shadow-md mb-2"
            />
            <span className="text-xs text-center font-semibold truncate w-full">
              {rest.name}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

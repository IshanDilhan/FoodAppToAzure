import React, { useEffect, useState } from "react";
import axios from "axios";

// Fallback image if a category has no image
const FALLBACK_IMG = "https://pplx-res.cloudinary.com/image/private/user_uploads/TrgHUsSUcFpcnvv/Group-26.jpg";

export default function RestaurantCategoriesSection({ restaurantId }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Fetch all menu items for this restaurant
        const res = await axios.get(`http://localhost:4000/api/menu/${restaurantId}`);
        const menus = res.data.data || [];

        // Extract unique categories with the first image for each
        const catMap = {};
        menus.forEach((item) => {
          if (item.category && !catMap[item.category]) {
            catMap[item.category] = {
              name: item.category,
              img: item.image || FALLBACK_IMG, // use the first image for this category
            };
          }
        });
        setCategories(Object.values(catMap));
      } catch (err) {
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };
    if (restaurantId) fetchCategories();
  }, [restaurantId]);

  return (
    <section className="px-8 mt-10">
      <h2 className="text-xl font-bold mb-4">Categories at this Restaurant 🍽️</h2>
      {loading ? (
        <div className="flex justify-center items-center min-h-[120px]">
          <div className="text-orange-500 text-lg">Loading categories...</div>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          {categories.map((cat, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center bg-white rounded-lg shadow p-4"
            >
              <img
                src={cat.img}
                alt={cat.name}
                className="h-full w-full object-contain mb-2"
                style={{ maxHeight: 80, maxWidth: 80 }}
              />
              <span className="text-sm text-center">{cat.name}</span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

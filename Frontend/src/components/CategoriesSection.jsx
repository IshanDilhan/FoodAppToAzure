import React from "react";
import RestaurantCategoriesSection from "./RestaurantCategoriesSection";

const categories = [
  { name: "Burgers & Fast food", img: "/images/c1.png" },
  { name: "Salads", img: "/images/c2.png" },
  { name: "Pasta & Casuals", img: "/images/c3.png" },
  { name: "Pizza", img: "/images/c4.png" },
  { name: "Breakfast", img: "/images/c5.png" },
  { name: "Soups", img: "/images/c6.png" },
];

export default function CategoriesSection() {
  return (
    <section className="px-8 mt-10">
      <h2 className="text-xl font-bold mb-4">Order.uk Popular Categories 🍽️</h2>
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        {categories.map((cat, idx) => (
          <div key={idx} className="flex flex-col items-center bg-white rounded-lg shadow p-4">
            <img src={cat.img} alt={cat.name} className="h-full w-full object-contain mb-2" />
            <span className="text-sm text-center">{cat.name}</span>
          </div>
        ))}
      </div>

      

    </section>
  );
}

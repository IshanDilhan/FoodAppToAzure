import React from "react";

export default function TopBar() {
  return (
    <div className="bg-[#FFF7E6] text-xs flex flex-col md:flex-row justify-between items-center px-6 py-2 space-y-2 md:space-y-0">
      <span className="text-center md:text-left w-full md:w-auto">
        Get 15% on your first order.{" "}
        <span className="text-orange-500 font-semibold">Promo: ORDER15</span>
      </span>
      <span className="text-center md:text-left w-full md:w-auto">Borella 06 colombo</span>
      <div className="flex items-center justify-center md:justify-start space-x-4 w-full md:w-auto">
        <span className="flex items-center">
          <span className="bg-green-500 text-white rounded px-2 py-1 mr-1">25 min</span> Delivery
        </span>
        <span className="bg-green-500 text-white rounded px-2 py-1">Rs 750</span>
      </div>
    </div>
  );
}

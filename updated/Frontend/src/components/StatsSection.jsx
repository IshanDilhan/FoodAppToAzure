import React from "react";

export default function StatsSection() {
  return (
    <section className="bg-orange-500 text-white py-8 mt-10">
      <div className="flex flex-col sm:flex-row justify-around text-center max-w-screen-xl mx-auto px-4 sm:px-0 space-y-6 sm:space-y-0">
        <div>
          <div className="text-2xl font-bold">546+</div>
          <div className="text-sm">Registered Riders</div>
        </div>
        <div>
          <div className="text-2xl font-bold">789,900+</div>
          <div className="text-sm">Orders Delivered</div>
        </div>
        <div>
          <div className="text-2xl font-bold">690+</div>
          <div className="text-sm">Restaurants Partnered</div>
        </div>
        <div>
          <div className="text-2xl font-bold">17,457+</div>
          <div className="text-sm">Food Items</div>
        </div>
      </div>
    </section>
  );
}

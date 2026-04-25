import React from "react";

export default function HeroSection() {
  return (
    <div className="flex flex-col md:flex-row items-stretch rounded-lg mt-6 mx-4 overflow-hidden">
      {/* Left Content */}
      <div className="md:w-1/2 bg-black flex flex-col justify-center px-6 sm:px-8 py-8 sm:py-12">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-white leading-snug">
          Feast Your Senses,<br />
          <span className="text-orange-500">Fast and Fresh</span>
        </h1>
        <p className="mb-6 text-gray-400 text-sm sm:text-base">
          Order restaurant food, takeaway and groceries.
        </p>
        <div className="flex flex-col sm:flex-row items-center sm:space-x-2 space-y-2 sm:space-y-0">
          <input
            type="text"
            className="border rounded-l px-4 py-2 w-full sm:w-60 text-white bg-black placeholder-white focus:outline-none"
            placeholder="Eg. EC1A 1BB"
          />
          <button className="bg-orange-500 text-white px-6 py-2 rounded-r w-full sm:w-auto">
            Search
          </button>
        </div>
      </div>

      {/* Right Content / Images */}
      <div className="md:w-1/2 bg-orange-500 flex items-center justify-center relative px-4 py-8">
        {/* Wrapper div to control stacking on small screens */}
        <div className="relative flex justify-center w-full h-full max-w-md md:max-w-none md:h-auto">
          <img
            src="/images/hero2.png"
            alt="Hero"
            className="h-40 sm:h-52 md:h-64 object-contain z-20 relative"
            style={{ left: '20px' }}
          />
          <img
            src="/images/hero1.png"
            alt="Hero"
            className="h-40 sm:h-52 md:h-64 object-contain z-30 relative"
            style={{ left: '-40px' }}
          />
          <img
            src="/images/h1.png"
            alt="Hero"
            className="h-16 sm:h-20 object-contain absolute bottom-4 right-8 z-10"
          />
        </div>
      </div>
    </div>
  );
}

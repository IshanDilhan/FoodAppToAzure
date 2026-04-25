import React from "react";

export default function FAQSection() {
  return (
    <section className="px-4 sm:px-8 mt-10 max-w-screen-xl mx-auto">
      <div className="bg-white rounded-lg shadow p-6 sm:p-8">
        <h2 className="text-xl font-bold mb-4 text-center sm:text-left">
          Know more about us!
        </h2>

        {/* Navigation buttons */}
        <div className="flex flex-col sm:flex-row justify-center sm:justify-start space-y-3 sm:space-y-0 sm:space-x-8 mb-6">
          <button className="text-orange-500 border-b-2 border-orange-500 pb-2 text-center sm:text-left">
            Frequent Questions
          </button>
          <button className="text-gray-500 text-center sm:text-left">Who are we</button>
          <button className="text-gray-500 text-center sm:text-left">Partner Program</button>
          <button className="text-gray-500 text-center sm:text-left">Help & Support</button>
        </div>

        {/* FAQ items grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[{
            img: "/images/how-it-works.png",
            alt: "How it works",
            title: "How does Order.uk work?",
            desc: "Place your order, track progress, and get your food delivered fast!"
          },{
            img: "/images/order.png",
            alt: "Order",
            title: "Place an Order!",
            desc: "Choose your favorite food and place an order in seconds."
          },{
            img: "/images/track.png",
            alt: "Track",
            title: "Track Progress",
            desc: "Track your order in real-time from kitchen to your door."
          }].map(({ img, alt, title, desc }, idx) => (
            <div className="flex flex-col items-center text-center" key={idx}>
              <span className="bg-orange-100 rounded-full p-4 mb-2">
                <img src={img} alt={alt} className="h-8" />
              </span>
              <h4 className="font-semibold mb-1">{title}</h4>
              <p className="text-xs text-gray-600">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

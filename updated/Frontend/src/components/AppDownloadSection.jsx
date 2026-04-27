import React from "react";

export default function AppDownloadSection() {
  return (
    <section className="px-8 mt-10">
      <div className="bg-white rounded-lg flex flex-col md:flex-row items-center p-8 shadow">
        <img src="/images/couple-ordering.png" alt="Ordering" className="h-32 md:h-40 object-contain mr-8" />
        <div>
          <h2 className="text-2xl font-bold">
            Ordering is more <span className="text-orange-500">Personalised</span> & Instant
          </h2>
          <p className="mt-2 mb-4 text-gray-600">Download the Order.uk app for faster ordering</p>
          <div className="flex space-x-4">
            <img src="/images/appstore.png" alt="App Store" className="h-10" />
            <img src="/images/googleplay.png" alt="Google Play" className="h-10" />
          </div>
        </div>
      </div>
    </section>
  );
}

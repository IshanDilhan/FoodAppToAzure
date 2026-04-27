import React, { useState } from "react";
import AuthModal from "./AuthModal";
import { useNavigate, Link } from "react-router-dom";

export default function PartnerRiderSection() {
  const [showAuth, setShowAuth] = useState(false);
  
  return (
    <section className="px-8 mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white rounded-lg shadow p-6 flex flex-col items-start">
        <img src="/images/partner.png" alt="Partner" className="h-full w-full mb-4" />
        <h3 className="font-bold text-lg mb-2">Partner with us</h3>
        <p className="text-gray-600 mb-4">Earn more with lower fees</p>
        <button
          className="bg-orange-500 text-white px-4 py-2 rounded"
          onClick={() => setShowAuth(true)}
        >
          Get Started
        </button>
      </div>
      <div className="bg-white rounded-lg shadow p-6 flex flex-col items-start">
        <img src="/images/rider.png" alt="Rider" className="h-full w-full mb-4" />
        <h3 className="font-bold text-lg mb-2">Ride with us</h3>
        <p className="text-gray-600 mb-4">Avail exclusive perks</p>
        <Link to="/riderverify" >
        <button className="bg-orange-500 text-white px-4 py-2 rounded"
        >
          Get Started
        </button>
        </Link>
      </div>
      {showAuth && (
        <AuthModal open={showAuth} onClose={() => setShowAuth(false)} />
      )}
    </section>
  );
}
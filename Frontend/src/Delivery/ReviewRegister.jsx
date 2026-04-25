import React from "react";
import {Link} from "react-router-dom";
export default function RegistrationPending() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
     
      {/* Main Card */}
      <div className="w-full max-w-lg bg-white rounded-xl shadow-lg mt-10 px-8 py-12 flex flex-col items-center">
        <h1 className="text-2xl font-extrabold text-gray-900 mb-2 text-center">
          Thank you for registering!
        </h1>
        <p className="text-gray-700 text-center mb-6">
          Your registration has been received and is under review.<br />
          We’ll notify you by email once your account is verified and approved.
        </p>

        <div className="flex flex-col items-center mb-8">
          <svg className="w-24 h-24 mb-4 text-green-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 48 48">
            <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="4" fill="#F0FFF4" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 24l6 6 10-10" stroke="#22C55E" strokeWidth="4" />
          </svg>
          <span className="text-lg font-semibold text-green-700">Registration Submitted</span>
        </div>

        <div className="w-full max-w-md">
          <div className="bg-gray-50 border border-gray-200 rounded-lg px-6 py-5 mb-4 text-gray-700 text-sm">
            <ul className="list-disc pl-5">
              <li>Our team will review your information shortly.</li>
              <li>You’ll receive a confirmation email when your account is approved.</li>
              <li>If you have questions, contact support or click <span className="underline cursor-pointer text-blue-600">Help</span> above.</li>
            </ul>
          </div>
        </div>

        <div className="w-full mt-6">
        <Link to="/">
          <button className="w-full bg-black text-white font-semibold py-3 rounded-lg text-lg shadow hover:bg-gray-900 transition">
            Waiting for Review...
          </button>
        </Link>
      </div>
      </div>
    </div>
  );
}

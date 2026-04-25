import React from "react";

export default function Footer() {
  return (
    <footer className="bg-white py-10 px-6 sm:px-8 mt-10 border-t">
      {/* Top container: logo + appstore + links + newsletter */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 space-y-8 md:space-y-0">
        {/* Logo and app store badges */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 md:mr-8 w-full md:w-auto">
          <img src="/images/isalndlogo.png" alt="Order.uk" className="h-8" />
          <div className="flex space-x-4">
            <img src="/images/appstore.png" alt="App Store" className="h-8" />
            <img src="/images/googleplay.png" alt="Google Play" className="h-8" />
          </div>
        </div>

        {/* Links sections */}
        <div className="flex flex-col sm:flex-row space-y-8 sm:space-y-0 sm:space-x-12 w-full md:w-auto text-sm text-center sm:text-left">
          {/* Legal Pages */}
          <div>
            <h3 className="font-bold mb-2">Legal Pages</h3>
            <a href="#" className="block text-gray-600 hover:text-orange-500 mb-1">
              Privacy Policy
            </a>
            <a href="#" className="block text-gray-600 hover:text-orange-500">
              Terms
            </a>
          </div>

          {/* Important Links */}
          <div>
            <h3 className="font-bold mb-2">Important Links</h3>
            <a href="#" className="block text-gray-600 hover:text-orange-500 mb-1">
              Restaurants
            </a>
            <a href="#" className="block text-gray-600 hover:text-orange-500">
              Partner Program
            </a>
          </div>

          {/* Newsletter Subscription */}
          <div>
            <h3 className="font-bold mb-2">Get Exclusive Deals in your inbox</h3>
            <form className="flex flex-col sm:flex-row mt-2 w-full max-w-xs sm:max-w-full">
              <input
                type="email"
                className="border rounded-l sm:rounded-l px-3 py-2 w-full sm:flex-1 mb-2 sm:mb-0 focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Your email"
                aria-label="Email address"
              />
              <button
                type="submit"
                className="bg-orange-500 text-white px-5 py-2 rounded sm:rounded-l-none w-full sm:w-auto hover:bg-orange-600 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom container: copyright and social links */}
      <div className="flex flex-col sm:flex-row justify-between items-center text-xs text-gray-400 border-t pt-6 space-y-4 sm:space-y-0">
        <span>islandRasa.lk © Copyright 2025. All Rights Reserved.</span>
        <div className="flex space-x-6 text-xl">
          <a href="#" aria-label="Facebook" className="hover:text-orange-500">
            <i className="fab fa-facebook"></i>
          </a>
          <a href="#" aria-label="Twitter" className="hover:text-orange-500">
            <i className="fab fa-twitter"></i>
          </a>
          <a href="#" aria-label="Instagram" className="hover:text-orange-500">
            <i className="fab fa-instagram"></i>
          </a>
          <a href="#" aria-label="YouTube" className="hover:text-orange-500">
            <i className="fab fa-youtube"></i>
          </a>
        </div>
      </div>
    </footer>
  );
}

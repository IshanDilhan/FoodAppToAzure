import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaGooglePlusG,
} from "react-icons/fa";
import axios from "axios";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

const miniChartData = (color, fillColor) => ({
  labels: ["", "", "", "", "", "", ""],
  datasets: [
    {
      data: [9, 8, 10, 8, 12, 11, 9],
      borderColor: color,
      backgroundColor: fillColor,
      tension: 0.4,
      pointRadius: 0,
      fill: true,
    },
  ],
});
const miniChartOptions = {
  plugins: { legend: { display: false }, tooltip: { enabled: false } },
  scales: { x: { display: false }, y: { display: false } },
  elements: { line: { borderWidth: 2 } },
};

const trafficChartData = {
  labels: [
    "M", "T", "W", "T", "F", "S", "S",
    "M", "T", "W", "T", "F", "S", "S"
  ],
  datasets: [
    {
      label: "Visits",
      data: [120, 100, 140, 180, 160, 200, 220, 170, 150, 190, 210, 230, 240, 200],
      borderColor: "#39f",
      backgroundColor: "rgba(51,153,255,0.1)",
      tension: 0.4,
      fill: true,
      pointRadius: 0,
    },
    {
      label: "Unique",
      data: [80, 60, 100, 120, 110, 140, 160, 120, 100, 130, 150, 180, 170, 140],
      borderColor: "#f9b115",
      backgroundColor: "rgba(249,177,21,0.08)",
      tension: 0.4,
      fill: true,
      pointRadius: 0,
    },
  ],
};

const trafficChartOptions = {
  responsive: true,
  plugins: {
    legend: { display: false },
    tooltip: { mode: "index", intersect: false },
  },
  scales: {
    x: { grid: { display: false } },
    y: { grid: { color: "#f3f4f6" }, min: 0, max: 250, ticks: { stepSize: 50 } },
  },
};

export default function DashboardHome({ token }) {
  const [restaurantCount, setRestaurantCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [riderCount, setRiderCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Set your API URLs here
  const RESTAURANT_API_URL = import.meta.env.VITE_RESTAURANT_API_URL;
  const USER_API_URL = import.meta.env.VITE_USER_API_URL;
  const REVIEW_API_URL = import.meta.env.VITE_REVIEW_API_URL;
  const RIDER_API_URL = import.meta.env.VITE_DELIVER_API_URL;

  useEffect(() => {
    setLoading(true);
    // Fetch restaurants
    const fetchRestaurants = axios.get(`${RESTAURANT_API_URL}/restaurants/all`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    // Fetch users
    const fetchUsers = axios.get(`${USER_API_URL}/auth/all`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    // Fetch reviews
    const fetchReviews = axios.get(`${REVIEW_API_URL}/all`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    // Fetch riders
    const fetchRiders = axios.get(`${RIDER_API_URL}/admin/riders`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    Promise.all([fetchRestaurants, fetchUsers, fetchReviews, fetchRiders])
      .then(([restRes, userRes, reviewRes, riderRes]) => {
        setRestaurantCount(restRes.data.data?.length || 0);
        setUserCount(Array.isArray(userRes.data) ? userRes.data.length : userRes.data.users?.length || 0);
        setReviewCount(reviewRes.data.data?.length || 0);
        setRiderCount(riderRes.data.riders?.length || 0);
      })
      .catch(() => {
        setRestaurantCount(0);
        setUserCount(0);
        setReviewCount(0);
        setRiderCount(0);
      })
      .finally(() => setLoading(false));
  }, [token]);

  // Transparent PNGs for each card (free to use)
  const images = [
    // Restaurant
    "https://cdn-icons-png.flaticon.com/512/3075/3075977.png", // [2][6]
    // Users
    "https://img.icons8.com/fluency/96/000000/user-group-man-man.png", // [3]
    // Reviews
    "https://www.freeiconspng.com/uploads/review-icon-png-5.png", // [4]
    // Riders
    "https://static.vecteezy.com/system/resources/previews/021/495/860/original/delivery-man-courier-riding-motorcycle-with-delivery-box-food-delivery-service-concept-png.png", // [5]
  ];

  const stats = [
    {
      label: "All Partner Restaurants",
      value: restaurantCount,
      image: images[0],
      color: "bg-blue-500",
      chartColor: "#fff",
      fillColor: "rgba(255,255,255,0.1)",
    },
    {
      label: "All Active Users",
      value: userCount,
      image: images[1],
      color: "bg-cyan-500",
      chartColor: "#fff",
      fillColor: "rgba(255,255,255,0.1)",
    },
    {
      label: "All Reviews",
      value: reviewCount,
      image: images[2],
      color: "bg-yellow-400",
      chartColor: "#fff",
      fillColor: "rgba(255,255,255,0.1)",
    },
    {
      label: "All Partnered Riders",
      value: riderCount,
      image: images[3],
      color: "bg-red-400",
      chartColor: "#fff",
      fillColor: "rgba(255,255,255,0.1)",
    },
  ];

  return (
    <div>
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className={`${stat.color} rounded-xl shadow p-5 flex flex-col`}
          >
            <div className="flex items-center justify-between h-24">
              <div className="flex-shrink-0">
                <img
                  src={stat.image}
                  alt={stat.label}
                  className="w-16 h-16 object-contain drop-shadow-lg bg-white bg-opacity-20 rounded-full"
                  style={{ background: "rgba(255,255,255,0.10)" }}
                />
              </div>
              <div className="flex-1 ml-4 flex flex-col h-full justify-between">
                <div className="text-white text-2xl font-bold flex items-center gap-2">
                  {loading ? <span className="animate-pulse">...</span> : stat.value}
                </div>
                <div className="text-white/80 text-sm mb-2">{stat.label}</div>
                <div className="w-20 h-6">
                  <Line
                    data={miniChartData(stat.chartColor, stat.fillColor)}
                    options={miniChartOptions}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Traffic Chart */}
      <div className="bg-white rounded-xl shadow p-8 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-700">Traffic</h2>
          <div className="flex gap-2">
            <button className="px-3 py-1 rounded bg-gray-100 text-gray-600 font-semibold">Day</button>
            <button className="px-3 py-1 rounded bg-gray-200 text-gray-800 font-bold">Month</button>
            <button className="px-3 py-1 rounded bg-gray-100 text-gray-600 font-semibold">Year</button>
          </div>
        </div>
        <Line data={trafficChartData} options={trafficChartOptions} height={110} />
        <div className="flex justify-between mt-6 text-center">
          <div>
            <div className="text-green-700 font-bold">29,703</div>
            <div className="text-xs text-gray-500">Visits</div>
          </div>
          <div>
            <div className="text-blue-700 font-bold">24,093</div>
            <div className="text-xs text-gray-500">Unique</div>
          </div>
          <div>
            <div className="text-pink-700 font-bold">78,706</div>
            <div className="text-xs text-gray-500">Pageviews</div>
          </div>
          <div>
            <div className="text-orange-700 font-bold">22,123</div>
            <div className="text-xs text-gray-500">New Users</div>
          </div>
          <div>
            <div className="text-indigo-700 font-bold">40.15%</div>
            <div className="text-xs text-gray-500">Bounce Rate</div>
          </div>
        </div>
      </div>

      {/* Social Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-blue-900 rounded-lg h-24 flex items-center justify-center text-white text-2xl font-bold gap-2">
          <FaFacebookF className="w-8 h-8" /> Facebook
        </div>
        <div className="bg-blue-500 rounded-lg h-24 flex items-center justify-center text-white text-2xl font-bold gap-2">
          <FaTwitter className="w-8 h-8" /> Twitter
        </div>
        <div className="bg-blue-700 rounded-lg h-24 flex items-center justify-center text-white text-2xl font-bold gap-2">
          <FaLinkedinIn className="w-8 h-8" /> LinkedIn
        </div>
        <div className="bg-red-600 rounded-lg h-24 flex items-center justify-center text-white text-2xl font-bold gap-2">
          <FaGooglePlusG className="w-8 h-8" /> Google+
        </div>
      </div>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaCheckCircle } from "react-icons/fa";

const AdminDashboard = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const fetchRestaurants = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/restaurant/all"); // Admin protected route
      setRestaurants(res.data.data.filter((r) => !r.isApproved));
    } catch (error) {
      console.error("Failed to fetch restaurants:", error);
    }
  };

  const handleApprove = async (restaurantId) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("adminToken"); // set your auth logic
      await axios.put(`http://localhost:4000/api/admin/approve/${restaurantId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("Restaurant approved and email sent!");
      fetchRestaurants(); // refresh list
    } catch (error) {
      console.error("Approval failed:", error);
      setMessage("Approval failed.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-center">Admin Dashboard</h1>

      {message && (
        <div className="bg-green-100 text-green-700 px-4 py-2 rounded mb-4 text-center">
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {restaurants.map((restaurant) => (
          <div key={restaurant._id} className="bg-white shadow-lg rounded-xl p-4 relative">
            <img src={restaurant.coverImage} alt="Cover" className="rounded-xl h-40 w-full object-cover mb-3" />
            <div className="flex items-center space-x-3">
              <img src={restaurant.logo} alt="Logo" className="h-14 w-14 rounded-full object-cover border" />
              <div>
                <h2 className="text-lg font-semibold">{restaurant.name}</h2>
                <p className="text-sm text-gray-500">{restaurant.email}</p>
                <p className="text-sm text-gray-600">{restaurant.contactNumber}</p>
              </div>
            </div>
            <p className="mt-2 text-sm text-gray-700"><strong>Address:</strong> {restaurant.address}</p>
            <p className="text-sm text-gray-700"><strong>Available Time:</strong> {restaurant.availableTime}</p>

            <button
              onClick={() => handleApprove(restaurant._id)}
              disabled={loading}
              className="absolute top-4 right-4 text-green-500 hover:text-green-700 transition duration-200"
              title="Approve"
            >
              <FaCheckCircle size={26} />
            </button>
          </div>
        ))}
      </div>

      {!restaurants.length && (
        <p className="text-center text-gray-500 mt-10">No restaurants pending approval.</p>
      )}
    </div>
  );
};

export default AdminDashboard;

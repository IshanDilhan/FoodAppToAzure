import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RiderLocationForm = () => {
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_DELIVER_API_URL;

  // Fetch location on mount
  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const res = await axios.get(`${API_URL}/rider/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data && res.data.rider && res.data.rider.location) {
          setLocation(res.data.rider.location);
        }
      } catch (err) {
        // Optional: handle error
      }
    };
    fetchLocation();
  }, [API_URL]);

  useEffect(() => {
    if (status.includes('success')) {
      const timer = setTimeout(() => {
        navigate('/rider/vehicle');
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [status, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus('');
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.post(
        `${API_URL}/rider/location`,
        { location },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      if (response.data.success) {
        setStatus('Location added successfully! Redirecting...');
      } else {
        setStatus(response.data.message || 'Failed to add location.');
      }
    } catch (err) {
      setStatus(err.response?.data?.message || 'Server error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-white">
      <div className="bg-white/90 backdrop-blur-lg rounded-xl p-8 w-full max-w-md shadow-xl border border-orange-100">
        <h2 className="text-2xl font-bold mb-6 text-center">Add Your Location</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <input
              type="text"
              required
              placeholder="Enter your address or area"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black hover:bg-gray-800 text-white font-semibold py-3 rounded-lg transition"
          >
            {loading ? 'Saving...' : 'Save Location'}
          </button>
          {status && (
            <p
              className={`mt-4 text-center text-sm font-medium ${
                status.includes('success') ? 'text-green-600' : 'text-red-500'
              }`}
            >
              {status}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default RiderLocationForm;

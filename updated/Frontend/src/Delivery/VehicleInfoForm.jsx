import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Example time slot options
const TIME_SLOTS = [
  "06:00-09:00",
  "09:00-12:00",
  "12:00-15:00",
  "15:00-18:00",
  "18:00-21:00",
  "21:00-00:00"
];

const WorkTypeForm = () => {
  const [workType, setWorkType] = useState("");
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_DELIVER_API_URL;

  const handleWorkTypeChange = (e) => {
    setWorkType(e.target.value);
    setError("");
    if (e.target.value === "FULL_TIME") {
      setAvailableTimeSlots([]);
    }
  };

  const handleSlotChange = (e) => {
    const { value, checked } = e.target;
    setAvailableTimeSlots((prev) =>
      checked
        ? [...prev, value]
        : prev.filter((slot) => slot !== value)
    );
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!workType) {
      setError("Please select a work type.");
      return;
    }
    if (workType === "PART_TIME" && availableTimeSlots.length === 0) {
      setError("Please select at least one available time slot.");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const payload = { workType };
      if (workType === "PART_TIME") payload.availableTimeSlots = availableTimeSlots;

      const res = await axios.post(
        `${API_URL}/rider/select-work-type`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      if (res.data.success) {
        navigate("/rider/profile-photo");
      } else {
        setError(res.data.message || "Failed to update work type.");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Server error. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-white">
      <div className="bg-white/90 backdrop-blur-lg rounded-xl p-8 w-full max-w-md shadow-xl border border-orange-100">
        <h2 className="text-2xl font-bold mb-6 text-center">Select Work Type</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-2 font-medium">Work Type *</label>
            <select
              value={workType}
              onChange={handleWorkTypeChange}
              className="w-full p-2 border rounded-md"
              required
            >
              <option value="">Select work type</option>
              <option value="FULL_TIME">Full Time (Available 24/7)</option>
              <option value="PART_TIME">Part Time (Select time slots)</option>
            </select>
          </div>

          {workType === "PART_TIME" && (
            <div>
              <label className="block mb-2 font-medium">
                Available Time Slots *
              </label>
              <div className="flex flex-col gap-2">
                {TIME_SLOTS.map((slot) => (
                  <label key={slot} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      value={slot}
                      checked={availableTimeSlots.includes(slot)}
                      onChange={handleSlotChange}
                    />
                    {slot}
                  </label>
                ))}
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black hover:bg-gray-800 text-white font-semibold py-3 rounded-lg transition"
          >
            {loading ? "Saving..." : "Continue"}
          </button>
          {error && (
            <p className="text-red-500 text-sm mt-4 text-center">{error}</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default WorkTypeForm;

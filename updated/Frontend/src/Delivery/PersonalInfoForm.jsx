import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const PersonalInfoForm = () => {
  const [form, setForm] = useState({
    name: "",
    age: "",
    address: "",
    phoneNumber: "",
    nationalIdNumber: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_DELIVER_API_URL;

  // Helper regex
  const phoneRegex = /^\d{10}$/;
  const nicNew = /^\d{12}$/;
  const nicOld = /^\d{9}[vV]$/;

  const validate = () => {
    if (!form.name || form.name.trim().length < 2)
      return "Valid name is required (minimum 2 characters).";
    const ageNum = Number(form.age);
    if (!ageNum || ageNum < 15 || ageNum > 60)
      return "Valid age is required (between 15 and 60).";
    if (!form.address || form.address.trim().length < 5)
      return "Valid address is required (minimum 5 characters).";
    if (!phoneRegex.test(form.phoneNumber))
      return "Valid 10-digit phone number is required.";
    if (
      form.nationalIdNumber &&
      !nicNew.test(form.nationalIdNumber) &&
      !nicOld.test(form.nationalIdNumber)
    )
      return "Invalid NIC format. Must be 12 digits or 9 digits followed by 'V'.";
    if (!form.emergencyContactName || form.emergencyContactName.trim().length < 2)
      return "Emergency contact name is required.";
    if (!phoneRegex.test(form.emergencyContactPhone))
      return "Valid 10-digit emergency contact number is required.";
    return "";
  };

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errMsg = validate();
    if (errMsg) {
      setError(errMsg);
      return;
    }
    setLoading(true);

    try {
      const token = localStorage.getItem("accessToken");
      const res = await axios.post(
        `${API_URL}/rider/add-personal-info`,
        {
          name: form.name,
          age: Number(form.age),
          address: form.address,
          phoneNumber: form.phoneNumber,
          nationalIdNumber: form.nationalIdNumber,
          emergencyContact: {
            name: form.emergencyContactName,
            phoneNumber: form.emergencyContactPhone,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (res.data.success) {
        navigate("/rider/review-info"); // or wherever your next step is
      } else {
        setError(res.data.message || "Failed to save info.");
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
        <h2 className="text-2xl font-bold mb-6 text-center">Personal Information</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name *"
            value={form.name}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            required
          />
          <input
            type="number"
            name="age"
            placeholder="Age *"
            value={form.age}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            required
          />
          <input
            type="text"
            name="address"
            placeholder="Address *"
            value={form.address}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            required
          />
          <input
            type="text"
            name="phoneNumber"
            placeholder="Phone Number *"
            value={form.phoneNumber}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            required
          />
          <input
            type="text"
            name="nationalIdNumber"
            placeholder="National ID Number (optional)"
            value={form.nationalIdNumber}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
          />
          <input
            type="text"
            name="emergencyContactName"
            placeholder="Emergency Contact Name *"
            value={form.emergencyContactName}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            required
          />
          <input
            type="text"
            name="emergencyContactPhone"
            placeholder="Emergency Contact Phone *"
            value={form.emergencyContactPhone}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black hover:bg-gray-800 text-white font-semibold py-3 rounded-lg transition"
          >
            {loading ? "Saving..." : "Save & Continue"}
          </button>
          {error && (
            <p className="text-red-500 text-sm mt-4 text-center">{error}</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default PersonalInfoForm;

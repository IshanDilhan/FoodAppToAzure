import React, { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import axios from "axios";

const USER_API_URL = import.meta.env.VITE_USER_API_URL;

export default function UserProfile() {
  const [activeTab, setActiveTab] = useState("edit-profile");
  const [user, setUser] = useState(null);
  const [fields, setFields] = useState({
    name: "",
    email: "",
    address: "",
    phone: ""
  });
  const [editField, setEditField] = useState("");
  const [message, setMessage] = useState("");
  const [profilePicFile, setProfilePicFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [errors, setErrors] = useState({});

  // Fetch profile from backend
  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${USER_API_URL}/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(res.data.user);
      setFields({
        name: res.data.user.name || "",
        email: res.data.user.email || "",
        address: res.data.user.address || "",
        phone: res.data.user.phone || ""
      });
      setPreview(
        res.data.user.profilePic
          ? `${res.data.user.profilePic}?t=${Date.now()}`
          : "/user-avatar.png"
      );
    } catch {
      setMessage("Failed to load profile.");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleEdit = (field) => setEditField(field);

  const handleFieldChange = (field, value) => {
    setFields((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" })); // Clear error on change
  };

  // Validation functions
  const validateField = (field, value) => {
    switch (field) {
      case "name":
        if (!/^[a-zA-Z\s]+$/.test(value)) {
          return "Name must contain only letters and spaces.";
        }
        break;
      case "email":
        if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(value)) {
          return "Email must be a valid @gmail.com address.";
        }
        break;
      case "phone":
        if (!/^\d{10}$/.test(value)) {
          return "Phone number must be exactly 10 digits.";
        }
        break;
      default:
        return "";
    }
    return "";
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Optional: check file type and size (e.g., max 1MB)
      if (!file.type.startsWith("image/")) {
        setMessage("Only image files are allowed.");
        return;
      }
      if (file.size > 1 * 1024 * 1024) {
        setMessage("File size must be less than 1MB.");
        return;
      }
      setProfilePicFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (field) => {
    // Validate before saving
    if (field !== "profilePic") {
      const errorMsg = validateField(field, fields[field]);
      if (errorMsg) {
        setErrors((prev) => ({ ...prev, [field]: errorMsg }));
        return;
      }
    }
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      if (field === "profilePic" && profilePicFile) {
        formData.append("profilePic", profilePicFile);
      } else {
        formData.append(field, fields[field]);
      }
      await axios.put(`${USER_API_URL}/auth/profile`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      });
      setEditField("");
      setMessage("Profile updated!");
      setProfilePicFile(null);
      fetchProfile();
    } catch {
      setMessage("Failed to update profile.");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center py-10">
      {/* Tabs */}
      <div className="flex w-full max-w-2xl mb-8 border-b border-gray-200">
        <button
          className={`flex-1 py-3 text-lg font-medium border-none bg-transparent ${
            activeTab === "dashboard" ? "bg-gray-100 border-b-2 border-black" : ""
          }`}
          onClick={() => setActiveTab("dashboard")}
        >
          Dashboard
        </button>
        <button
          className={`flex-1 py-3 text-lg font-medium border-none bg-transparent ${
            activeTab === "edit-profile" ? "bg-gray-100 border-b-2 border-black" : ""
          }`}
          onClick={() => setActiveTab("edit-profile")}
        >
          Edit Profile
        </button>
        <button
          className="flex-1 py-3 text-lg font-medium text-black border-none bg-transparent hover:bg-gray-100"
          onClick={handleLogout}
        >
          User Logout
        </button>
      </div>

      {/* Profile Card */}
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow p-8 flex flex-col items-center border border-gray-300">
        {/* Profile Picture and Name */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative">
            <img
              src={preview}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-gray-200 shadow"
              style={{ background: "#fff" }}
            />
            <label
              htmlFor="profilePicUpload"
              className="absolute bottom-2 right-2 bg-white border border-gray-300 rounded-full p-2 cursor-pointer hover:bg-black hover:text-white transition"
              title="Change profile picture"
              style={{ color: "#000" }}
            >
              <FaEdit size={16} />
              <input
                id="profilePicUpload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleProfilePicChange}
                onClick={(e) => e.stopPropagation()}
              />
            </label>
            {profilePicFile && (
              <button
                className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-black text-white px-4 py-1 rounded hover:bg-gray-800 text-sm"
                onClick={() => handleSave("profilePic")}
                type="button"
              >
                Save Photo
              </button>
            )}
          </div>
          <div className="text-2xl font-bold mt-4 text-black">{fields.name}</div>
          <div className="text-gray-500 text-md flex items-center gap-2">
            @{fields.name?.toLowerCase().replace(/\s+/g, "")}
          </div>
        </div>

        {/* Profile Fields */}
        <div className="w-full max-w-md mx-auto flex flex-col gap-6">
          <ProfileField
            label="Name"
            value={fields.name}
            edit={editField === "name"}
            onEdit={() => handleEdit("name")}
            onChange={(val) => handleFieldChange("name", val)}
            onSave={() => handleSave("name")}
            onCancel={() => setEditField("")}
            error={errors.name}
            type="text"
          />
          <ProfileField
            label="Email"
            value={fields.email}
            edit={editField === "email"}
            onEdit={() => handleEdit("email")}
            onChange={(val) => handleFieldChange("email", val)}
            onSave={() => handleSave("email")}
            onCancel={() => setEditField("")}
            error={errors.email}
            type="email"
          />
          <ProfileField
            label="Address"
            value={fields.address}
            edit={editField === "address"}
            onEdit={() => handleEdit("address")}
            onChange={(val) => handleFieldChange("address", val)}
            onSave={() => handleSave("address")}
            onCancel={() => setEditField("")}
            error={errors.address}
            type="text"
          />
          <ProfileField
            label="Phone"
            value={fields.phone}
            edit={editField === "phone"}
            onEdit={() => handleEdit("phone")}
            onChange={(val) => handleFieldChange("phone", val)}
            onSave={() => handleSave("phone")}
            onCancel={() => setEditField("")}
            error={errors.phone}
            type="tel"
          />
        </div>
        {message && (
          <div className={`mt-6 text-center ${message.includes("updated") ? "text-black" : "text-red-500"}`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
}

// Editable field component with error display
function ProfileField({ label, value, edit, onEdit, onChange, onSave, onCancel, error, type }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="font-semibold text-lg w-32 text-black">{label}</div>
      <div className="flex-1">
        {edit ? (
          <>
            <input
              type={type}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="border-b border-black focus:outline-none px-2 py-1 text-black w-full bg-transparent"
            />
            {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
          </>
        ) : (
          <span className="text-black">{value}</span>
        )}
      </div>
      <div className="flex items-center gap-2">
        {edit ? (
          <>
            <button
              className="text-black font-bold px-2"
              onClick={onSave}
              title="Save"
              type="button"
            >
              Save
            </button>
            <button
              className="text-gray-400 px-2"
              onClick={onCancel}
              title="Cancel"
              type="button"
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            className="text-black hover:text-gray-700"
            onClick={onEdit}
            title={`Edit ${label.toLowerCase()}`}
            type="button"
          >
            <FaEdit size={16} />
          </button>
        )}
      </div>
    </div>
  );
}

import React, { useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ProfilePictureUpload = () => {
  const [avatarURL, setAvatarURL] = useState(""); // Start empty
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileUploadRef = useRef();
  const API_URL = import.meta.env.VITE_DELIVER_API_URL;
  const navigate = useNavigate();

  const handleImageUpload = (e) => {
    e.preventDefault();
    setError("");
    fileUploadRef.current.click();
  };

  const handleFileChange = async () => {
    const file = fileUploadRef.current.files[0];
    if (!file) return;
    if (!["image/jpeg", "image/png"].includes(file.type)) {
      setError("Only JPG and PNG images are allowed.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be less than 5MB.");
      return;
    }

    setUploading(true);

    const formData = new FormData();
    formData.append("profilePicture", file);

    try {
      const token = localStorage.getItem("accessToken");
      const res = await axios.post(
        `${API_URL}/rider/upload-profile-picture`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (res.data.success) {
        setAvatarURL(res.data.rider.profilePictureUrl);
        // Navigate to /rider/personal-info after success
        setTimeout(() => {
          navigate("/rider/personal-info");
        }, 1000); // Short delay for user feedback
      } else {
        setError(res.data.message || "Failed to upload image.");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Server error. Please try again."
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="relative h-64 w-64 mx-auto my-8">
      <div className="relative">
        <img
          src={
            avatarURL ||
            "https://ui-avatars.com/api/?name=Upload+Photo&background=cccccc&color=ffffff&size=256"
          }
          alt="Avatar"
          className="h-64 w-64 rounded-full object-cover border"
        />
        <button
          type="button"
          onClick={handleImageUpload}
          className="absolute bottom-6 right-6 h-10 w-10 rounded-full bg-white shadow flex items-center justify-center border"
          title="Upload/Edit"
        >
          <svg
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              d="M15.232 5.232l3.536 3.536M9 13l6.293-6.293a1 1 0 011.414 0l1.586 1.586a1 1 0 010 1.414L12 17H9v-3z"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
      <form encType="multipart/form-data">
        <input
          type="file"
          ref={fileUploadRef}
          style={{ display: "none" }}
          accept="image/jpeg,image/png"
          onChange={handleFileChange}
        />
      </form>
      {error && (
        <div className="text-red-500 text-sm mt-2 text-center">{error}</div>
      )}
      {uploading && (
        <div className="text-center text-sm text-gray-500 mt-2">
          Uploading...
        </div>
      )}
    </div>
  );
};

export default ProfilePictureUpload;

import React, { useState, useRef, useEffect } from "react";
import {
  FaCheckCircle,
} from "react-icons/fa";

const STEPS = [
  { label: "Choose plan" },
  { label: "Set up shop" },
  { label: "Please wait for review" },
];

const PLANS = [
  {
    name: "Starter",
    price: "Free",
    features: [
      "List your restaurant",
      "Basic analytics",
      "Standard support",
    ],
  },
  {
    name: "Pro",
    price: "LKR 2,000/mo",
    features: [
      "Featured placement",
      "Advanced analytics",
      "Priority support",
      "Promo tools",
    ],
  },
  {
    name: "Premium",
    price: "LKR 5,000/mo",
    features: [
      "Top search placement",
      "Full analytics suite",
      "Dedicated account manager",
      "Unlimited promos",
    ],
  },
];

export default function AuthModal({ open, onClose }) {
  const [tab, setTab] = useState("register");
  const [step, setStep] = useState(0);
  const [selectedPlan, setSelectedPlan] = useState("Starter");
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    contactNumber: "",
    address: "",
    availableTime: "",
    password: "",
    logo: null,
    coverImage: null,
    plan: "Starter",
  });
  const [registerPreview, setRegisterPreview] = useState({
    logo: null,
    coverImage: null,
  });
  const [registerLoading, setRegisterLoading] = useState(false);
  const [registerError, setRegisterError] = useState("");
  const [registerSuccess, setRegisterSuccess] = useState("");
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [loginSuccess, setLoginSuccess] = useState("");
  const logoInputRef = useRef();
  const coverInputRef = useRef();

  const RESTAURANT_API_URL = import.meta.env.VITE_RESTAURANT_API_URL;

  // Timeline progress
  const renderTimeline = () => (
    <div className="flex items-center justify-center mb-8 px-2 overflow-x-auto no-scrollbar">
      {STEPS.map((s, i) => (
        <React.Fragment key={s.label}>
          <div className="flex flex-col items-center min-w-[60px]">
            <div
              className={`rounded-full w-9 h-9 flex items-center justify-center font-bold
                ${
                  step > i
                    ? "bg-black text-white"
                    : step === i
                    ? "bg-black text-white"
                    : "bg-gray-200 text-gray-400"
                }`}
            >
              {step > i ? <FaCheckCircle className="text-white" /> : i + 1}
            </div>
            <div className="text-xs mt-2 text-center w-max max-w-[80px] break-words">{s.label}</div>
          </div>
          {i < STEPS.length - 1 && (
            <div
              className={`flex-1 h-1 mx-2 min-w-[15px] ${
                step > i ? "bg-black" : "bg-gray-200"
              }`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  const handleTab = (t) => {
    setTab(t);
    setRegisterError("");
    setRegisterSuccess("");
    setLoginError("");
    setLoginSuccess("");
    setStep(0);
  };

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setRegisterData(prev => ({ ...prev, [name]: files[0] }));
      setRegisterPreview(prev => ({
        ...prev,
        [name]: URL.createObjectURL(files[0]),
      }));
    }
  };

  const handleDrop = (e, name) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setRegisterData(prev => ({ ...prev, [name]: file }));
      setRegisterPreview(prev => ({
        ...prev,
        [name]: URL.createObjectURL(file),
      }));
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setRegisterLoading(true);
    setRegisterError("");
    setRegisterSuccess("");
    const formData = new FormData();
    Object.entries(registerData).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });
    formData.set("plan", selectedPlan);
    try {
      const res = await fetch(`${RESTAURANT_API_URL}/restaurants/register`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Registration failed");
      setRegisterSuccess(data.message || "Registered successfully!");
      setStep(2);
      setTimeout(() => {
        window.location.href = "/restaurant/profile";
      }, 2000);
    } catch (err) {
      setRegisterError(err.message);
    } finally {
      setRegisterLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError("");
    setLoginSuccess("");
    try {
      const res = await fetch(`${RESTAURANT_API_URL}/restaurants/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Login failed");
      localStorage.setItem("restaurantToken", data.token);
      localStorage.setItem("restaurantId", data.restaurant.id);
      window.location.href = "/restaurant/profile";
    } catch (err) {
      setLoginError(err.message);
    } finally {
      setLoginLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-auto"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className={`relative bg-white rounded-2xl shadow-xl w-full max-w-full 
          ${tab === "login" ? "max-w-md" : "max-w-4xl"} mx-auto`}
        onClick={(e) => e.stopPropagation()}
        style={tab === "login" ? { maxWidth: 400 } : { maxWidth: 900 }}
      >
        {/* Header Tabs */}
        <div
          className={`flex items-center justify-between ${
            tab === "login" ? "px-6 py-5" : "px-8 py-5"
          } border-b`}
        >
          <div className="flex space-x-2">
            <button
              type="button"
              className={`px-5 py-2 rounded-t-lg font-semibold transition duration-300 ${
                tab === "register"
                  ? "bg-black text-white"
                  : "bg-transparent text-gray-500 hover:text-black"
              }`}
              onClick={() => handleTab("register")}
            >
              Register
            </button>
            <button
              type="button"
              className={`px-5 py-2 rounded-t-lg font-semibold transition duration-300 ${
                tab === "login"
                  ? "bg-black text-white"
                  : "bg-transparent text-gray-500 hover:text-black"
              }`}
              onClick={() => handleTab("login")}
            >
              Login
            </button>
          </div>

          <button
            type="button"
            className="text-gray-400 hover:text-gray-700 text-2xl focus:outline-none"
            onClick={onClose}
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        {/* Timeline */}
        {tab === "register" && renderTimeline()}

        {/* Register - Step 0 */}
        {tab === "register" && step === 0 && (
          <div className="px-6 sm:px-10 py-8 max-w-4xl mx-auto">
            <h3 className="text-center text-3xl font-bold mb-6">
              Choose your plan
            </h3>
            <p className="mb-4 text-gray-700 max-w-xl mx-auto text-center">
              Choose the plan that best fits your restaurant’s needs. All plans include secure payments and access to thousands of customers.
            </p>
            <p className="mb-8 font-semibold text-center max-w-xl mx-auto">
              How it works:
            </p>
            <ol className="list-decimal list-inside mb-8 max-w-xl mx-auto space-y-1 text-gray-600">
              <li>Pick a plan.</li>
              <li>Fill out your restaurant details.</li>
              <li>Upload your logo and cover image.</li>
              <li>Wait for admin approval.</li>
              <li>Start receiving orders!</li>
            </ol>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {PLANS.map((plan) => (
                <div
                  key={plan.name}
                  className={`border-2 rounded-lg p-5 cursor-pointer transition-all duration-200 flex flex-col justify-between
                    ${
                      selectedPlan === plan.name
                        ? "border-black shadow-lg bg-gray-50"
                        : "border-gray-200 bg-white"
                    }`}
                  onClick={() => {
                    setSelectedPlan(plan.name);
                    setRegisterData((prev) => ({ ...prev, plan: plan.name }));
                  }}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      setSelectedPlan(plan.name);
                      setRegisterData((prev) => ({ ...prev, plan: plan.name }));
                    }
                  }}
                  role="button"
                  aria-pressed={selectedPlan === plan.name}
                >
                  <div>
                    <h4 className="font-bold text-xl mb-2">{plan.name}</h4>
                    <div className="font-semibold text-black mb-2">{plan.price}</div>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {plan.features.map((feature) => (
                        <li key={feature}>• {feature}</li>
                      ))}
                    </ul>
                  </div>
                  {selectedPlan === plan.name && (
                    <div className="mt-4 text-xs text-green-600 font-bold">Selected</div>
                  )}
                </div>
              ))}
            </div>

            <button
              type="button"
              className="mt-8 w-full bg-black hover:bg-gray-900 text-white font-bold py-3 rounded-lg transition"
              onClick={() => setStep(1)}
            >
              Continue
            </button>
          </div>
        )}

        {/* Register - Step 1 */}
        {tab === "register" && step === 1 && (
          <form
            className="px-6 sm:px-10 py-8 max-w-4xl mx-auto space-y-6"
            onSubmit={handleRegister}
            encType="multipart/form-data"
            noValidate
          >
            <div className="mb-2 text-center text-black font-semibold">
              Plan: <span className="text-orange-600">{selectedPlan}</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { label: "Name", name: "name", type: "text", placeholder: "Restaurant Name" },
                { label: "Email", name: "email", type: "email", placeholder: "Email" },
                { label: "Contact Number", name: "contactNumber", type: "text", placeholder: "Contact Number" },
                { label: "Address", name: "address", type: "text", placeholder: "Address" },
                { label: "Available Time", name: "availableTime", type: "text", placeholder: "e.g. 10:00 AM - 10:00 PM" },
                { label: "Password", name: "password", type: "password", placeholder: "Password" },
              ].map(({ label, name, type, placeholder }) => (
                <div key={name}>
                  <label htmlFor={name} className="block text-sm font-medium mb-1">{label}</label>
                  <input
                    id={name}
                    name={name}
                    type={type}
                    placeholder={placeholder}
                    value={registerData[name]}
                    onChange={handleRegisterChange}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-black"
                    required
                  />
                </div>
              ))}
              {/* Logo Upload */}
              <div>
                <label className="block text-sm font-medium mb-1">Logo</label>
                <div
                  className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-black rounded-lg bg-gray-50 cursor-pointer hover:bg-gray-100 transition"
                  onClick={() => logoInputRef.current?.click()}
                  onDrop={(e) => handleDrop(e, "logo")}
                  onDragOver={(e) => e.preventDefault()}
                >
                  {registerPreview.logo ? (
                    <img
                      src={registerPreview.logo}
                      alt="Logo Preview"
                      className="h-16 w-16 object-contain mb-2"
                    />
                  ) : (
                    <>
                      <svg
                        className="w-8 h-8 text-black mb-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 16V4m0 0L3 8m4-4l4 4M21 16v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"
                        />
                      </svg>
                      <span className="text-xs text-black">Click or drag logo here</span>
                    </>
                  )}
                  <input
                    type="file"
                    name="logo"
                    accept="image/*"
                    className="hidden"
                    ref={logoInputRef}
                    onChange={handleFileChange}
                    required={!registerPreview.logo}
                  />
                </div>
              </div>
              {/* Cover Image Upload */}
              <div>
                <label className="block text-sm font-medium mb-1">Cover Image</label>
                <div
                  className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-black rounded-lg bg-gray-50 cursor-pointer hover:bg-gray-100 transition"
                  onClick={() => coverInputRef.current?.click()}
                  onDrop={(e) => handleDrop(e, "coverImage")}
                  onDragOver={(e) => e.preventDefault()}
                >
                  {registerPreview.coverImage ? (
                    <img
                      src={registerPreview.coverImage}
                      alt="Cover Preview"
                      className="h-16 w-28 object-cover mb-2"
                    />
                  ) : (
                    <>
                      <svg
                        className="w-8 h-8 text-black mb-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 16V4m0 0L3 8m4-4l4 4M21 16v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"
                        />
                      </svg>
                      <span className="text-xs text-black">Click or drag cover image here</span>
                    </>
                  )}
                  <input
                    type="file"
                    name="coverImage"
                    accept="image/*"
                    className="hidden"
                    ref={coverInputRef}
                    onChange={handleFileChange}
                    required={!registerPreview.coverImage}
                  />
                </div>
              </div>
            </div>
            {registerError && <div className="text-red-500 text-sm">{registerError}</div>}
            {registerSuccess && <div className="text-green-600 text-sm">{registerSuccess}</div>}

            <button
              type="submit"
              className={`w-full bg-black text-white py-3 rounded-lg font-bold hover:bg-gray-900 transition ${
                registerLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
              disabled={registerLoading}
            >
              {registerLoading ? "Registering..." : "Register"}
            </button>
            <div className="mt-4 text-center text-sm text-gray-500">
              Already have an account?{" "}
              <button
                type="button"
                className="text-black font-semibold hover:underline"
                onClick={() => handleTab("login")}
              >
                Login
              </button>
            </div>
          </form>
        )}

        {/* Step 3: Please wait */}
        {tab === "register" && step === 2 && (
          <div className="flex flex-col items-center justify-center px-8 py-16 text-center">
            <FaCheckCircle className="text-6xl text-green-500 mb-4" />
            <h3 className="text-2xl font-bold mb-2">Registration Complete!</h3>
            <p className="text-gray-600 max-w-md">
              Thank you for registering. Please wait for admin approval.
              <br />
              You will receive an email once your restaurant is approved.
            </p>
            <button
              className="mt-8 bg-black text-white px-8 py-3 rounded hover:bg-gray-900 transition focus:outline-none focus:ring-2 focus:ring-black"
              onClick={onClose}
              type="button"
            >
              Close
            </button>
          </div>
        )}

        {/* LOGIN Tab */}
        {tab === "login" && (
          <form
            className="px-6 sm:px-10 py-12 space-y-6 max-w-md mx-auto animate-slide-in"
            onSubmit={handleLogin}
            noValidate
          >
            <h2 className="text-center text-2xl font-bold mb-6">Restaurant Login</h2>
            <div>
              <label
                htmlFor="loginEmail"
                className="block text-sm font-medium mb-1"
              >
                Email
              </label>
              <input
                id="loginEmail"
                type="email"
                name="email"
                placeholder="Email"
                value={loginData.email}
                onChange={(e) => setLoginData((prev) => ({ ...prev, email: e.target.value }))}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-black"
                required
              />
            </div>
            <div>
              <label
                htmlFor="loginPassword"
                className="block text-sm font-medium mb-1"
              >
                Password
              </label>
              <input
                id="loginPassword"
                type="password"
                name="password"
                placeholder="Password"
                value={loginData.password}
                onChange={(e) => setLoginData((prev) => ({ ...prev, password: e.target.value }))}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-black"
                required
              />
            </div>
            {loginError && <p className="text-sm text-red-600">{loginError}</p>}
            {loginSuccess && <p className="text-sm text-green-600">{loginSuccess}</p>}
            <button
              type="submit"
              className={`w-full bg-black text-white py-3 rounded-lg font-bold hover:bg-gray-900 transition ${
                loginLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
              disabled={loginLoading}
            >
              {loginLoading ? "Logging in..." : "Login"}
            </button>
            <div className="mt-4 text-center text-sm text-gray-500">
              Don't have an account?{" "}
              <button
                type="button"
                className="text-black font-semibold hover:underline"
                onClick={() => handleTab("register")}
              >
                Register
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

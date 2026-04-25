// import React, { useState } from "react";
// import axios from "axios";

// export default function UserAuthModal({ open, onClose, onLogin }) {
//   const [step, setStep] = useState("register"); // or "verify"
//   const [form, setForm] = useState({ name: "", email: "", phone: "", otp: "" });
//   const [message, setMessage] = useState("");

//   const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

//   const handleRegister = async (e) => {
//     e.preventDefault();
//     setMessage("");
//     try {
//       await axios.post("http://localhost:5000/api/auth/register", form);
//       setStep("verify");
//       setMessage("OTP sent! Please check your email or phone.");
//     } catch (err) {
//       setMessage(err.response?.data?.message || "Error");
//     }
//   };

//   const handleVerify = async (e) => {
//     e.preventDefault();
//     setMessage("");
//     try {
//       const res = await axios.post("http://localhost:5000/api/auth/verify-otp", form);
//       localStorage.setItem("token", res.data.token);
//       onLogin(res.data.user);
//       onClose();
//     } catch (err) {
//       setMessage(err.response?.data?.message || "Error");
//     }
//   };

//   if (!open) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
//       <div className="bg-white rounded-lg p-8 w-96 shadow">
//         <button onClick={onClose} className="absolute top-4 right-4 text-gray-500">✕</button>
//         <h2 className="text-xl font-bold mb-4">{step === "register" ? "Sign Up / Login" : "Enter OTP"}</h2>
//         {step === "register" ? (
//           <form onSubmit={handleRegister} className="space-y-4">
//             <input name="name" placeholder="Name" value={form.name} onChange={handleChange} className="w-full border p-2 rounded" required />
//             <input name="email" placeholder="Email" value={form.email} onChange={handleChange} className="w-full border p-2 rounded" />
//             <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} className="w-full border p-2 rounded" />
//             <button type="submit" className="w-full bg-orange-500 text-white py-2 rounded">Send OTP</button>
//           </form>
//         ) : (
//           <form onSubmit={handleVerify} className="space-y-4">
//             <input name="otp" placeholder="OTP" value={form.otp} onChange={handleChange} className="w-full border p-2 rounded" required />
//             <button type="submit" className="w-full bg-green-500 text-white py-2 rounded">Verify</button>
//           </form>
//         )}
//         {message && <div className="mt-2 text-red-500">{message}</div>}
//       </div>
//     </div>
//   );
// }

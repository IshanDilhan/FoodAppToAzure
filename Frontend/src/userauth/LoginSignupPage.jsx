// import React, { useState } from "react";
// import axios from "axios";

// const API_URL = "http://localhost:5000/api/auth";

// export default function LoginSignupPage() {
//   const [input, setInput] = useState("");
//   const [name, setName] = useState("");
//   const [step, setStep] = useState(1); 
//   const [otp, setOtp] = useState("");
//   const [message, setMessage] = useState("");
//   const [loading, setLoading] = useState(false);

 
//   const handleContinue = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setMessage("");
//     try {
//       const isEmail = input.includes("@");
//       if (step === 1 && name) {
//         // Register
//         await axios.post(`${API_URL}/register`, isEmail ? { name, email: input } : { name, phone: input });
//       } else {
//         // Login
//         await axios.post(`${API_URL}/login`, isEmail ? { email: input } : { phone: input });
//       }
//       setStep(2);
//     } catch (err) {
//       setMessage(err.response?.data?.message || "Error sending OTP");
//     }
//     setLoading(false);
//   };

//   // OTP Verification
//   const handleVerify = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setMessage("");
//     try {
//       const isEmail = input.includes("@");
//       const res = await axios.post(`${API_URL}/verify-otp`, isEmail ? { email: input, otp } : { phone: input, otp });
//       localStorage.setItem("token", res.data.token);
//       localStorage.setItem("user", JSON.stringify(res.data.user));
//       window.location.href = "/";
//     } catch (err) {
//       setMessage(err.response?.data?.message || "Invalid OTP");
//     }
//     setLoading(false);
//   };

//   return (
//     <div className="min-h-screen bg-white flex flex-col">
//       <header className="w-full border-b py-6 px-6 flex items-center">
//         <span className="text-2xl font-bold tracking-tight">Island <span className="font-normal">Rasa</span></span>
//       </header>
//       <main className="flex-1 flex flex-col items-center justify-center">
//         <div className="w-full max-w-md mx-auto mt-10 bg-white rounded-lg shadow-none">
//           <form onSubmit={step === 2 ? handleVerify : handleContinue} className="flex flex-col gap-6">
//             <h2 className="text-2xl font-semibold text-center mt-8 mb-2">
//               {step === 1
//                 ? "What's your phone number or email?"
//                 : "Enter the OTP sent to your " + (input.includes("@") ? "email" : "phone")}
//             </h2>
//             {step === 1 ? (
//               <>
//                 <input
//                   type="text"
//                   className="w-full border border-gray-300 rounded-md px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-black"
//                   placeholder="Name"
//                   value={name}
//                   onChange={(e) => setName(e.target.value)}
//                   required
//                 />
//                 <input
//                   type="text"
//                   className="w-full border border-gray-300 rounded-md px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-black"
//                   placeholder="Enter phone number or email"
//                   value={input}
//                   onChange={(e) => setInput(e.target.value)}
//                   required
//                 />
//               </>
//             ) : (
//               <input
//                 type="text"
//                 className="w-full border border-gray-300 rounded-md px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-black"
//                 placeholder="Enter OTP"
//                 value={otp}
//                 onChange={(e) => setOtp(e.target.value)}
//                 required
//               />
//             )}
//             <button
//               type="submit"
//               className="w-full bg-black text-white py-3 rounded-md text-lg font-semibold hover:bg-gray-900 transition"
//               disabled={loading}
//             >
//               {loading ? "Please wait..." : step === 1 ? "Continue" : "Verify"}
//             </button>
//             {step === 1 && (
//               <>
//                 <div className="flex items-center gap-2">
//                   <hr className="flex-1 border-gray-300" />
//                   <span className="text-gray-400 text-sm">or</span>
//                   <hr className="flex-1 border-gray-300" />
//                 </div>
//                 <button
//                   type="button"
//                   className="w-full flex items-center justify-center gap-2 border border-gray-300 py-3 rounded-md text-lg font-semibold hover:bg-gray-100 transition"
//                 >
//                   <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google" className="w-5 h-5" />
//                   Continue with Google
//                 </button>
//                 <button
//                   type="button"
//                   className="w-full flex items-center justify-center gap-2 border border-gray-300 py-3 rounded-md text-lg font-semibold hover:bg-gray-100 transition"
//                 >
//                   <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" alt="Apple" className="w-5 h-5" />
//                   Continue with Apple
//                 </button>
//               </>
//             )}
//             <p className="text-xs text-gray-500 text-center mt-2 mb-8">
//               By proceeding, you consent to receiving calls, WhatsApp or SMS/RCS messages, including by automated means, from Island Rasa and its affiliates to the number provided.
//             </p>
//             {message && <div className="text-red-500 text-center">{message}</div>}
//           </form>
//         </div>
//       </main>
//     </div>
//   );
// }

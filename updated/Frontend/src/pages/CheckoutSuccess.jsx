import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { useCart } from "../context/CartContext";

const ORDER_API_URL = import.meta.env.VITE_ORDER_API_URL;

export default function CheckoutSuccess() {
  const [searchParams] = useSearchParams();
  const success = searchParams.get("success");
  const orderId = searchParams.get("orderId");
  const { clearCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const verify = async () => {
      try {
        await axios.post(
          `${ORDER_API_URL}/order/verify-stripe`,
          { orderId, success },
          { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );
        clearCart();
        setTimeout(() => navigate("/orders"), 2000);
      } catch (err) {
        setTimeout(() => navigate("/cart"), 2000);
      }
    };
    if (orderId) verify();
  }, [orderId, success, clearCart, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {success === "true" ? (
        <>
          <h1 className="text-2xl font-bold mb-4 text-green-600">Payment Successful!</h1>
          <p className="mb-4">Thank you for your order. Redirecting to your orders page...</p>
        </>
      ) : (
        <>
          <h1 className="text-2xl font-bold mb-4 text-red-600">Payment Failed or Cancelled</h1>
          <p className="mb-4">Redirecting to your cart...</p>
        </>
      )}
    </div>
  );
}

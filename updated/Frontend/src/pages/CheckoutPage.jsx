import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ORDER_API_URL = import.meta.env.VITE_ORDER_API_URL;

const DROPOFF_OPTIONS = [
  {
    group: "Delivery Instructions",
    options: [
      { key: "door", label: "Meet at my door" },
      { key: "outside", label: "Meet outside" },
      { key: "lobby", label: "Meet in the lobby" }
    ]
  }
];

const DELIVERY_OPTIONS = [
  {
    key: "priority",
    label: "Priority",
    desc: "35-55 min • Delivered directly to you",
    fee: 129,
    badge: "Faster"
  },
  {
    key: "standard",
    label: "Standard",
    desc: "40-60 min",
    fee: 109
  },
  {
    key: "schedule",
    label: "Schedule",
    desc: "Choose a time",
    fee: 109
  }
];

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const [address, setAddress] = useState("");
  const [dropoffOption, setDropoffOption] = useState("door");
  const [dropoffGroup, setDropoffGroup] = useState(DROPOFF_OPTIONS[0].group);
  const [instructions, setInstructions] = useState("");
  const [deliveryOption, setDeliveryOption] = useState("standard");
  const [deliveryType, setDeliveryType] = useState("delivery");
  const [deliverySchedule, setDeliverySchedule] = useState("");
  const [phone, setPhone] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [shippingFee, setShippingFee] = useState(109);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cod");

  const navigate = useNavigate();

  useEffect(() => {
    const found = DELIVERY_OPTIONS.find(opt => opt.key === deliveryOption);
    setShippingFee(found ? found.fee : 0);
  }, [deliveryOption]);

  // Group cart items by restaurant for summary display only
  const grouped = cart.items.reduce((acc, item) => {
    if (item.restaurant && item.restaurant._id) {
      const rid = item.restaurant._id;
      if (!acc[rid]) acc[rid] = { restaurant: item.restaurant, items: [] };
      acc[rid].items.push(item);
    }
    return acc;
  }, {});

  const calculateSubtotal = () =>
    cart.items.reduce((total, item) => {
      const sidesTotal = item.sides?.reduce((sum, side) => sum + side.price, 0) || 0;
      return total + (item.price + sidesTotal) * item.quantity;
    }, 0);

  const calculateTotal = () => calculateSubtotal() + shippingFee;

  const validateForm = () => {
    if (!address.trim()) return "Address is required";
    if (!phone.match(/^\+?[0-9]{10,15}$/)) return "Valid phone number required";
    if (!cart.items.length) return "Your cart is empty";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }
    setLoading(true);

    try {
      if (paymentMethod === "cod") {
        // Cash on Delivery
        const orderData = {
          address,
          phone,
          paymentMethod: "cod",
          deliveryType,
          instructions,
          shippingFee
        };
        await axios.post(
          `${ORDER_API_URL}/order/checkout`,
          orderData,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`
            }
          }
        );
        clearCart();
        navigate("/orders");
      } else if (paymentMethod === "stripe") {
        // Stripe payment
        const orderData = {
          address,
          phone,
          deliveryType,
          instructions,
          shippingFee
        };
        const res = await axios.post(
          `${ORDER_API_URL}/order/stripe/checkout`,
          orderData,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`
            }
          }
        );
        if (res.data.success && res.data.url) {
          clearCart(); // Clear local cart before redirect
          window.location.href = res.data.url;
        } else {
          setError("Failed to initiate Stripe payment.");
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || "Checkout failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8">
      <div className="max-w-6xl w-full flex flex-col md:flex-row gap-8">
        {/* LEFT: Delivery Details */}
        <div className="flex-1 bg-white rounded-xl shadow-lg p-8 flex flex-col">
          <h2 className="text-2xl font-bold mb-8">Delivery details</h2>
          <form onSubmit={handleSubmit} className="space-y-8 flex-1 flex flex-col justify-between">
            {/* Address */}
            <div>
              <label className="block text-base font-bold text-gray-700 mb-2">
                Delivery Address
              </label>
              <input
                type="text"
                required
                className="w-full p-4 border border-gray-300 rounded-xl bg-white text-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition placeholder-gray-400"
                value={address}
                onChange={e => setAddress(e.target.value)}
                placeholder="Enter your address"
                autoComplete="street-address"
              />
            </div>
            {/* Dropoff Instructions */}
            <div>
              <label className="block text-base font-bold text-gray-700 mb-1">
                Dropoff Instructions
              </label>
              <p className="text-sm text-gray-500 mb-3">
                Please select how you'd like your order delivered:
              </p>
              <div className="space-y-4">
                {DROPOFF_OPTIONS.map(group => (
                  <div key={group.group}>
                    <div className="text-sm font-semibold text-gray-600 mb-2">{group.group}</div>
                    <div className="space-y-2">
                      {group.options.map(opt => (
                        <label
                          key={opt.key}
                          className={`
                            flex items-center justify-between cursor-pointer rounded-xl px-5 py-4
                            border-2 ${dropoffOption === opt.key ? "border-black" : "border-gray-200"}
                            bg-white shadow-sm transition
                          `}
                        >
                          <span className="font-semibold text-gray-800">{opt.label}</span>
                          <input
                            type="radio"
                            name="dropoffOption"
                            value={opt.key}
                            checked={dropoffOption === opt.key}
                            onChange={() => {
                              setDropoffOption(opt.key);
                              setDropoffGroup(group.group);
                            }}
                            className="accent-black w-5 h-5"
                          />
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <textarea
                className="w-full mt-5 p-4 border border-gray-300 rounded-xl bg-white text-base focus:ring-2 focus:ring-black focus:border-black transition placeholder-gray-400 resize-none"
                rows={3}
                placeholder="Add extra instructions for your delivery (optional)"
                value={instructions}
                onChange={e => setInstructions(e.target.value)}
              />
            </div>
            {/* Delivery Options */}
            <div>
              <label className="block text-sm font-semibold mb-2">Delivery options</label>
              <div className="flex flex-col gap-2">
                {DELIVERY_OPTIONS.map(opt => (
                  <label
                    key={opt.key}
                    className={`flex items-center border rounded-lg p-4 cursor-pointer ${
                      deliveryOption === opt.key
                        ? "border-black bg-gray-50"
                        : "border-gray-200"
                    }`}
                  >
                    <input
                      type="radio"
                      name="deliveryOption"
                      value={opt.key}
                      checked={deliveryOption === opt.key}
                      onChange={() => setDeliveryOption(opt.key)}
                      className="mr-3 accent-black"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{opt.label}</span>
                        {opt.badge && (
                          <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded">
                            {opt.badge}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-600">{opt.desc}</div>
                    </div>
                    <div className="text-sm font-semibold">
                      +LKR {opt.fee.toLocaleString()}
                    </div>
                  </label>
                ))}
              </div>
            </div>
            {/* Delivery Type */}
            <div>
              <label className="block text-sm font-semibold mb-2">Delivery Type</label>
              <select
                required
                className="w-full p-3 border rounded-lg"
                value={deliveryType}
                onChange={e => setDeliveryType(e.target.value)}
              >
                <option value="delivery">Delivery</option>
                <option value="pickup">Pickup</option>
              </select>
            </div>
            {/* Schedule (only if "schedule" is selected) */}
            {deliveryOption === "schedule" && (
              <div>
                <label className="block text-sm font-semibold mb-2">Schedule a time</label>
                <input
                  type="datetime-local"
                  className="w-full p-3 border rounded-lg"
                  min={new Date().toISOString().slice(0, 16)}
                  value={deliverySchedule}
                  onChange={e => setDeliverySchedule(e.target.value)}
                />
              </div>
            )}
            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold mb-2">Phone Number</label>
              <input
                type="tel"
                required
                className="w-full p-3 border rounded-lg"
                pattern="^\+?[0-9]{10,15}$"
                value={phone}
                onChange={e => setPhone(e.target.value)}
              />
            </div>
            {/* Payment Method */}
            <div>
              <label className="block text-sm font-semibold mb-2">Payment Method</label>
              <select
                required
                className="w-full p-3 border rounded-lg"
                value={paymentMethod}
                onChange={e => setPaymentMethod(e.target.value)}
              >
                <option value="cod">Cash on Delivery</option>
                <option value="stripe">Credit/Debit Card (Stripe)</option>
              </select>
            </div>
            {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
            <button
              type="submit"
              disabled={loading || cart.items.length === 0}
              className="w-full mt-8 bg-black text-white font-bold text-lg py-4 rounded-xl transition disabled:opacity-50"
            >
              {loading ? "Processing..." : "Checkout"}
            </button>
          </form>
        </div>
        {/* RIGHT: Cart Summary and Order Total */}
        <div className="flex-1 bg-white rounded-xl shadow-lg p-8 h-fit flex flex-col">
          {Object.values(grouped).map(({ restaurant, items }) => (
            <div key={restaurant._id} className="mb-8">
              {/* Restaurant header */}
              <div className="flex items-center gap-3 mb-6">
                {restaurant.logo && (
                  <img
                    src={restaurant.logo}
                    alt={restaurant.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                )}
                <div>
                  <div className="font-semibold">{restaurant.name}</div>
                  <div className="text-xs text-gray-500">{restaurant.address}</div>
                </div>
              </div>
              {/* Cart summary */}
              <div className="mb-6">
                <div className="flex items-center gap-2 font-semibold text-base mb-2">
                  🛒 Cart summary ({items.length} item{items.length !== 1 && "s"})
                </div>
                {items.map((item, idx) => (
                  <div key={idx} className="flex items-center mb-3">
                    <img src={item.image} alt={item.name} className="w-12 h-12 rounded mr-3" />
                    <div className="flex-1">
                      <div className="font-medium">{item.name}</div>
                      {item.sides && item.sides.length > 0 && (
                        <div className="text-xs text-gray-500 mt-1">
                          <span className="font-semibold text-gray-700">Sides:</span>
                          <ul className="ml-4 list-disc">
                            {item.sides.map((side, i) => (
                              <li key={i}>
                                {side.name}
                                {side.price > 0 && (
                                  <span className="ml-1 text-gray-700">
                                    (+LKR {side.price})
                                  </span>
                                )}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                    <div className="text-xs text-gray-600">x{item.quantity}</div>
                    <div className="font-bold ml-2">
                      LKR {((item.price + (item.sides?.reduce((s, x) => s + (x.price || 0), 0) || 0)) * item.quantity).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {/* Promo code */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-1">Promotion</label>
            <input
              type="text"
              className="w-full p-3 border rounded-lg"
              placeholder="Add promo code"
              value={promoCode}
              onChange={e => setPromoCode(e.target.value)}
            />
          </div>
          {/* Order total */}
          <div className="bg-gray-100 rounded-2xl p-8 shadow-lg mb-6">
            <div className="mb-4 font-bold text-2xl tracking-tight text-gray-900 flex items-center gap-2">
              <svg className="w-7 h-7 text-yellow-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.35 2.7A2 2 0 0 0 7.48 19h9.04a2 2 0 0 0 1.83-1.3L21 13M7 13V6h13" /></svg>
              Order Total
            </div>
            <div className="flex justify-between items-center text-lg py-3 border-b">
              <span className="text-gray-700">Subtotal</span>
              <span className="font-semibold text-gray-900">LKR {calculateSubtotal().toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-lg py-3 border-b">
              <span className="text-gray-700">Delivery Fee</span>
              <span className="font-semibold text-gray-900">LKR {shippingFee.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center font-extrabold text-2xl py-4 border-t mt-4 text-green-700">
              <span>Total</span>
              <span>LKR {calculateTotal().toLocaleString()}</span>
            </div>
            <div className="text-sm text-gray-500 mt-4 leading-relaxed">
              If an item is unavailable, it will be removed from your order and you won’t be charged.<br />
              By placing your order, you agree to take full responsibility for it once it’s delivered.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

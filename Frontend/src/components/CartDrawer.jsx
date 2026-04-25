import React from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

export default function CartDrawer({ open, onClose }) {
  const { cart, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();

  // Group items by restaurant._id, only if restaurant and _id exist
  const grouped = cart.items.reduce((acc, item) => {
    if (item.restaurant && item.restaurant._id) {
      const rid = item.restaurant._id;
      if (!acc[rid]) acc[rid] = { restaurant: item.restaurant, items: [] };
      acc[rid].items.push(item);
    }
    return acc;
  }, {});

  const total = cart.items.reduce(
    (sum, item) =>
      sum +
      (parseFloat(item.price) +
        (item.sides?.reduce((s, x) => s + (parseFloat(x.price) || 0), 0) || 0)) *
        item.quantity,
    0
  );

  const handleCheckout = () => {
    navigate("/checkout");
    onClose();
  };

  if (!open) return null;

  return (
    <>
      {/* Background overlay */}
      <div className="fixed inset-0 z-50 bg-black/40 flex justify-end">
        {/* Drawer */}
        <div className="w-full max-w-md sm:max-w-md md:max-w-md bg-white h-full shadow-2xl flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <div className="text-lg font-bold text-[#1c2331]">Cart</div>
            <button
              className="text-2xl text-gray-400 hover:text-black focus:outline-none"
              onClick={onClose}
              aria-label="Close cart"
            >
              &times;
            </button>
          </div>

          {/* Cart items container */}
          <div
            className="flex-1 overflow-y-auto px-4 sm:px-6 py-4"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            {Object.values(grouped).length === 0 ? (
              <p className="text-gray-400 text-center mt-12">Cart is empty.</p>
            ) : (
              Object.values(grouped).map(({ restaurant, items }) => (
                <div key={restaurant._id} className="mb-8">
                  <div className="flex items-center gap-3 mb-3">
                    {restaurant.logo && (
                      <img
                        src={restaurant.logo}
                        alt={restaurant.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    )}
                    <span className="font-bold truncate">{restaurant.name}</span>
                  </div>
                  {items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex flex-wrap md:flex-nowrap items-center gap-3 border-b py-2"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 rounded object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-bold truncate">{item.name}</div>
                        {item.sides && item.sides.length > 0 && (
                          <div className="text-xs text-gray-500 truncate">
                            Sides: {item.sides.map(s => s.name).join(", ")}
                          </div>
                        )}
                      </div>

                      {/* Quantity controls */}
                      <div className="flex items-center gap-2 mt-2 md:mt-0 flex-shrink-0">
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.menu,
                              item.sides,
                              Math.max(1, item.quantity - 1),
                              item.restaurant
                            )
                          }
                          aria-label={`Decrease quantity of ${item.name}`}
                          className="w-8 h-8 bg-gray-200 rounded hover:bg-gray-300 focus:outline-none"
                          type="button"
                        >
                          -
                        </button>
                        <span className="w-6 text-center">{item.quantity}</span>
                        <button
                          onClick={() =>
                            updateQuantity(item.menu, item.sides, item.quantity + 1, item.restaurant)
                          }
                          aria-label={`Increase quantity of ${item.name}`}
                          className="w-8 h-8 bg-gray-200 rounded hover:bg-gray-300 focus:outline-none"
                          type="button"
                        >
                          +
                        </button>
                      </div>

                      {/* Remove button */}
                      <button
                        onClick={() => removeFromCart(item.menu, item.sides, item.restaurant)}
                        aria-label={`Remove ${item.name} from cart`}
                        className="text-sm text-red-600 hover:text-red-800 mt-2 md:mt-0 flex-shrink-0"
                        type="button"
                      >
                        Remove
                      </button>

                      {/* Price */}
                      <div className="font-bold ml-auto flex-shrink-0 mt-2 md:mt-0">
                        LKR{" "}
                        {(
                          (item.price +
                            (item.sides?.reduce((s, x) => s + (x.price || 0), 0) || 0)) *
                          item.quantity
                        ).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              ))
            )}
          </div>

          {/* Total and checkout button */}
          <div className="border-t p-6">
            <div className="flex justify-between items-center font-bold text-lg">
              <span>Total</span>
              <span>LKR {total.toLocaleString()}</span>
            </div>
            <button
              className="mt-4 w-full bg-[#FFD600] text-black font-bold py-3 rounded-lg text-lg hover:bg-[#ffce00] transition disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={cart.items.length === 0}
              onClick={handleCheckout}
              type="button"
            >
              Go to checkout
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

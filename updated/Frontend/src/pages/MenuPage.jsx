import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import CartDrawer from "../components/CartDrawer";
import axios from "axios";
import { ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";

// --- Menu Card ---
function MenuCard({ item, onAdd, onViewReviews }) {
  // Calculate stars
  const fullStars = Math.floor(item.averageRating || 0);
  const halfStar = (item.averageRating || 0) - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <div
      className="flex items-center bg-white rounded-2xl shadow-lg p-6 mx-auto transition-transform hover:-translate-y-1"
      style={{ width: 360, height: 180 }}
    >
      <div className="flex-1 min-w-0 pr-4">
        <div className="text-lg font-bold mb-1 text-[#1c2331]">{item.name}</div>
        <div className="text-gray-600 mb-3 text-sm leading-snug line-clamp-2">{item.description}</div>
        <div className="font-bold text-[#1c2331] text-base">
          රු {parseFloat(item.price).toFixed(2)}
        </div>
        {/* Show average rating and review count */}
        <div className="flex items-center text-xs text-gray-500 mb-1">
          {[...Array(fullStars)].map((_, i) => (
            <span key={`full-${i}`} className="text-yellow-400">★</span>
          ))}
          {halfStar && <span className="text-yellow-400">☆</span>}
          {[...Array(emptyStars)].map((_, i) => (
            <span key={`empty-${i}`} className="text-gray-300">★</span>
          ))}
          <span className="ml-2">
            {item.averageRating ? item.averageRating.toFixed(1) : "0.0"}
            <span className="ml-1 text-gray-400">
              ({item.totalReviews || 0} reviews)
            </span>
          </span>
        </div>
        <div className="flex gap-2 mt-2">
          <button
            type="button"
            onClick={() => onViewReviews(item._id)}
            aria-label={`Review for ${item.name}`}
            className="inline-flex items-center gap-1 bg-transparent font-medium rounded px-2 py-1 text-xs shadow hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 active:scale-95 transition"
          >
            <ChatBubbleLeftRightIcon className="w-4 h-4 text-blue-700" aria-hidden="true" />
            <span className="underline underline-offset-2 text-black">Review</span>
          </button>
        </div>
      </div>
      <div className="relative flex-shrink-0">
        <div className="w-28 h-28 rounded-xl bg-[#FFD600] flex items-center justify-center overflow-hidden relative">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
          />
          <button
            className="absolute bottom-2 right-2 bg-[#1c2331] rounded-full flex items-center justify-center w-10 h-10 border-4 border-white hover:scale-110 transition-transform shadow-lg"
            onClick={() => onAdd(item)}
            aria-label={`Add ${item.name} to cart`}
          >
            <span className="text-white text-2xl font-bold">+</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// --- Sides Modal and Loader (unchanged) ---
function SidesModal({ menu, open, onClose, onConfirm }) {
  const [selected, setSelected] = useState({});
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    setSelected({});
    setQuantity(1);
  }, [menu]);

  if (!open || !menu) return null;

  const sidesTotal =
    menu.sides?.reduce((sum, group) => {
      const idx = selected[group.title];
      if (typeof idx === "number" && group.options[idx]) {
        return sum + (parseFloat(group.options[idx].price) || 0);
      }
      return sum;
    }, 0) || 0;
  const total = (parseFloat(menu.price) + sidesTotal) * quantity;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-0 flex flex-col md:flex-row overflow-hidden">
        {/* Left: Image */}
        <div className="md:w-1/2 bg-gray-100 flex items-center justify-center p-6">
          <img
            src={menu.image}
            alt={menu.name}
            className="rounded-xl w-full h-64 object-cover shadow"
          />
        </div>
        {/* Right: Details */}
        <div className="md:w-1/2 p-6 flex flex-col">
          <button
            className="self-end text-2xl text-gray-400 hover:text-black mb-2"
            onClick={onClose}
          >
            &times;
          </button>
          <div className="font-bold text-xl mb-1">{menu.name}</div>
          <div className="text-gray-600 mb-4">{menu.description}</div>
          <div className="font-bold mb-3">Sides & Add-ons</div>
          <div className="flex-1 overflow-y-auto pr-2">
            {menu.sides?.map((sideGroup, idx) => (
              <div key={idx} className="mb-4">
                <div className="font-semibold mb-1">{sideGroup.title}</div>
                <div className="text-xs text-gray-500 mb-2">
                  {sideGroup.maxChoose
                    ? `Choose up to ${sideGroup.maxChoose}`
                    : "Optional"}
                </div>
                <div className="space-y-2">
                  {sideGroup.options.map((opt, i) => (
                    <label
                      key={i}
                      className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 rounded px-2 py-1"
                    >
                      <input
                        type="checkbox"
                        checked={selected[sideGroup.title] === i}
                        onChange={() =>
                          setSelected((s) => ({
                            ...s,
                            [sideGroup.title]: i,
                          }))
                        }
                        className="accent-[#FFD600] w-5 h-5"
                      />
                      <span className="flex-1">{opt.name}</span>
                      <span className="text-xs text-gray-500">{opt.label}</span>
                      <span className="ml-2 font-semibold text-[#23263a]">
                        {opt.price ? `+ LKR ${opt.price}` : ""}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
          {/* Quantity and Add to Cart */}
          <div className="flex items-center gap-4 mt-4">
            <div className="flex items-center border rounded-lg overflow-hidden">
              <button
                className="px-3 py-1 bg-gray-100 text-lg font-bold"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              >
                -
              </button>
              <span className="px-4">{quantity}</span>
              <button
                className="px-3 py-1 bg-gray-100 text-lg font-bold"
                onClick={() => setQuantity((q) => q + 1)}
              >
                +
              </button>
            </div>
            <button
              className="flex-1 bg-[#FFD600] text-black font-bold py-3 rounded-lg text-lg hover:bg-[#ffce00] transition"
              onClick={() => {
                const sides =
                  menu.sides
                    ?.map((sideGroup) =>
                      typeof selected[sideGroup.title] === "number"
                        ? {
                            name: sideGroup.options[selected[sideGroup.title]].name,
                            price:
                              parseFloat(
                                sideGroup.options[selected[sideGroup.title]].price
                              ) || 0,
                            label:
                              sideGroup.options[selected[sideGroup.title]].label ||
                              "",
                          }
                        : null
                    )
                    .filter(Boolean) || [];
                onConfirm(sides, quantity);
              }}
            >
              Add to Cart • LKR {total.toLocaleString()}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function FloatingFoodLoader() {
  const FOOD_IMAGE =
    "https://res.cloudinary.com/dc1x4qpjp/image/upload/v1745123231/vk7dkjylka7eqnji52w3.png";
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px]">
      <div className="relative mb-4">
        <img
          src={FOOD_IMAGE}
          alt="Loading food"
          className="w-24 h-24 rounded-full object-cover animate-float"
          style={{
            border: "6px solid #FFD600",
            background: "#fffbe7",
          }}
        />
        <style>{`
          @keyframes float {
            0% { transform: translateY(0);}
            50% { transform: translateY(-24px);}
            100% { transform: translateY(0);}
          }
          .animate-float {
            animation: float 1.6s ease-in-out infinite;
          }
        `}</style>
      </div>
      <div className="text-lg font-semibold text-orange-500">
        Loading menu...
      </div>
    </div>
  );
}

// --- Main MenuPage ---
export default function MenuPage({ restaurantId }) {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartOpen, setCartOpen] = useState(false);
  const [sidesModal, setSidesModal] = useState({ open: false, menu: null });

  const { addToCart } = useCart();
  const RESTAURANT_API_URL = import.meta.env.VITE_RESTAURANT_API_URL;
  const navigate = useNavigate();

  // Group menus by category and subcategory
  const groupMenus = (menus) => {
    const grouped = {};
    menus.forEach((item) => {
      if (!grouped[item.category]) grouped[item.category] = {};
      if (!grouped[item.category][item.subcategory])
        grouped[item.category][item.subcategory] = [];
      grouped[item.category][item.subcategory].push(item);
    });
    return grouped;
  };

  // Fetch menus
  useEffect(() => {
    let timer;
    const fetchMenus = async () => {
      setLoading(true);
      const start = Date.now();
      try {
        const res = await axios.get(
          `${RESTAURANT_API_URL}/menu/${restaurantId}`
        );
        setMenus(res.data.data || []);
      } catch (err) {
        setMenus([]);
      } finally {
        // Ensure loading spinner is visible for at least 2 seconds
        const elapsed = Date.now() - start;
        timer = setTimeout(
          () => setLoading(false),
          Math.max(0, 2000 - elapsed)
        );
      }
    };
    if (restaurantId) fetchMenus();
    return () => clearTimeout(timer);
  }, [restaurantId]);

  // Fetch and attach average rating and review count for each menu item
  useEffect(() => {
    if (!menus.length) return;

    const fetchAverages = async () => {
      const updatedMenus = await Promise.all(
        menus.map(async (item) => {
          try {
            const res = await axios.get(`http://localhost:4010/api/reviews/${item._id}`);
            const reviews = res.data.data || [];
            let averageRating = 0;
            if (reviews.length > 0) {
              averageRating =
                reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
            }
            return { ...item, averageRating, totalReviews: reviews.length };
          } catch {
            return { ...item, averageRating: 0, totalReviews: 0 };
          }
        })
      );
      setMenus(updatedMenus);
    };

    // Only fetch if at least one menu has no averageRating
    if (!menus[0]?.averageRating) fetchAverages();
  }, [menus.length]);

  if (loading) return <FloatingFoodLoader />;
  if (!menus.length) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="text-gray-400">No menu items found.</div>
      </div>
    );
  }

  const grouped = groupMenus(menus);

  // Fetch menu with restaurant details for cart
  const fetchMenuWithRestaurant = async (menuId) => {
    const res = await axios.get(
      `${RESTAURANT_API_URL}/menu/${menuId}/with-restaurant`
    );
    return res.data.data;
  };

  // Add to cart handler
  const handleAdd = async (item) => {
    if (!addToCart) return;
    let menuWithRestaurant = item;
    if (!item.restaurant || !item.restaurant._id) {
      menuWithRestaurant = await fetchMenuWithRestaurant(item._id);
    }
    if (item.sides && item.sides.length > 0) {
      setSidesModal({ open: true, menu: menuWithRestaurant });
    } else {
      const success = await addToCart(item._id, [], 1, menuWithRestaurant);
      if (success !== false) setCartOpen(true);
    }
  };

  const handleSidesConfirm = async (sides, quantity) => {
    if (!addToCart) return;
    let menuWithRestaurant = sidesModal.menu;
    if (!sidesModal.menu.restaurant || !sidesModal.menu.restaurant._id) {
      menuWithRestaurant = await fetchMenuWithRestaurant(sidesModal.menu._id);
    }
    const success = await addToCart(
      sidesModal.menu._id,
      sides,
      quantity,
      menuWithRestaurant
    );
    setSidesModal({ open: false, menu: null });
    if (success !== false) setCartOpen(true);
  };

  // Review navigation handler
  const openReviews = (menuId) => {
    navigate(`/menu/${menuId}/reviews`);
  };

  return (
    <div className="max-w-7xl mx-auto py-10 px-4">
      {Object.entries(grouped).map(([category, subcats]) => (
        <div key={category} className="mb-12">
          <h2 className="text-2xl font-bold text-orange-500 mb-5">
            {category}
          </h2>
          {Object.entries(subcats).map(([subcategory, items]) => (
            <div key={subcategory} className="mb-8">
              <h3 className="text-lg font-semibold text-[#23263a] mb-4">
                {subcategory}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                {items.map((item) => (
                  <MenuCard
                    key={item._id}
                    item={item}
                    onAdd={handleAdd}
                    onViewReviews={openReviews}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      ))}
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      <SidesModal
        open={sidesModal.open}
        menu={sidesModal.menu}
        onClose={() => setSidesModal({ open: false, menu: null })}
        onConfirm={handleSidesConfirm}
      />
    </div>
  );
}

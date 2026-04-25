import React, { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import CartDrawer from "../components/CartDrawer";
import axios from "axios";

// Card component (same as MenuPage)
function MenuCard({ item, onAdd }) {
  return (
    <div
      className="flex items-center bg-white rounded-2xl shadow-lg p-6 mx-auto transition-transform hover:-translate-y-1"
      style={{ width: 360, height: 180 }}
    >
      <div className="flex-1 min-w-0 pr-4">
        <div className="text-lg font-bold mb-1 text-[#1c2331]">{item.name}</div>
        <div className="text-gray-600 mb-3 text-sm leading-snug line-clamp-2">
          {item.description}
        </div>
        <div className="font-bold text-[#1c2331] text-base">
          රු {parseFloat(item.price).toFixed(2)}
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
          >
            <span className="text-white text-2xl font-bold">+</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// Sides selection modal (same as MenuPage)
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
          <button className="self-end text-2xl text-gray-400 hover:text-black mb-2" onClick={onClose}>
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
                        onChange={() => setSelected((s) => ({ ...s, [sideGroup.title]: i }))}
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
              >-</button>
              <span className="px-4">{quantity}</span>
              <button
                className="px-3 py-1 bg-gray-100 text-lg font-bold"
                onClick={() => setQuantity((q) => q + 1)}
              >+</button>
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
                            price: parseFloat(sideGroup.options[selected[sideGroup.title]].price) || 0,
                            label: sideGroup.options[selected[sideGroup.title]].label || "",
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

export default function AllRestaurantsMenus() {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartOpen, setCartOpen] = useState(false);
  const [sidesModal, setSidesModal] = useState({ open: false, menu: null });
  const { addToCart } = useCart();

  const RESTAURANT_API_URL = import.meta.env.VITE_RESTAURANT_API_URL;

  useEffect(() => {
    const fetchMenus = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${RESTAURANT_API_URL}/menu/popular`);
        setMenus(res.data.data || []);
      } catch (err) {
        setMenus([]);
      }
      setLoading(false);
    };
    fetchMenus();
  }, []);

  // Group menus by restaurant for horizontal rows
  const grouped = {};
  menus.forEach((item) => {
    const rId = item.restaurant?._id || item.restaurant;
    if (!grouped[rId]) grouped[rId] = { restaurant: item.restaurant, items: [] };
    grouped[rId].items.push(item);
  });

  // Add to cart handler: wait for cart update before opening drawer
  const handleAdd = async (item) => {
    if (!addToCart) return;
    if (item.sides && item.sides.length > 0) {
      setSidesModal({ open: true, menu: item });
    } else {
      const success = await addToCart(item._id, [], 1, item);
      if (success !== false) setCartOpen(true);
    }
  };

  const handleSidesConfirm = async (sides, quantity) => {
    if (!addToCart) return;
    const success = await addToCart(sidesModal.menu._id, sides, quantity, sidesModal.menu);
    setSidesModal({ open: false, menu: null });
    if (success !== false) setCartOpen(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="text-lg font-semibold text-orange-500">Loading menus...</div>
      </div>
    );
  }

  if (!menus.length) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="text-gray-400">No popular menu items found.</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-10 text-orange-500 text-center">All Popular Menus</h1>
      {Object.values(grouped).map(({ restaurant, items }) => (
        <div key={restaurant?._id || restaurant} className="mb-12">
          <div className="flex items-center gap-4 mb-4">
            <img
              src={restaurant?.logo}
              alt={restaurant?.name}
              className="w-14 h-14 rounded-xl object-cover border"
            />
            <div>
              <div className="font-bold text-2xl text-[#1c2331]">{restaurant?.name}</div>
              <div className="text-sm text-gray-500">{restaurant?.address}</div>
            </div>
          </div>
          <div className="flex gap-6 overflow-x-auto pb-2 hide-scrollbar">
            {items.map((item) => (
              <MenuCard key={item._id} item={item} onAdd={handleAdd} />
            ))}
          </div>
        </div>
      ))}
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      <SidesModal
        open={sidesModal.open}
        menu={sidesModal.menu}
        onClose={() => setSidesModal({ open: false, menu: null })}
        onConfirm={handleSidesConfirm}
      />
      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaStar, FaTrash, FaEdit } from "react-icons/fa";
import { Link } from "react-router-dom";
import RestaurantOrders from "../pages/RestaurantOrders";

const RESTAURANT_API_URL = import.meta.env.VITE_RESTAURANT_API_URL;

// ConfirmModal
function ConfirmModal({ open, onClose, onConfirm, message }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-lg relative max-h-[90vh] overflow-y-auto">
        <div className="text-lg font-bold mb-4 text-red-600">
          Delete Menu Item
        </div>
        <div className="mb-6 text-gray-700 whitespace-normal">{message || "Are you sure you want to delete this menu item? This cannot be undone."}</div>
        <div className="flex gap-4 justify-end flex-wrap">
          <button
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded font-semibold focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-400 w-full sm:w-auto"
            onClick={onClose}
            type="button"
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-red-600 text-white rounded font-semibold hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-red-600 w-full sm:w-auto"
            onClick={onConfirm}
            type="button"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// EditMenuModal
function EditMenuModal({ open, menu, onClose, onSave }) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    subcategory: "",
    sides: [],
    popular: false,
    image: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (menu) {
      setForm({
        name: menu.name || "",
        description: menu.description || "",
        price: menu.price || "",
        category: menu.category || "",
        subcategory: menu.subcategory || "",
        sides: menu.sides || [],
        popular: !!menu.popular,
        image: menu.image || "",
      });
      setImageFile(null);
    }
  }, [menu]);

  if (!open || !menu) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setForm((f) => ({ ...f, [name]: checked }));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };

  const handleSidesChange = (idx, field, value) => {
    setForm((f) => {
      const sides = [...f.sides];
      sides[idx][field] = value;
      return { ...f, sides };
    });
  };

  const addSide = () => {
    setForm((f) => ({
      ...f,
      sides: [...(f.sides || []), { name: "", price: 0 }],
    }));
  };

  const removeSide = (idx) => {
    setForm((f) => ({
      ...f,
      sides: f.sides.filter((_, i) => i !== idx),
    }));
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("description", form.description);
      fd.append("price", form.price);
      fd.append("category", form.category);
      fd.append("subcategory", form.subcategory);
      fd.append("popular", form.popular);
      fd.append("sides", JSON.stringify(form.sides));
      if (imageFile) fd.append("image", imageFile);

      const token = localStorage.getItem("restaurantToken");
      await axios.put(
        `${RESTAURANT_API_URL}/menu/${menu._id}`,
        fd,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      onSave();
      onClose();
    } catch (err) {
      alert("Failed to update menu item.");
    }
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-xl p-6 max-w-lg w-full shadow-lg relative max-h-[90vh] overflow-y-auto">
        <button
          className="absolute top-3 right-4 text-2xl text-gray-400 hover:text-black focus:outline-none"
          onClick={onClose}
          aria-label="Close edit menu modal"
          type="button"
        >
          &times;
        </button>
        <h2 className="text-xl font-bold mb-4">Edit Menu</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-semibold mb-1" htmlFor="name">Name</label>
            <input
              id="name"
              className="w-full border rounded p-2"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              type="text"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1" htmlFor="description">Description</label>
            <textarea
              id="description"
              className="w-full border rounded p-2"
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
            />
          </div>
          <div>
            <label className="block font-semibold mb-1" htmlFor="price">Price</label>
            <input
              id="price"
              className="w-full border rounded p-2"
              name="price"
              type="number"
              min="0"
              step="any"
              value={form.price}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block font-semibold mb-1" htmlFor="category">Category</label>
            <input
              id="category"
              className="w-full border rounded p-2"
              name="category"
              value={form.category}
              onChange={handleChange}
              type="text"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1" htmlFor="subcategory">Subcategory</label>
            <input
              id="subcategory"
              className="w-full border rounded p-2"
              name="subcategory"
              value={form.subcategory}
              onChange={handleChange}
              type="text"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Sides</label>
            {form.sides && form.sides.map((side, idx) => (
              <div key={idx} className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                <input
                  className="border rounded p-1 flex-1"
                  placeholder="Side name"
                  value={side.name}
                  onChange={e => handleSidesChange(idx, "name", e.target.value)}
                  type="text"
                  aria-label={`Side name ${idx + 1}`}
                />
                <input
                  className="border rounded p-1 w-full sm:w-20"
                  type="number"
                  min="0"
                  step="any"
                  placeholder="Price"
                  value={side.price}
                  onChange={e => handleSidesChange(idx, "price", e.target.value)}
                  aria-label={`Side price ${idx + 1}`}
                />
                <button
                  type="button"
                  onClick={() => removeSide(idx)}
                  className="text-red-500 font-bold px-2 self-start sm:self-auto"
                  aria-label={`Remove side ${idx + 1}`}
                >
                  &times;
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addSide}
              className="text-blue-600 font-semibold mt-1 focus:outline-none focus:underline"
            >
              + Add Side
            </button>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              name="popular"
              checked={form.popular}
              onChange={handleChange}
              id="popular"
            />
            <label htmlFor="popular" className="font-semibold cursor-pointer">
              Popular
            </label>
          </div>
          <div>
            <label className="block font-semibold mb-1" htmlFor="image">Image</label>
            <input 
              id="image" 
              type="file" 
              accept="image/*" 
              onChange={handleImageChange} 
              className="w-full"
            />
            {form.image && (
              <img src={form.image} alt="Menu" className="w-20 h-20 mt-2 rounded object-cover" />
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-[#23263a] text-white py-2 rounded font-bold mt-2 hover:bg-[#1b1f2a] transition-colors"
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function RestaurantProfileDashboard({ restaurant }) {
  const [menus, setMenus] = useState([]);
  const [loadingMenus, setLoadingMenus] = useState(true);
  const [editMenu, setEditMenu] = useState(null);
  const [MenuId, setMenuId] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [successMsg, setSuccessMsg] = useState(""); // success message

  // Fetch menus
  const fetchMenus = () => {
    const restaurantId = restaurant._id || restaurant.id;
    setLoadingMenus(true);
    axios.get(`${RESTAURANT_API_URL}/menu/${restaurantId}`)
      .then(res => setMenus(res.data.data || []))
      .catch(() => setMenus([]))
      .finally(() => setLoadingMenus(false));
  };

  useEffect(() => {
    if (restaurant && (restaurant._id || restaurant.id)) {
      fetchMenus();
    }
  }, [restaurant]);

  // Delete menu handler
  const handleDeleteMenu = (menuId) => {
    setMenuId(menuId);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      const token = localStorage.getItem("restaurantToken");
      await axios.delete(`${RESTAURANT_API_URL}/menu/${MenuId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShowConfirm(false);
      setMenuId(null);
      fetchMenus();
      setSuccessMsg("Menu item deleted successfully!");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch {
      setShowConfirm(false);
      setMenuId(null);
      alert("Failed to delete menu item.");
    }
  };

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6">
      {/* Restaurant Info */}
      <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
        <img
          src={restaurant.logo}
          alt={restaurant.name}
          className="w-20 h-20 rounded-full border object-cover flex-shrink-0"
        />
        <div className="text-center sm:text-left max-w-xs sm:max-w-full">
          <h1 className="font-bold text-2xl truncate">{restaurant.name}</h1>
          <p className="text-gray-500 truncate">{restaurant.address}</p>
        </div>
      </div>

      {/* Success Message */}
      {successMsg && (
        <div className="mb-4 px-4 py-2 bg-green-100 text-green-800 rounded font-semibold text-center shadow">
          {successMsg}
        </div>
      )}

      {/* Menu List */}
      <section className="bg-white rounded-xl shadow p-6 mb-6">
        <h2 className="font-semibold text-[#23263a] mb-4 text-lg">Menu List</h2>
        {loadingMenus ? (
          <div className="flex justify-center items-center py-10">
            <span className="text-orange-500 font-semibold">Loading menus...</span>
          </div>
        ) : menus.length === 0 ? (
          <div className="text-gray-500 py-10 text-center">
            No menus found.{" "}
            <Link to="/restaurant/menu-add" className="text-orange-500 underline">
              Add menu
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {menus.map((menu) => (
              <article
                key={menu._id}
                className="bg-[#f9f9f9] rounded-lg shadow p-3 flex flex-col items-center relative"
              >
                {/* Edit and Delete Icons */}
                <div className="absolute top-2 right-2 flex gap-2">
                  <button
                    className="text-black hover:text-black focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-500 rounded"
                    title="Edit menu"
                    onClick={() => setEditMenu(menu)}
                    type="button"
                    aria-label={`Edit menu ${menu.name}`}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="text-red-500 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-red-500 rounded"
                    title="Delete menu"
                    onClick={() => handleDeleteMenu(menu._id)}
                    type="button"
                    aria-label={`Delete menu ${menu.name}`}
                  >
                    <FaTrash />
                  </button>
                </div>
                <img
                  src={menu.image}
                  alt={menu.name}
                  className="w-24 h-24 object-cover rounded-lg mb-2"
                />
                <h3 className="font-bold text-[#23263a] text-lg truncate text-center w-full">
                  {menu.name}
                </h3>
                <p className="text-xs text-gray-500 truncate">{menu.category}</p>
                <div className="flex items-center gap-1 text-xs text-[#ffb300] mt-1">
                  <FaStar aria-hidden="true" />
                  {menu.popular ? "Popular" : ""}
                </div>
                <p className="text-sm text-gray-700 mt-1">LKR {menu.price}</p>
              </article>
            ))}
          </div>
        )}
        <div className="mt-4 text-center">
          <Link
            to="/menu-add"
            className="inline-block bg-[#23263a] text-white px-6 py-2 rounded-lg hover:bg-[#23263a]/90 font-semibold transition"
          >
            Add Menu
          </Link>
        </div>
      </section>

      {/* Edit Modal */}
      <EditMenuModal
        open={!!editMenu}
        menu={editMenu}
        onClose={() => setEditMenu(null)}
        onSave={fetchMenus}
      />

      {/* Confirm Delete Modal */}
      <ConfirmModal
        open={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={confirmDelete}
        message="Are you sure you want to delete this menu item? This action cannot be undone."
      />

      {/* Orders Management */}
      <section className="bg-white rounded-xl shadow p-6">
        <h2 className="font-semibold text-[#23263a] mb-4 text-lg">Orders</h2>
        <RestaurantOrders />
      </section>
    </div>
  );
}

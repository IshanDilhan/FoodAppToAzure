import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaUtensils,
  FaTag,
  FaList,
  FaMoneyBill,
  FaImage,
  FaPlus,
  FaTrash,
  FaStar,
} from "react-icons/fa";
import RestaurantSidebar from "./RestaurantSidebar";

const initialSide = {
  title: "",
  maxChoose: 1,
  options: [{ name: "", price: "", label: "" }],
};

export default function MenuAddForm() {
  const RESTAURANT_API_URL = import.meta.env.VITE_RESTAURANT_API_URL;
  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    subcategory: "",
    image: null,
    imagePreview: null,
    sides: [JSON.parse(JSON.stringify(initialSide))],
    popular: false,
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [priceError, setPriceError] = useState("");
  const [sideErrors, setSideErrors] = useState({});
  const [restaurant, setRestaurant] = useState(null);

  const restaurantToken = localStorage.getItem("restaurantToken");
  const restaurantId = localStorage.getItem("restaurantId");

  // Fetch restaurant info for sidebar
  useEffect(() => {
    async function fetchRestaurant() {
      try {
        const res = await fetch(`${RESTAURANT_API_URL}/restaurants/${restaurantId}`);
        const data = await res.json();
        if (data.success) setRestaurant(data.data);
      } catch (err) {
        setRestaurant(null);
      }
    }
    if (restaurantId) fetchRestaurant();
  }, [restaurantId, RESTAURANT_API_URL]);

  if (!restaurantToken) return null;

  // Handlers
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (name === "price") {
      validatePrice(value);
    }
  };

  // Restrict input to numbers and only one dot
  const handleNumberInput = (e, value) => {
    const key = e.key;
    if (
      !/[0-9.]/.test(key) ||
      (key === "." && value.includes(".")) ||
      (key === "." && value.length === 0)
    ) {
      e.preventDefault();
    }
  };

  // Prevent paste of non-numeric
  const handlePaste = (e) => {
    const paste = e.clipboardData.getData("text");
    if (!/^\d*\.?\d*$/.test(paste)) {
      e.preventDefault();
    }
  };

  // Validate main price
  const validatePrice = (value) => {
    if (!/^\d*\.?\d*$/.test(value)) {
      setPriceError("Price must be a number.");
      return false;
    }
    if (value === "" || Number(value) <= 0) {
      setPriceError("Price must be greater than zero.");
      return false;
    }
    setPriceError("");
    return true;
  };

  // Validate side option price
  const validateSidePrice = (sideIdx, optIdx, value) => {
    let err = "";
    if (!/^\d*\.?\d*$/.test(value)) {
      err = "Price must be a number.";
    } else if (value === "" || Number(value) <= 0) {
      err = "Price must be greater than zero.";
    }
    setSideErrors((prev) => ({
      ...prev,
      [`${sideIdx}-${optIdx}`]: err,
    }));
    return !err;
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm((prev) => ({
        ...prev,
        image: file,
        imagePreview: URL.createObjectURL(file),
      }));
    }
  };

  // Sides logic
  const handleSideChange = (idx, key, value) => {
    const updated = [...form.sides];
    updated[idx][key] = value;
    setForm((prev) => ({ ...prev, sides: updated }));
  };
  const handleOptionChange = (sideIdx, optIdx, key, value) => {
    const updated = [...form.sides];
    updated[sideIdx].options[optIdx][key] = value;
    setForm((prev) => ({ ...prev, sides: updated }));
    if (key === "price") {
      validateSidePrice(sideIdx, optIdx, value);
    }
  };
  const addSide = () =>
    setForm((prev) => ({
      ...prev,
      sides: [...prev.sides, JSON.parse(JSON.stringify(initialSide))],
    }));
  const removeSide = (idx) =>
    setForm((prev) => ({
      ...prev,
      sides: prev.sides.filter((_, i) => i !== idx),
    }));
  const addOption = (sideIdx) =>
    setForm((prev) => {
      const updated = [...prev.sides];
      updated[sideIdx].options.push({ name: "", price: "", label: "" });
      return { ...prev, sides: updated };
    });
  const removeOption = (sideIdx, optIdx) =>
    setForm((prev) => {
      const updated = [...prev.sides];
      updated[sideIdx].options = updated[sideIdx].options.filter((_, i) => i !== optIdx);
      return { ...prev, sides: updated };
    });

  // Validate all before submit
  const validateAll = () => {
    let valid = true;
    if (!validatePrice(form.price)) valid = false;
    form.sides.forEach((side, sideIdx) => {
      side.options.forEach((opt, optIdx) => {
        if (!validateSidePrice(sideIdx, optIdx, opt.price)) valid = false;
      });
    });
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!validateAll()) {
      setError("Please fix the errors before submitting.");
      return;
    }
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("price", form.price);
      fd.append("description", form.description);
      fd.append("category", form.category);
      fd.append("subcategory", form.subcategory);
      if (form.image) fd.append("image", form.image);
      fd.append("sides", JSON.stringify(form.sides));
      fd.append("popular", form.popular);
      const res = await fetch(`${RESTAURANT_API_URL}/menu`, {
        method: "POST",
        headers: { Authorization: `Bearer ${restaurantToken}` },
        body: fd,
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Failed to add menu.");
      setSuccess("Menu item added!");
      setForm({
        name: "",
        price: "",
        description: "",
        category: "",
        subcategory: "",
        image: null,
        imagePreview: null,
        sides: [JSON.parse(JSON.stringify(initialSide))],
        popular: false,
      });
      setSideErrors({});
      setPriceError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setTimeout(() => setSuccess(""), 3000);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#FAFAFA]">
      <RestaurantSidebar restaurant={restaurant} />
      <main className="flex-1 flex items-start justify-center px-4 sm:px-6 py-8 overflow-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, type: "spring" }}
          className="w-full max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-6 sm:p-8"
        >
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-orange-600">
            <FaUtensils /> Add New Menu Item
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <label
                  className="flex items-center gap-2 font-semibold mb-1"
                  htmlFor="name"
                >
                  <FaTag /> Name
                </label>
                <input
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-400"
                  placeholder="e.g. The classics for 3"
                />
              </div>
              {/* Price */}
              <div>
                <label
                  className="flex items-center gap-2 font-semibold mb-1"
                  htmlFor="price"
                >
                  <FaMoneyBill /> Price
                </label>
                <input
                  id="price"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  required
                  type="text"
                  inputMode="decimal"
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-400"
                  placeholder="e.g. 23.10"
                  onKeyPress={(e) => handleNumberInput(e, form.price)}
                  onPaste={handlePaste}
                  autoComplete="off"
                />
                {priceError && <div className="text-red-500 text-xs mt-1">{priceError}</div>}
              </div>
              {/* Category */}
              <div>
                <label
                  className="flex items-center gap-2 font-semibold mb-1"
                  htmlFor="category"
                >
                  <FaList /> Category
                </label>
                <input
                  id="category"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-400"
                  placeholder="e.g. Burgers"
                />
              </div>
              {/* Subcategory */}
              <div>
                <label
                  className="flex items-center gap-2 font-semibold mb-1"
                  htmlFor="subcategory"
                >
                  <FaList /> Subcategory
                </label>
                <input
                  id="subcategory"
                  name="subcategory"
                  value={form.subcategory}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-400"
                  placeholder="e.g. Royal Cheese Burger"
                />
              </div>
            </div>
            {/* Description */}
            <div>
              <label
                className="flex items-center gap-2 font-semibold mb-1"
                htmlFor="description"
              >
                <FaList /> Description
              </label>
              <textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                required
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-400"
                placeholder="Describe the menu item"
                rows={4}
              />
            </div>
            {/* Image Upload */}
            <div>
              <label className="flex items-center gap-2 font-semibold mb-1" htmlFor="image">
                <FaImage /> Image
              </label>
              <div className="flex items-center gap-4 flex-wrap sm:flex-nowrap">
                <input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImage}
                  className="block"
                  required={!form.imagePreview}
                />
                {form.imagePreview && (
                  <motion.img
                    src={form.imagePreview}
                    alt="Preview"
                    className="rounded-full w-24 h-24 object-cover border mt-3 sm:mt-0"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", duration: 0.5 }}
                  />
                )}
              </div>
            </div>
            {/* Sides/Add-ons */}
            <div>
              <label className="flex items-center gap-2 font-semibold mb-3">
                <FaPlus /> Sides / Add-ons
              </label>
              <AnimatePresence>
                {form.sides.map((side, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="p-4 mb-4 bg-orange-50 rounded-lg border border-orange-200"
                  >
                    <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4 flex-wrap">
                      <input
                        className="border rounded px-2 py-1 w-full md:w-56"
                        placeholder="Title (e.g. Add Sides)"
                        value={side.title}
                        onChange={(e) => handleSideChange(idx, "title", e.target.value)}
                      />
                      <input
                        type="number"
                        min={1}
                        className="border rounded px-2 py-1 w-full md:w-36"
                        placeholder="Max choose"
                        value={side.maxChoose}
                        onChange={(e) => handleSideChange(idx, "maxChoose", e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => removeSide(idx)}
                        className="ml-auto text-red-500 hover:text-red-700 shrink-0"
                        aria-label="Remove side group"
                      >
                        <FaTrash size={20} />
                      </button>
                    </div>
                    <div className="space-y-3">
                      {side.options.map((opt, optIdx) => (
                        <div
                          key={optIdx}
                          className="flex flex-col sm:flex-row items-start sm:items-center gap-2 flex-wrap"
                        >
                          <input
                            className="border rounded px-2 py-1 w-full sm:w-48"
                            placeholder="Option name"
                            value={opt.name}
                            onChange={(e) =>
                              handleOptionChange(idx, optIdx, "name", e.target.value)
                            }
                          />
                          <input
                            className="border rounded px-2 py-1 w-full sm:w-24"
                            type="text"
                            inputMode="decimal"
                            placeholder="Price"
                            value={opt.price}
                            onChange={(e) =>
                              handleOptionChange(idx, optIdx, "price", e.target.value)
                            }
                            onKeyPress={(e) => handleNumberInput(e, opt.price)}
                            onPaste={handlePaste}
                            autoComplete="off"
                          />
                          {sideErrors[`${idx}-${optIdx}`] && (
                            <div className="text-red-500 text-xs w-full sm:w-auto">
                              {sideErrors[`${idx}-${optIdx}`]}
                            </div>
                          )}
                          <input
                            className="border rounded px-2 py-1 w-full sm:w-32"
                            placeholder="Label (Popular, Add On)"
                            value={opt.label}
                            onChange={(e) =>
                              handleOptionChange(idx, optIdx, "label", e.target.value)
                            }
                          />
                          <button
                            type="button"
                            onClick={() => removeOption(idx, optIdx)}
                            className="text-red-400 hover:text-red-600 shrink-0 mt-1 sm:mt-0"
                            aria-label="Remove option"
                          >
                            <FaTrash size={18} />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => addOption(idx)}
                        className="mt-3 text-orange-600 hover:text-orange-800 flex items-center gap-1 font-semibold"
                      >
                        <FaPlus /> Add Option
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              <button
                type="button"
                onClick={addSide}
                className="text-orange-600 hover:text-orange-800 flex items-center gap-1 mt-2 font-semibold"
              >
                <FaPlus /> Add Side Group
              </button>
            </div>
            {/* Popular Checkbox */}
            <div className="flex items-center gap-3 mb-2">
              <input
                type="checkbox"
                id="popular"
                name="popular"
                checked={form.popular}
                onChange={handleChange}
                className="w-5 h-5 accent-orange-500"
              />
              <label
                htmlFor="popular"
                className="flex items-center gap-2 font-semibold text-orange-600 cursor-pointer select-none"
              >
                <FaStar className="text-yellow-400" /> Mark as Popular Menu
              </label>
            </div>
            {/* Submit */}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="w-full bg-black hover:bg-orange-600 text-white font-bold py-3 rounded-xl text-lg shadow transition"
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Menu Item"}
            </motion.button>
            <AnimatePresence>
              {success && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-green-600 text-center font-semibold mt-4"
                >
                  {success}
                </motion.div>
              )}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-red-500 text-center font-semibold mt-4"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </motion.div>
      </main>
    </div>
  );
}

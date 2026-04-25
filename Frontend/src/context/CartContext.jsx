import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const CartContext = createContext();
const CART_API_URL = import.meta.env.VITE_CART_API_URL;

export function CartProvider({ children }) {
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(true);

  // Fetch cart from backend on mount
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const response = await axios.get(`${CART_API_URL}/cart`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCart(response.data.cart || { items: [] });
      } catch (error) {
        setCart({ items: [] });
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, []);

  // Add to cart and sync with backend
  const addToCart = async (menuId, sides = [], quantity = 1, menuData = null) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      // Call backend API to add item
      await axios.post(`${CART_API_URL}/cart/add`, {
        menuId, sides, quantity, menuData
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Refetch cart from backend
      const response = await axios.get(`${CART_API_URL}/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart(response.data.cart || { items: [] });
    } catch (error) {
      console.error("Failed to add to cart:", error);
    }
  };

  // Update quantity in backend
  const updateQuantity = async (menuId, sides, quantity, restaurant) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
  
      // Update to PUT request instead of POST
      await axios.put(`${CART_API_URL}/cart/update`, {
        menuId, sides, quantity, restaurant
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
  
      // Fetch updated cart after update
      const response = await axios.get(`${CART_API_URL}/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart(response.data.cart || { items: [] });
    } catch (error) {
      console.error("Failed to update cart:", error);
    }
  };
  
  // Remove from cart in backend
  const removeFromCart = async (menuId, sides, restaurant) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
  
      // Update to DELETE request instead of POST
      await axios.delete(`${CART_API_URL}/cart/remove`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { menuId, sides, restaurant }, // data for DELETE request
      });
  
      // Fetch updated cart after removal
      const response = await axios.get(`${CART_API_URL}/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart(response.data.cart || { items: [] });
    } catch (error) {
      console.error("Failed to remove from cart:", error);
    }
  };
  

  // Clear cart in backend
  const clearCart = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        await axios.delete(`${CART_API_URL}/cart`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
    } catch (error) {
      console.error("Failed to clear backend cart:", error);
    }
    setCart({ items: [] });
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        loading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}

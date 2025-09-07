import React, { createContext, useState, useEffect, useContext } from "react";
import { getCart, addToCart, updateCartItem, removeCartItem, mergeCart } from "../api/api";
import { AuthContext } from "./AuthContext";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const { user, token } = useContext(AuthContext);

  // Update cart whenever user or token changes (e.g., login/logout)
  useEffect(() => {
    const fetchCart = async () => {
      if (token) {
        // Optional: Merge guest cart on login
        const guestCart = JSON.parse(localStorage.getItem('guestCart') || '[]');
        if (guestCart.length > 0) {
          await mergeLocalCart(guestCart);
          localStorage.removeItem('guestCart');
        }
        try {
          const res = await getCart();
          setCart(res.data);
        } catch (err) {
          setCart([]);
        }
      } else {
        setCart([]);
      }
    };
    fetchCart();
    // eslint-disable-next-line
  }, [token, user]);

  const addItem = async (itemId, qty = 1) => {
    if (!token) return;
    const res = await addToCart(itemId, qty);
    setCart(res.data);
  };

  const updateItem = async (itemId, qty) => {
    if (!token) return;
    const res = await updateCartItem(itemId, qty);
    setCart(res.data);
  };

  const removeItem = async (itemId) => {
    if (!token) return;
    const res = await removeCartItem(itemId);
    setCart(res.data);
  };

  const mergeLocalCart = async (items) => {
    if (!token) return;
    const res = await mergeCart(items);
    setCart(res.data);
  };

  return (
    <CartContext.Provider value={{ cart, addItem, updateItem, removeItem, mergeLocalCart }}>
      {children}
    </CartContext.Provider>
  );
};
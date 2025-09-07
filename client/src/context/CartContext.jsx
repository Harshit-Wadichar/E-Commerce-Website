import React, { createContext, useState, useEffect, useContext } from "react";
import { getCart, addToCart, updateCartItem, removeCartItem, mergeCart } from "../api/api";
import { AuthContext } from "./AuthContext";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const { user, token } = useContext(AuthContext);

  // Fetch cart when user logs in
  useEffect(() => {
    const fetchCart = async () => {
      if (token) {
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
  }, [token]);

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
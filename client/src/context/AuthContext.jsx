import React, { createContext, useState, useEffect } from "react";
import { setAuthToken, getCart } from "../api/api"; // Import your getCart function

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem("user")) || null
  );
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [cart, setCart] = useState(() =>
    JSON.parse(localStorage.getItem("cart")) || []
  );

  useEffect(() => {
    setAuthToken(token);
    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
    localStorage.setItem("cart", JSON.stringify(cart || []));
  }, [token, user, cart]);

  // Fetch cart when user logs in
  const loginUser = async (user, token) => {
    setUser(user);
    setToken(token);
    if (user && token) {
      setAuthToken(token);
      try {
        const cartData = await getCart(user.id); // Replace with your API call
        setCart(cartData);
      } catch (err) {
        setCart([]);
      }
    }
  };

  const logout = () => {
    setUser(null);
    setToken("");
    setCart([]);
    setAuthToken(null);
  };

  // Hydrate cart on app load if user exists
  useEffect(() => {
    async function hydrateCart() {
      if (user && token) {
        try {
          const cartData = await getCart(user.id);
          setCart(cartData);
        } catch {
          setCart([]);
        }
      }
    }
    hydrateCart();
  }, [user, token]); // Optional: fetch cart when user/token change

  return (
    <AuthContext.Provider value={{ user, token, cart, setCart, loginUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

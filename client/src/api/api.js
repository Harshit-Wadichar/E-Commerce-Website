import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";

export const setAuthToken = (token) => {
  if (token) axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  else delete axios.defaults.headers.common["Authorization"];
};

// Auth
export const login = (data) => axios.post(`${API_BASE}/auth/login`, data);
export const signup = (data) => axios.post(`${API_BASE}/auth/signup`, data);

// Items
export const fetchItems = (params) => axios.get(`${API_BASE}/items`, { params });
export const fetchItem = (id) => axios.get(`${API_BASE}/items/${id}`);

// Cart
export const getCart = () => axios.get(`${API_BASE}/cart`);
export const addToCart = (itemId, qty) => axios.post(`${API_BASE}/cart/add`, { itemId, qty });
export const updateCartItem = (itemId, qty) => axios.put(`${API_BASE}/cart/update`, { itemId, qty });
export const removeCartItem = (itemId) => axios.delete(`${API_BASE}/cart/remove/${itemId}`);
export const mergeCart = (items) => axios.post(`${API_BASE}/cart/merge`, { items });
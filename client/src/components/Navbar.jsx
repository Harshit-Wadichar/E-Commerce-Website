import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const { cart } = useContext(CartContext);
  const navigate = useNavigate();

  return (
    <nav className="bg-blue-600 text-white px-4 py-3 flex justify-between items-center">
      <div>
        <Link to="/" className="font-bold text-xl">E-Commerce</Link>
      </div>
      <div className="flex gap-4 items-center">
        <Link to="/cart" className="relative">
          Cart
          {cart.length > 0 && (
            <span className="absolute -top-2 -right-3 bg-red-500 rounded-full px-2 text-xs">{cart.length}</span>
          )}
        </Link>
        {user ? (
          <>
            <span className="hidden sm:block">{user.name}</span>
            <button onClick={() => { logout(); navigate("/login"); }} className="bg-white text-blue-600 px-3 py-1 rounded">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:underline">Login</Link>
            <Link to="/signup" className="hover:underline">Signup</Link>
          </>
        )}
      </div>
    </nav>
  );
}
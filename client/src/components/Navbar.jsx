import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import { Home, ShoppingCart, User } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const { cart } = useContext(CartContext);
  const navigate = useNavigate();

  return (
    <nav className="bg-blue-600 text-white px-4 py-3 flex justify-between items-center">
      <div>
        <div className="font-bold text-xl">E-Commerce</div>
      </div>
      
      <div className="flex gap-4 items-center">
        
        {user ? (
          <>
           <Link to="/" className=""> <div className="flex flex-row"><Home className="h-6 w-6 text-white mr-1" />Home</div> </Link>
        <Link to="/cart" className="relative">
            <div className="flex flex-row"> <ShoppingCart className="h-6 w-6 text-white mr-1" />Cart</div>
          {cart.length > 0 && (
            <span className="absolute -top-2 -right-3 bg-red-500 rounded-full px-2 text-xs">{cart.length}</span>
          )}
        </Link>
            <span className="hidden sm:block bg-black p-2 rounded-3xl">  <div className="flex flex-row"> <User className="h-6 w-6 text-white mr-1" />{user.name}</div></span>
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
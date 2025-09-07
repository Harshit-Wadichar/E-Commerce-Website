import React, { useContext } from "react";
import { CartContext } from "../context/CartContext";

export default function ItemCard({ item }) {
  const { addItem } = useContext(CartContext);

  return (
    <div className="bg-white rounded shadow p-4 flex flex-col">
     
      <h3 className="font-bold text-lg">{item.title}</h3>
      <p className="text-gray-600 mb-2">{item.description}</p>
      <div className="flex justify-between items-center mt-auto">
        <span className="font-bold text-blue-600">₹{item.price}</span>
        <button
          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
          onClick={() => addItem(item._id, 1)}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}

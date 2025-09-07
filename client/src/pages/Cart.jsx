import React, { useContext } from "react";
import { CartContext } from "../context/CartContext";

export default function Cart() {
  const { cart, updateItem, removeItem } = useContext(CartContext);

  const total = cart.reduce((sum, ci) => sum + ci.qty * (ci.item?.price || 0), 0);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
      {cart.length === 0 ? (
        <div>Your cart is empty.</div>
      ) : (
        <table className="w-full bg-white rounded shadow">
          <thead>
            <tr>
              <th className="p-2 text-left">Item</th>
              <th className="p-2">Price</th>
              <th className="p-2">Qty</th>
              <th className="p-2">Subtotal</th>
              <th className="p-2"></th>
            </tr>
          </thead>
          <tbody>
            {cart.map(ci => (
              <tr key={ci.item._id} className="border-t">
                <td className="p-2">{ci.item.title}</td>
                <td className="p-2">₹{ci.item.price}</td>
                <td className="p-2">
                  <input
                    type="number"
                    min="1"
                    value={ci.qty}
                    onChange={e => updateItem(ci.item._id, Number(e.target.value))}
                    className="w-16 border rounded p-1"
                  />
                </td>
                <td className="p-2 font-bold">₹{ci.qty * ci.item.price}</td>
                <td className="p-2">
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded"
                    onClick={() => removeItem(ci.item._id)}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={3} className="text-right p-2 font-bold">Total:</td>
              <td className="p-2 font-bold">₹{total}</td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      )}
    </div>
  );
}
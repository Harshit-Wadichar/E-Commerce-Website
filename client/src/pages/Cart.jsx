import React, { useContext } from "react";
import { CartContext } from "../context/CartContext";

export default function Cart() {
  const { cart, updateItem, removeItem } = useContext(CartContext);

  const total = cart.reduce(
    (sum, ci) => sum + ci.qty * (ci.item?.price || 0),
    0
  );

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">🛒 Your Cart</h2>

      {cart.length === 0 ? (
        <div className="bg-gray-100 p-6 rounded text-center text-gray-600">
          Your cart is empty.
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="w-full border-collapse">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-3 text-left">Item</th>
                <th className="p-3 text-center">Price</th>
                <th className="p-3 text-center">Quantity</th>
                <th className="p-3 text-center">Subtotal</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              {cart.map((ci) => (
                <tr key={ci.item._id} className="border-t hover:bg-gray-50">
                  <td className="p-3 font-medium text-gray-800">
                    {ci.item.title}
                  </td>
                  <td className="p-3 text-center">₹{ci.item.price}</td>
                  <td className="p-3 text-center">
                    <input
                      type="number"
                      min="1"
                      value={ci.qty}
                      onChange={(e) =>
                        updateItem(ci.item._id, Number(e.target.value))
                      }
                      className="w-16 border rounded p-1 text-center"
                    />
                  </td>
                  <td className="p-3 text-center font-semibold text-gray-700">
                    ₹{ci.qty * ci.item.price}
                  </td>
                  <td className="p-3 text-center">
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm"
                      onClick={() => removeItem(ci.item._id)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t bg-gray-50">
                <td colSpan={3} className="text-right p-3 font-bold text-lg">
                  Total:
                </td>
                <td className="p-3 font-bold text-lg text-center">
                  ₹{total}
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  );
}

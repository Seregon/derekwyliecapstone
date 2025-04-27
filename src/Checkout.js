import React, { useContext, useState } from 'react';
import axios from 'axios';
import CartContext from './CartContext';
export default function Checkout() {
  const { items, clearCart } = useContext(CartContext);
  const [slot, setSlot] = useState('');
  const [notes, setNotes] = useState('');
  const [orderId, setOrderId] = useState(null);
  const [error, setError] = useState('');

  // Calculate total price
  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  // Handle placing the order
  const placeOrder = async () => {
    if (!items.length) {
      setError('Your cart is empty.');
      return;
    }
    try {
      const res = await axios.post('/api/orders', {
        customerId: 1,            // replace with real user ID or auth
        items,
        deliveryOptions: { slot, notes }
      });
      setOrderId(res.data.orderId);
      clearCart();
    } catch (err) {
      console.error(err);
      setError('Failed to place order. Please try again.');
    }
  };

  // If order is placed, show confirmation
  if (orderId) {
    return (
      <div className="max-w-md mx-auto mt-12 p-6 bg-green-50 rounded shadow">
        <h2 className="text-2xl font-bold mb-4">🎉 Order Confirmed!</h2>
        <p>Your order number is <span className="font-mono">{orderId}</span>.</p>
        <p className="mt-2">Thank you for shopping with us!</p>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto mt-8 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6">Checkout</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      {items.length === 0 ? (
        <p className="text-gray-600">Your cart is empty.</p>
      ) : (
        <>
          <ul className="divide-y">
            {items.map(i => (
              <li key={i.productId} className="py-2 flex justify-between">
                <span>{i.name} × {i.quantity}</span>
                <span>${(i.price * i.quantity).toFixed(2)}</span>
              </li>
            ))}
          </ul>

          <div className="mt-4 flex justify-between font-semibold">
            <span>Total:</span> <span>${total.toFixed(2)}</span>
          </div>

          <div className="mt-6">
            <label className="block font-medium mb-1">Delivery Slot</label>
            <input
              type="datetime-local"
              value={slot}
              onChange={e => setSlot(e.target.value)}
              className="w-full border rounded p-2"
            />
          </div>

          <div className="mt-4">
            <label className="block font-medium mb-1">Notes</label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={3}
              className="w-full border rounded p-2"
            />
          </div>

          <button
            onClick={placeOrder}
            disabled={!items.length || !slot}
            className="mt-6 w-full bg-blue-600 text-white py-2 rounded disabled:opacity-50 hover:bg-blue-700"
          >
            Place Order
          </button>
        </>
      )}
    </div>
  );
}
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import CartContext from '../CartContext';

export default function CartSidebar() {
  const { items } = useContext(CartContext);
  const total = items.reduce((sum,i) => sum + i.price*i.quantity, 0);

  return (
    <aside className="fixed right-0 top-0 h-full w-80 bg-white shadow-lg p-6 transform translate-x-full transition-transform">
      <h3 className="text-2xl font-bold mb-4">Your Cart</h3>
      <ul className="divide-y">
        {items.map(i => (
          <li key={i.productId} className="py-2 flex justify-between">
            <span>{i.name} x{i.quantity}</span>
            <span>${(i.price*i.quantity).toFixed(2)}</span>
          </li>
        ))}
      </ul>
      <div className="mt-4 flex justify-between font-semibold">
        <span>Total:</span><span>${total.toFixed(2)}</span>
      </div>
      <Link to="/checkout"
            className="block mt-6 text-center bg-green-600 text-white py-2 rounded hover:bg-green-700">
        Checkout
      </Link>
    </aside>
  );
}

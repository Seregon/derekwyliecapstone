import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import CartContext from '../CartContext';

export default function NavBar() {
  const { items } = useContext(CartContext);
  const count = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-gray-800">My Store</Link>
        <div className="space-x-4">
          <Link to="/" className="text-gray-600 hover:text-gray-800">Home</Link>
          <Link to="/checkout" className="relative text-gray-600 hover:text-gray-800">
            Cart
            {count > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
);
}

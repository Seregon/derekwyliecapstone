import React, { useContext } from 'react';
import CartContext from '../CartContext';

export default function ProductCard({ product }) {
  const { addItem } = useContext(CartContext);

  return (
    <div className="border rounded-lg shadow hover:shadow-lg transition p-4 flex flex-col">
      <img src={product.imageUrl} alt={product.name}
           className="h-40 w-full object-cover rounded mb-4" />
      <h3 className="font-semibold text-lg">{product.name}</h3>
      <p className="text-gray-600 text-sm flex-grow">{product.description}</p>
      <div className="mt-4 flex items-center justify-between">
        <span className="text-xl font-bold">${product.price.toFixed(2)}</span>
        <button onClick={() => addItem(product)}
          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">
          + Cart
        </button>
      </div>
    </div>
  );
}

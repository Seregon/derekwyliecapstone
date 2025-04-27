// src/CartContext.js
import React, { createContext, useReducer } from 'react';

const CartContext = createContext();

// Initial state is an empty cart
const initialState = [];

// Reducer handles adding items and clearing the cart
function reducer(state, action) {
  switch (action.type) {
    case 'ADD':
      // If the item already exists, increase quantity
      const exists = state.find(i => i.productId === action.item.productId);
      if (exists) {
        return state.map(i =>
          i.productId === action.item.productId
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      // Otherwise add new item with quantity 1
      return [...state, { ...action.item, quantity: 1 }];

    case 'CLEAR':
      return initialState;

    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(reducer, initialState);

  // Action dispatchers
  const addItem = item => {
    dispatch({ type: 'ADD', item });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR' });
  };

  return (
    <CartContext.Provider value={{ items, addItem, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export default CartContext;

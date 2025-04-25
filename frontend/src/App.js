// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './CartContext';
import NavBar from './components/NavBar';
import Home from './Home';
import Checkout from './Checkout';

export default function App() {
  const [showCart, setShowCart] = useState(false);

  return (
    <CartProvider>
      <Router>
        <NavBar onCartClick={() => setShowCart(true)} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/checkout" element={<Checkout />} />
        </Routes>
        {showCart && <CartSidebar />}
      </Router>
    </CartProvider>
  );
}

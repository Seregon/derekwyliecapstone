// src/App.js
import React, { useEffect } from 'react';

export default function App() {
  useEffect(() => {
    console.log('🛠️  App component mounted');
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <h1 className="text-4xl font-bold text-blue-600">React Is Working!</h1>
    </div>
  );
}

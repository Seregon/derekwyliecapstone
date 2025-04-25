import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from './components/ProductCard';
export default function Home() {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    axios.get('/api/products').then(r => setProducts(r.data)).catch(console.error);
  }, []);
  return (<div>{products.map(p => <ProductCard key={p.id} product={p}/>)}</div>);
}
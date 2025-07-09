// src/components/ProductList.jsx
import { useEffect, useState } from 'react';
import { invoke } from '@tauri-apps/api/core';

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const getAllProducts = async () => {
    try {
      setLoading(true);
      const result = await invoke('get_products');
      setProducts(result);
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllProducts();
  }, []);

  return (
    <div>
      <h2>Product List</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {products.map((p) => (
            <li key={p.id}>
              {p.name} — {p.price}$
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

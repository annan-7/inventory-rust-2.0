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

  const handleDeleteProduct = async (productId) => {
    if (window.confirm(`Are you sure you want to delete product ID ${productId}?`)) {
      try {
        await invoke('delete_product', { id: productId });
        // Refresh the product list after deletion
        getAllProducts();
      } catch (error) {
        console.error('Failed to delete product:', error);
        alert(`Error deleting product: ${error}`);
      }
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
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {products.map((p) => (
            <li key={p.id} style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              padding: '10px',
              margin: '5px 0',
              border: '1px solid #ddd',
              borderRadius: '4px',
              backgroundColor: '#f9f9f9'
            }}>
              <span>
                <strong>ID: {p.id}</strong> — {p.name} — ${p.price}
              </span>
              <button
                onClick={() => handleDeleteProduct(p.id)}
                style={{
                  padding: '5px 10px',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
      {products.length === 0 && !loading && (
        <p style={{ color: '#666', fontStyle: 'italic' }}>No products found.</p>
      )}
    </div>
  );
}

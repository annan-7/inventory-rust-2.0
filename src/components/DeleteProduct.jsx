// src/components/DeleteProduct.jsx
import { useState } from 'react';
import { invoke } from '@tauri-apps/api/core';

export default function DeleteProduct({ onProductDeleted }) {
  const [productId, setProductId] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleDelete = async (e) => {
    e.preventDefault();
    
    if (!productId.trim()) {
      setMessage('Please enter a product ID');
      return;
    }

    try {
      setLoading(true);
      setMessage('');
      
      await invoke('delete_product', { id: parseInt(productId) });
      setMessage('Product deleted successfully!');
      setProductId('');
      
      // Notify parent component to refresh the product list
      if (onProductDeleted) {
        onProductDeleted();
      }
    } catch (error) {
      setMessage(`Error deleting product: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ margin: '20px 0', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
      <h3>Delete Product</h3>
      <form onSubmit={handleDelete}>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="productId" style={{ display: 'block', marginBottom: '5px' }}>
            Product ID:
          </label>
          <input
            type="number"
            id="productId"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            placeholder="Enter product ID"
            style={{
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              width: '200px'
            }}
            disabled={loading}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '8px 16px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1
          }}
        >
          {loading ? 'Deleting...' : 'Delete Product'}
        </button>
      </form>
      {message && (
        <p style={{ 
          marginTop: '10px', 
          color: message.includes('Error') ? '#dc3545' : '#28a745',
          fontWeight: 'bold'
        }}>
          {message}
        </p>
      )}
    </div>
  );
} 
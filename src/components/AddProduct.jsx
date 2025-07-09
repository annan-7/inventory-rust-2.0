import { useState } from 'react';
import { invoke } from '@tauri-apps/api/core';

export default function AddProduct({ onProductAdded }) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name.trim() || !price.trim()) {
      setError('Please fill in all fields');
      return;
    }

    const priceValue = parseFloat(price);
    if (isNaN(priceValue) || priceValue <= 0) {
      setError('Please enter a valid price');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      await invoke('add_product', { name: name.trim(), price: priceValue });
      
      setSuccess('Product added successfully!');
      setName('');
      setPrice('');
      
      // Notify parent component to refresh the product list
      if (onProductAdded) {
        onProductAdded();
      }
    } catch (err) {
      setError(`Failed to add product: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-product-container">
      <h2>Add New Product</h2>
      
      <form onSubmit={handleSubmit} className="add-product-form">
        <div className="form-group">
          <label htmlFor="productName">Product Name:</label>
          <input
            type="text"
            id="productName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter product name"
            disabled={loading}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="productPrice">Price ($):</label>
          <input
            type="number"
            id="productPrice"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="0.00"
            step="0.01"
            min="0"
            disabled={loading}
            required
          />
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <button 
          type="submit" 
          disabled={loading}
          className="add-button"
        >
          {loading ? 'Adding...' : 'Add Product'}
        </button>
      </form>

      <style jsx>{`
        .add-product-container {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 20px;
          border: 1px solid #e9ecef;
        }

        .add-product-form {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .form-group label {
          font-weight: 600;
          color: #495057;
        }

        .form-group input {
          padding: 10px;
          border: 1px solid #ced4da;
          border-radius: 4px;
          font-size: 14px;
        }

        .form-group input:focus {
          outline: none;
          border-color: #007bff;
          box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
        }

        .add-button {
          background: #007bff;
          color: white;
          border: none;
          padding: 12px 20px;
          border-radius: 4px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .add-button:hover:not(:disabled) {
          background: #0056b3;
        }

        .add-button:disabled {
          background: #6c757d;
          cursor: not-allowed;
        }

        .error-message {
          color: #dc3545;
          background: #f8d7da;
          border: 1px solid #f5c6cb;
          padding: 10px;
          border-radius: 4px;
          font-size: 14px;
        }

        .success-message {
          color: #155724;
          background: #d4edda;
          border: 1px solid #c3e6cb;
          padding: 10px;
          border-radius: 4px;
          font-size: 14px;
        }
      `}</style>
    </div>
  );
} 
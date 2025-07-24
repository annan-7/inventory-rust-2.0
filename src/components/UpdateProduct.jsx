import { useState } from 'react';
import { invoke } from '@tauri-apps/api/core';

export default function UpdateProduct({ product, onProductUpdated, onCancel }) {
  const [name, setName] = useState(product.name);
  const [price, setPrice] = useState(product.price);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !price.toString().trim()) {
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
      await invoke('update_product', { id: product.id, name: name.trim(), price: priceValue });
      setSuccess('Product updated successfully!');
      if (onProductUpdated) {
        onProductUpdated();
      }
    } catch (err) {
      setError(`Failed to update product: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-4 p-4 bg-white rounded-lg shadow border border-blue-100">
      <h3 className="text-lg font-bold mb-3 text-blue-700 flex items-center gap-2">
        
        Update Product
        
      </h3>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label htmlFor="updateProductName" className="block text-xs font-medium text-gray-700 mb-1">Product Name</label>
          <input
            type="text"
            id="updateProductName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
            required
            className="w-full px-3 py-1.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition text-sm"
            placeholder="Enter product name"
          />
        </div>
        <div>
          <label htmlFor="updateProductPrice" className="block text-xs font-medium text-gray-700 mb-1">Price ($)</label>
          <input
            type="number"
            id="updateProductPrice"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            step="0.01"
            min="0"
            disabled={loading}
            required
            className="w-full px-3 py-1.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition text-sm"
            placeholder="0.00"
          />
        </div>
        {error && <div className="text-red-600 bg-red-50 border border-red-200 rounded p-2 text-xs">{error}</div>}
        {success && <div className="text-green-700 bg-green-50 border border-green-200 rounded p-2 text-xs">{success}</div>}
        <div className="flex gap-2 mt-1">
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded transition disabled:bg-gray-400 disabled:cursor-not-allowed shadow text-xs"
          >
            {loading ? 'Updating...' : 'Update'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded transition disabled:bg-gray-200 disabled:cursor-not-allowed shadow text-xs"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
} 
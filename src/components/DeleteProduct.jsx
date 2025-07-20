// src/components/DeleteProduct.jsx
import { useState } from 'react';
import { invoke } from '@tauri-apps/api/core';

export default function DeleteProduct({ onProductDeleted }) {
  const [productId, setProductId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [deleteMode, setDeleteMode] = useState('full'); // 'full' or 'quantity'

  const handleDelete = async (e) => {
    e.preventDefault();
    
    if (!productId.trim()) {
      setMessage('Please enter a product ID');
      return;
    }

    if (deleteMode === 'quantity' && (!quantity.trim() || parseInt(quantity) <= 0)) {
      setMessage('Please enter a valid quantity to delete');
      return;
    }

    try {
      setLoading(true);
      setMessage('');
      
      if (deleteMode === 'full') {
        await invoke('delete_product', { id: parseInt(productId) });
        setMessage('Product deleted successfully!');
      } else {
        await invoke('delete_product_quantity', { id: parseInt(productId), quantity: parseInt(quantity) });
        setMessage(`Quantity ${quantity} deleted successfully!`);
      }
      
      setProductId('');
      setQuantity('');
      
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
    <div className="bg-black-800 text-white p-6 rounded-lg border border-gray-700 shadow">
      <h3 className="text-xl font-bold mb-4">Delete Product</h3>
      {/* Delete Mode Selection */}
      <div className="mb-4">
        <label className="block mb-2 font-semibold">Delete Mode:</label>
        <div className="flex gap-6">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="deleteMode"
              value="full"
              checked={deleteMode === 'full'}
              onChange={(e) => setDeleteMode(e.target.value)}
              className="accent-blue-600"
            />
            Delete Entire Product
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="deleteMode"
              value="quantity"
              checked={deleteMode === 'quantity'}
              onChange={(e) => setDeleteMode(e.target.value)}
              className="accent-blue-600"
            />
            Delete Specific Quantity
          </label>
        </div>
      </div>
      <form onSubmit={handleDelete} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="productId" className="font-semibold">Product ID:</label>
          <input
            type="number"
            id="productId"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            placeholder="Enter product ID"
            className="bg-gray-800 text-white border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-48"
            disabled={loading}
            required
          />
        </div>
        {deleteMode === 'quantity' && (
          <div className="flex flex-col gap-1">
            <label htmlFor="quantity" className="font-semibold">Quantity to Delete:</label>
            <input
              type="number"
              id="quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Enter quantity to delete"
              min="1"
              className="bg-gray-800 text-white border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-48"
              disabled={loading}
              required
            />
          </div>
        )}
        <button
          type="submit"
          disabled={loading}
          className="bg-red-700 hover:bg-red-600 text-white font-semibold rounded px-4 py-2 transition-colors disabled:bg-gray-600 w-48"
        >
          {loading ? 'Deleting...' : (deleteMode === 'full' ? 'Delete Product' : 'Delete Quantity')}
        </button>
      </form>
      {message && (
        <p className={`mt-4 font-bold rounded px-3 py-2 ${message.includes('Error') ? 'bg-red-800 text-red-100 border border-red-400' : 'bg-green-800 text-green-100 border border-green-400'}`}>
          {message}
        </p>
      )}
    </div>
  );
} 
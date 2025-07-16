// src/components/ProductList.jsx
import { useEffect, useState } from 'react';
import { invoke } from '@tauri-apps/api/core';
import UpdateProduct from './UpdateProduct';

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

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

  const handleEditProduct = (product) => {
    setEditingProduct(product);
  };

  const handleUpdateProduct = () => {
    setEditingProduct(null);
    getAllProducts();
  };

  const handleCancelUpdate = () => {
    setEditingProduct(null);
  };

  useEffect(() => {
    getAllProducts();
  }, []);

  return (
    <div className="max-w-2xl mx-auto mt-8 p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
        <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7M16 3v4M8 3v4m-5 4h18" /></svg>
        Product List
      </h2>
      {editingProduct && (
        <UpdateProduct
          product={editingProduct}
          onProductUpdated={handleUpdateProduct}
          onCancel={handleCancelUpdate}
        />
      )}
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <svg className="animate-spin h-6 w-6 text-blue-500" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>
          <span className="ml-2 text-gray-500 text-sm">Loading...</span>
        </div>
      ) : (
        <ul className="space-y-2">
          {products.map((p) => (
            <li key={p.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-md shadow-sm hover:shadow transition-shadow border border-gray-200">
              <span className="text-base text-gray-700">
                <span className="font-semibold text-blue-600">ID: {p.id}</span> — <span className="font-medium">{p.name}</span> — <span className="text-green-600 font-semibold">${p.price}</span>
              </span>
              <div className="flex gap-1">
                <button
                  onClick={() => handleEditProduct(p)}
                  className="flex items-center gap-1 px-2 py-1 bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-semibold rounded transition-colors shadow-sm border border-yellow-300 text-xs"
                  title="Edit"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-2.828 0L9 13zm-6 6h6" /></svg>
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteProduct(p.id)}
                  className="px-2 py-1 bg-red-500 hover:bg-red-400 text-white font-semibold rounded transition-colors shadow-sm border border-red-400 text-xs"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      {products.length === 0 && !loading && (
        <p className="text-gray-400 italic text-center mt-8 text-sm">No products found.</p>
      )}
    </div>
  );
}


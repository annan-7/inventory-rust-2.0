// src/components/ProductList.jsx
import { useEffect, useState } from 'react';
import { invoke } from '@tauri-apps/api/core';
import UpdateProduct from './UpdateProduct';

export default function ProductList({ onAddToCart }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;

  const getAllProducts = async () => {
    try {
      setLoading(true);
      const result = await invoke('get_products');
      setProducts(result);
      setPage(1); // Reset to first page on fetch
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

  const totalPages = Math.ceil(products.length / PAGE_SIZE);
  const paginated = products.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="max-w-2xl mx-auto mt-8 p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
        
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
          
          <span className="ml-2 text-gray-500 text-sm">Loading...</span>
        </div>
      ) : (
        <>
        <ul className="space-y-2">
          {paginated.map((p) => (
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
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteProduct(p.id)}
                  className="px-2 py-1 bg-red-500 hover:bg-red-400 text-white font-semibold rounded transition-colors shadow-sm border border-red-400 text-xs"
                >
                  Delete
                </button>
                {onAddToCart && (
                  <button
                    onClick={() => onAddToCart(p)}
                    className="px-2 py-1 bg-blue-500 hover:bg-blue-400 text-white font-semibold rounded transition-colors shadow-sm border border-blue-400 text-xs"
                  >
                    Add to Cart
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
        {totalPages > 1 && (
          <div style={{ marginTop: 12, display: 'flex', gap: 8, justifyContent: 'center' }}>
            <button onClick={() => setPage(page - 1)} disabled={page === 1}>Prev</button>
            <span>Page {page} of {totalPages}</span>
            <button onClick={() => setPage(page + 1)} disabled={page === totalPages}>Next</button>
          </div>
        )}
        </>
      )}
      {products.length === 0 && !loading && (
        <p className="text-gray-400 italic text-center mt-8 text-sm">No products found.</p>
      )}
    </div>
  );
}

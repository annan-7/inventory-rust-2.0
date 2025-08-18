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
      console.error('Error al obtener productos:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm(`¿Está seguro de que desea eliminar el producto con ID ${productId}?`)) {
      try {
        await invoke('delete_product', { id: productId });
        // Refresh the product list after deletion
        getAllProducts();
      } catch (error) {
        console.error('Error al eliminar el producto:', error);
        alert(`Error al eliminar el producto: ${error}`);
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
    <div className="w-full">
      <h2 className="text-xl font-bold mb-4 text-gray-100 flex items-center gap-2">Lista de Productos</h2>
      {editingProduct && (
        <UpdateProduct
          product={editingProduct}
          onProductUpdated={handleUpdateProduct}
          onCancel={handleCancelUpdate}
        />
      )}
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <span className="ml-2 text-gray-400 text-sm">Cargando...</span>
        </div>
      ) : (
        <>
        <ul className="space-y-2">
          {paginated.map((p) => (
            <li key={p.id} className="flex justify-between items-center p-4 bg-gray-800 rounded-md shadow-sm hover:shadow transition-shadow border border-gray-700">
              <span className="text-base text-gray-100">
                <span className="font-semibold text-blue-400">ID: {p.id}</span> — <span className="font-medium">{p.name}</span> — <span className="text-green-400 font-semibold">${p.price}</span> — <span className="text-purple-300 font-semibold">Cant: {p.quantity}</span>
              </span>
              <div className="flex gap-1">
                <button
                  onClick={() => handleEditProduct(p)}
                  className="flex items-center gap-1 px-2 py-1 bg-yellow-600 hover:bg-yellow-500 text-gray-900 font-semibold rounded transition-colors shadow-sm border border-yellow-400 text-xs"
                  title="Editar"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDeleteProduct(p.id)}
                  className="px-2 py-1 bg-red-700 hover:bg-red-600 text-white font-semibold rounded transition-colors shadow-sm border border-red-400 text-xs"
                >
                  Eliminar
                </button>
                {onAddToCart && (
                  <button
                    onClick={() => onAddToCart(p)}
                    className="px-2 py-1 bg-blue-700 hover:bg-blue-600 text-white font-semibold rounded transition-colors shadow-sm border border-blue-400 text-xs"
                  >
                    Añadir al Carrito
                    
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>

        
        {totalPages > 1 && (

          
          
          <div className="mt-4 flex gap-4 justify-center items-center">
            <button onClick={() => setPage(page - 1)} disabled={page === 1} className="px-3 py-1 rounded bg-gray-700 text-white disabled:opacity-50">Anterior</button>

            
            <span className="text-gray-300">Página {page} de {totalPages}</span>
            
            <button onClick={() => setPage(page + 1)} disabled={page === totalPages} className="px-3 py-1 rounded bg-gray-700 text-white disabled:opacity-50">Siguiente</button>
          </div>

          

          

          
        )}
        </>
      )}
      {products.length === 0 && !loading && (
        <p className="text-gray-400 italic text-center mt-8 text-sm">No se encontraron productos.</p>
      )}
    </div>
  );
}


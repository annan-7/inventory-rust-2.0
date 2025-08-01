import { useEffect, useState } from 'react';
import { invoke } from '@tauri-apps/api/core';

export default function DeletedProductsList() {
  const [deletedProducts, setDeletedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;

  useEffect(() => {
    async function fetchDeletedProducts() {
      setLoading(true);
      setError('');
      try {
        const products = await invoke('get_deleted_products');
        setDeletedProducts(products);
      } catch (err) {
        setError('Error al obtener productos eliminados: ' + err);
      } finally {
        setLoading(false);
      }
    }
    fetchDeletedProducts();
  }, []);

  const totalPages = Math.ceil(deletedProducts.length / PAGE_SIZE);
  const paginated = deletedProducts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="bg-gray-900 text-white p-6 rounded-lg border border-gray-700 shadow">
      <h2 className="text-xl font-bold mb-4">Productos Eliminados (Prueba)</h2>
      {loading && <div>Cargando...</div>}
      {error && <div className="bg-red-800 text-red-100 border border-red-400 rounded px-3 py-2">{error}</div>}
      {!loading && !error && (
        <>
          <div className="overflow-x-auto">
            <table className="w-full bg-gray-800 rounded-lg border border-gray-700">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left bg-gray-900 text-gray-200">Nombre</th>
                  <th className="px-4 py-2 text-left bg-gray-900 text-gray-200">Precio</th>
                  <th className="px-4 py-2 text-left bg-gray-900 text-gray-200">Fecha de Eliminación</th>
                </tr>
                
              </thead>

              
              <tbody>
                {paginated.length === 0 ? (
                  <tr><td colSpan="3" className="text-center text-gray-400 py-4">No se encontraron productos eliminados.</td></tr>
                ) : (
                  paginated.map((prod) => (
                    <tr key={prod.id + '-' + prod.deleted_at} className="border-b border-gray-700">
                      <td className="px-4 py-2">{prod.name}</td>
                      <td className="px-4 py-2 text-green-400 font-semibold">${prod.price.toFixed(2)}</td>
                      <td className="px-4 py-2 text-gray-400">{prod.deleted_at}  </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div className="mt-4 flex gap-4 justify-center items-center">

              
              <button onClick={() => setPage(page - 1)} disabled={page === 1} className="px-3 py-1 rounded bg-gray-700 text-white disabled:opacity-50">Anterior</button>
              <span className="text-gray-300">Página {page} de {totalPages}</span>
              <button onClick={() => setPage(page + 1)} disabled={page === totalPages} className="px-3 py-1 rounded bg-gray-700 text-white disabled:opacity-50">Siguiente</button>
            </div>
            
          )}
        </>
      )}
    </div>
  );
} 
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
        setError('Failed to fetch deleted products: ' + err);
      } finally {
        setLoading(false);
      }
    }
    fetchDeletedProducts();
  }, []);

  const totalPages = Math.ceil(deletedProducts.length / PAGE_SIZE);
  const paginated = deletedProducts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="deleted-products-list">
      <h2>Deleted Products (Test)</h2>
      {loading && <div>Loading...</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {!loading && !error && (
        <>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Price</th>
                <th>Date Deleted</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr><td colSpan="3">No deleted products found.</td></tr>
              ) : (
                paginated.map((prod) => (
                  <tr key={prod.id + '-' + prod.deleted_at}>
                    <td>{prod.name}</td>
                    <td>${prod.price.toFixed(2)}</td>
                    <td>{prod.deleted_at}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          {totalPages > 1 && (
            <div style={{ marginTop: 12, display: 'flex', gap: 8, justifyContent: 'center' }}>
              <button onClick={() => setPage(page - 1)} disabled={page === 1}>Prev</button>
              <span>Page {page} of {totalPages}</span>
              <button onClick={() => setPage(page + 1)} disabled={page === totalPages}>Next</button>
            </div>
          )}
        </>
      )}
      <style jsx>{`
        .deleted-products-list {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 20px;
          border: 1px solid #e9ecef;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 10px;
        }
        th, td {
          border: 1px solid #dee2e6;
          padding: 8px 12px;
          text-align: left;
        }
        th {
          background: #343a40;
          color: #fff;
        }
        tr:nth-child(even) {
          background: #f1f3f5;
        }
      `}</style>
    </div>
  );
} 
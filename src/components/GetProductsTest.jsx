// src/components/GetProductsTest.jsx
import { useState } from 'react';
import { invoke } from '@tauri-apps/api/core';

export default function GetProductsTest() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [testResults, setTestResults] = useState([]);

  const testGetProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      setTestResults([]);
      setTestResults(prev => [...prev, { type: 'info', message: 'Starting get_products test...', timestamp: new Date().toISOString() }]);
      const result = await invoke('get_products');
      setTestResults(prev => [...prev, { type: 'success', message: `Successfully retrieved ${result.length} products`, timestamp: new Date().toISOString() }]);
      if (result.length > 0) {
        setTestResults(prev => [...prev, { type: 'info', message: `Products found: ${result.map(p => `ID:${p.id} Name:${p.name} Price:$${p.price} Qty:${p.quantity}`).join(', ')}`, timestamp: new Date().toISOString() }]);
      } else {
        setTestResults(prev => [...prev, { type: 'warning', message: 'No products found in database', timestamp: new Date().toISOString() }]);
      }
      setProducts(result);
    } catch (err) {
      const errorMessage = `Failed to fetch products: ${err}`;
      console.error(errorMessage, err);
      setError(errorMessage);
      setTestResults(prev => [...prev, { type: 'error', message: errorMessage, timestamp: new Date().toISOString() }]);
    } finally {
      setLoading(false);
    }
  };

  const clearTestResults = () => {
    setTestResults([]);
    setError(null);
    setProducts([]);
  };

  const getResultIcon = (type) => {
    switch (type) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      default: return '📝';
    }
  };

  const getResultColor = (type) => {
    switch (type) {
      case 'success': return 'text-green-300 bg-green-900 border-green-700';
      case 'error': return 'text-red-300 bg-red-900 border-red-700';
      case 'warning': return 'text-yellow-300 bg-yellow-900 border-yellow-700';
      case 'info': return 'text-blue-300 bg-blue-900 border-blue-700';
      default: return 'text-gray-300 bg-gray-900 border-gray-700';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-black-800 text-white rounded-lg shadow border border-gray-700">
      <h2 className="text-2xl font-bold mb-6 text-gray-100 flex items-center gap-2">Get Products Test Component</h2>
      <div className="mb-6">
        <div className="flex gap-4 mb-4">
          <button
            onClick={testGetProducts}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-700 hover:bg-blue-600 disabled:bg-gray-600 text-white font-semibold rounded-lg transition-colors shadow-sm"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Testing...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Test get_products
              </>
            )}
          </button>
          <button
            onClick={clearTestResults}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors shadow-sm"
          >
            Clear Results
          </button>
        </div>
        {error && (
          <div className="p-4 bg-red-900 border border-red-700 rounded-lg mb-4">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-red-200">Error:</span>
              <span className="text-red-100">{error}</span>
            </div>
          </div>
        )}
      </div>
      {/* Test Results */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3 text-gray-200">Test Results</h3>
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {testResults.length === 0 ? (
            <p className="text-gray-500 italic text-center py-4">No test results yet. Click "Test get_products" to start.</p>
          ) : (
            testResults.map((result, index) => (
              <div key={index} className={`p-3 rounded-lg border ${getResultColor(result.type)}`}>
                <div className="flex items-start gap-2">
                  <span className="text-sm">{getResultIcon(result.type)}</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{result.message}</p>
                    <p className="text-xs text-gray-400 mt-1">{result.timestamp}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      {/* Products Display */}
      <div>
        <h3 className="text-lg font-semibold mb-3 text-gray-200">Retrieved Products ({products.length})</h3>
        {products.length > 0 ? (
          <div className="grid gap-3">
            {products.map((product) => (
              <div key={product.id} className="p-4 bg-gray-800 rounded-lg border border-gray-700">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-semibold text-blue-400">ID: {product.id}</span>
                    <span className="mx-2 text-gray-500">|</span>
                    <span className="font-medium text-gray-100">{product.name}</span>
                    <span className="mx-2 text-gray-500">|</span>
                    <span className="font-semibold text-green-400">${product.price}</span>
                    <span className="mx-2 text-gray-500">|</span>
                    <span className="font-semibold text-purple-300">Qty: {product.quantity}</span>
                  </div>
                  <div className="text-xs text-gray-400">
                    Raw data: {JSON.stringify(product)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 italic text-center py-4">No products to display</p>
        )}
      </div>
    </div>
  );
} 
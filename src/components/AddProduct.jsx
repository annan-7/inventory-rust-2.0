import { useState } from 'react';
import { invoke } from '@tauri-apps/api/core';

export default function AddProduct({ onProductAdded }) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [quantity, setQuantity] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name.trim() || !price.trim() || !quantity.trim()) {
      setError('Por favor, complete todos los campos');
      return;
    }

    const priceValue = parseFloat(price);
    const quantityValue = parseInt(quantity, 10);
    if (isNaN(priceValue) || priceValue <= 0) {
      setError('Por favor, ingrese un precio válido');
      return;
    }
    if (isNaN(quantityValue) || quantityValue < 0) {
      setError('Por favor, ingrese una cantidad válida');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      await invoke('add_product', { name: name.trim(), price: priceValue, quantity: quantityValue });
      
      setSuccess('¡Producto agregado exitosamente!');
      setName('');
      setPrice('');
      setQuantity('');
      
      // Notify parent component to refresh the product list
      if (onProductAdded) {
        onProductAdded();
      }
    } catch (err) {
      setError(`Error al agregar el producto: ${err}`);
    } finally {
      setLoading(false);
      
    }
  };

  return (
    <div className="bg-gray-900 text-white p-6 rounded-lg border border-gray-700 shadow">
      <h2 className="text-xl font-bold mb-4">Agregar Nuevo Producto</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          
          <label htmlFor="productName" className="font-semibold">Nombre del Producto:</label>
          <input
            type="text"
            id="productName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ingrese el nombre del producto"
            disabled={loading}
            required
            className="bg-gray-800 text-white border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>


        
        <div className="flex flex-col gap-1">
          <label htmlFor="productPrice" className="font-semibold">Precio ($):</label>
          
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
            className="bg-gray-800 text-white border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="productQuantity" className="font-semibold">Cantidad:</label>
          <input
            type="number"
            id="productQuantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="0"
            min="0"
            disabled={loading}
            required
            className="bg-gray-800 text-white border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {error && <div className="bg-red-800 text-red-100 border border-red-400 rounded px-3 py-2">{error}</div>}
        {success && <div className="bg-green-800 text-green-100 border border-green-400 rounded px-3 py-2">{success}</div>}
        <button 
          type="submit" 
          disabled={loading}
          className="bg-blue-700 hover:bg-blue-600 text-white font-semibold rounded px-4 py-2 transition-colors disabled:bg-gray-600"
        >
          {loading ? 'Agregando...' : 'Agregar Producto'}
        </button>
      </form>
    </div>
  );
} 
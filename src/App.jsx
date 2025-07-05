import { useEffect, useState } from 'react';
import { invoke } from '@tauri-apps/api/core';

function App() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [products, setProducts] = useState([]);

  const addProduct = async () => {
    await invoke("add_product", { name, price: parseFloat(price) });
    loadProducts();
  };

  const loadProducts = async () => {
    const result = await invoke("get_products");
    setProducts(result);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <div>
      <h1>Inventory</h1>
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Name" />
      <input value={price} onChange={e => setPrice(e.target.value)} placeholder="Price" type="number" />
      <button onClick={addProduct}>Add Product</button>

      <ul>
        {products.map(p => (
          <li key={p.id}>{p.name} - ${p.price}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;


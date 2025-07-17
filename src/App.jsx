import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";

import ProductList from "./components/ProductList";
import Cart from "./components/Cart";
import CheckoutButton from "./components/CheckoutButton";
import AddProduct from "./components/AddProduct";
import DeleteProduct from "./components/DeleteProduct";
import GetProductsTest from "./components/GetProductsTest";
import DeletedProductsList from "./components/DeletedProductsList";


function InventorySection({ handleProductAdded, handleProductDeleted }) {
  return (
    <div style={{ flex: 1, minWidth: 350 }}>
      <h1>Inventory System</h1>
      
      <AddProduct onProductAdded={handleProductAdded} />
      <DeleteProduct onProductDeleted={handleProductDeleted} />
      <ProductList />
      <div className="mt-8 border-t pt-8">
        <GetProductsTest />
      </div>
      <div className="mt-8 border-t pt-8">
        <h1>List of Sold Products</h1>
        <DeletedProductsList />
      </div>
    </div>
  );
}

function BillingSection() {
  const [invoiceNumber, setInvoiceNumber] = useState(1);
  const [dueDate, setDueDate] = useState("");
  const [billTo, setBillTo] = useState({ name: "", email: "", address: "" });
  const [billFrom, setBillFrom] = useState({ name: "", email: "", address: "" });
  const [itemId, setItemId] = useState("");
  const [itemName, setItemName] = useState("");
  const [itemQty, setItemQty] = useState(1);
  const [item, setItem] = useState(null);
  const [itemList, setItemList] = useState([]);
  const [discount, setDiscount] = useState(0);
  const [currency, setCurrency] = useState("USD (United States Dollar)");
  const TAX_RATE = 19;

  // Get current date
  const currentDate = new Date().toLocaleDateString();

  // Fetch product by id and name
  const fetchProduct = async () => {
    if (!itemId || !itemName) return;
    try {
      const result = await invoke("get_product_by_id_and_name", { id: Number(itemId), name: itemName });
      if (result) {
        setItem({ ...result, quantity: itemQty });
      } else {
        setItem(null);
        alert("Product not found");
      }
    } catch (e) {
      setItem(null);
      alert("Error fetching product");
    }
  };

  const handleAddItem = () => {
    if (item && item.quantity > 0) {
      setItemList([...itemList, { ...item, quantity: itemQty }]);
      setItem(null);
      setItemId("");
      setItemName("");
      setItemQty(1);
    }
  };

  const handleRemoveItem = (idx) => {
    setItemList(itemList.filter((_, i) => i !== idx));
  };

  const subtotal = itemList.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const tax = subtotal * (TAX_RATE / 100);
  const discountAmount = subtotal * (discount / 100);
  const total = subtotal + tax - discountAmount;

  return (
    <div style={{ display: 'flex', gap: 24 }}>
      <div style={{ background: '#222', color: '#fff', borderRadius: 8, padding: 24, flex: 2, maxWidth: 700 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
            <div>Current Date: {currentDate}</div>
            <div style={{ marginTop: 8 }}>
              Due Date: <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} style={{ background: '#333', color: '#fff', border: 'none', borderRadius: 4, padding: 4 }} />
            </div>
          </div>
          <div>
            Invoice Number: <input type="number" min={1} value={invoiceNumber} onChange={e => setInvoiceNumber(e.target.value)} style={{ background: '#333', color: '#fff', border: 'none', borderRadius: 4, padding: 4, width: 60 }} />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
          <div style={{ flex: 1 }}>
            <div>Bill to:</div>
            <input placeholder="Name" value={billTo.name} onChange={e => setBillTo({ ...billTo, name: e.target.value })} style={{ width: '100%', marginBottom: 4, background: '#333', color: '#fff', border: 'none', borderRadius: 4, padding: 4 }} />
            <input placeholder="Email" value={billTo.email} onChange={e => setBillTo({ ...billTo, email: e.target.value })} style={{ width: '100%', marginBottom: 4, background: '#333', color: '#fff', border: 'none', borderRadius: 4, padding: 4 }} />
            <input placeholder="Address" value={billTo.address} onChange={e => setBillTo({ ...billTo, address: e.target.value })} style={{ width: '100%', background: '#333', color: '#fff', border: 'none', borderRadius: 4, padding: 4 }} />
          </div>
          <div style={{ flex: 1 }}>
            <div>Bill from:</div>
            <input placeholder="Name" value={billFrom.name} onChange={e => setBillFrom({ ...billFrom, name: e.target.value })} style={{ width: '100%', marginBottom: 4, background: '#333', color: '#fff', border: 'none', borderRadius: 4, padding: 4 }} />
            <input placeholder="Email" value={billFrom.email} onChange={e => setBillFrom({ ...billFrom, email: e.target.value })} style={{ width: '100%', marginBottom: 4, background: '#333', color: '#fff', border: 'none', borderRadius: 4, padding: 4 }} />
            <input placeholder="Address" value={billFrom.address} onChange={e => setBillFrom({ ...billFrom, address: e.target.value })} style={{ width: '100%', background: '#333', color: '#fff', border: 'none', borderRadius: 4, padding: 4 }} />
          </div>
        </div>
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', gap: 8, fontWeight: 'bold', borderBottom: '1px solid #444', paddingBottom: 4 }}>
            <div style={{ flex: 2 }}>ITEM</div>
            <div style={{ flex: 1 }}>QTY</div>
            <div style={{ flex: 1 }}>PRICE/RATE</div>
            <div style={{ width: 40 }}>ACTION</div>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <input placeholder="ID" value={itemId} onChange={e => setItemId(e.target.value)} style={{ flex: 1, background: '#333', color: '#fff', border: 'none', borderRadius: 4, padding: 4 }} />
            <input placeholder="Name" value={itemName} onChange={e => setItemName(e.target.value)} style={{ flex: 2, background: '#333', color: '#fff', border: 'none', borderRadius: 4, padding: 4 }} />
            <input type="number" min={1} value={itemQty} onChange={e => setItemQty(Number(e.target.value))} style={{ flex: 1, background: '#333', color: '#fff', border: 'none', borderRadius: 4, padding: 4 }} />
            <button onClick={fetchProduct} style={{ background: '#444', color: '#fff', border: 'none', borderRadius: 4, padding: '4px 8px' }}>Get</button>
            <input value={item && item.price ? item.price : ''} readOnly placeholder="Price" style={{ flex: 1, background: '#333', color: '#fff', border: 'none', borderRadius: 4, padding: 4 }} />
            <button onClick={handleAddItem} style={{ background: '#1976d2', color: '#fff', border: 'none', borderRadius: 4, padding: '4px 12px', marginLeft: 4 }}>Add Item</button>
          </div>
        </div>
        <div style={{ marginBottom: 16 }}>
          {itemList.length > 0 && (
            <table style={{ width: '100%', background: '#222', color: '#fff', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #444' }}>
                  <th style={{ textAlign: 'left', padding: 8 }}>Name</th>
                  <th style={{ textAlign: 'left', padding: 8 }}>Qty</th>
                  <th style={{ textAlign: 'left', padding: 8 }}>Price</th>
                  <th style={{ textAlign: 'left', padding: 8 }}>Total</th>
                  <th style={{ textAlign: 'left', padding: 8 }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {itemList.map((it, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #333' }}>
                    <td style={{ padding: 8 }}>{it.name}</td>
                    <td style={{ padding: 8 }}>{it.quantity}</td>
                    <td style={{ padding: 8 }}>${it.price.toFixed(2)}</td>
                    <td style={{ padding: 8 }}>${(it.price * it.quantity).toFixed(2)}</td>
                    <td style={{ padding: 8 }}><button onClick={() => handleRemoveItem(idx)} style={{ background: '#d32f2f', color: '#fff', border: 'none', borderRadius: 4, padding: '2px 8px' }}>🗑️</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
          <div>Subtotal: ${subtotal.toFixed(2)}</div>
          <div>Discount: ({discount}%){discountAmount === 0 ? '' : `(-$${discountAmount.toFixed(2)})`}</div>
          <div>Tax: ({TAX_RATE}%){tax === 0 ? '' : `($${tax.toFixed(2)})`}</div>
          <div style={{ fontWeight: 'bold', fontSize: 18, marginTop: 8 }}>Total: ${total.toFixed(2)}</div>
        </div>
      </div>
      <div style={{ flex: 1, maxWidth: 320, marginTop: 24 }}>
        <button style={{ width: '100%', background: '#1976d2', color: '#fff', border: 'none', borderRadius: 6, padding: '12px 0', fontWeight: 'bold', fontSize: 16, marginBottom: 24 }}>Review Invoice</button>
        <div style={{ marginBottom: 16 }}>
          <div>Currency:</div>
          <select value={currency} onChange={e => setCurrency(e.target.value)} style={{ width: '100%', background: '#222', color: '#fff', border: '1px solid #444', borderRadius: 4, padding: 6 }}>
            <option>USD (United States Dollar)</option>
            <option>EUR (Euro)</option>
            <option>GBP (British Pound)</option>
          </select>
        </div>
        <div style={{ marginBottom: 16 }}>
          <div>Tax rate:</div>
          <input type="number" value={TAX_RATE} readOnly style={{ width: '100%', background: '#222', color: '#fff', border: '1px solid #444', borderRadius: 4, padding: 6 }} />
        </div>
        <div style={{ marginBottom: 16 }}>
          <div>Discount rate:</div>
          <input type="number" value={discount} onChange={e => setDiscount(Number(e.target.value))} style={{ width: '100%', background: '#222', color: '#fff', border: '1px solid #444', borderRadius: 4, padding: 6 }} />
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);

  const fetchProducts = async () => {
    const result = await invoke("get_products");
    setProducts(result);
  };

  const handleProductAdded = () => {
    fetchProducts(); // Refresh the product list when a new product is added
  };

  const handleProductDeleted = () => {
    fetchProducts(); // Refresh the product list when a product is deleted
  };

  const addToCart = (product) => {
    const existing = cart.find((p) => p.product_name === product.name);
    if (existing) {
      setCart(cart.map((item) =>
        item.product_name === product.name
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, {
        product_name: product.name,
        quantity: 1,
        price_per_item: product.price
      }]);
    }
  };

  const clearCart = () => setCart([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <Router>
      <nav style={{ display: 'flex', gap: '2rem', marginBottom: 24 }}>
        <Link to="/inventory">Inventory</Link>
        <Link to="/billing">Billing</Link>
      </nav>
      <Routes>
        <Route path="/inventory" element={<InventorySection handleProductAdded={handleProductAdded} handleProductDeleted={handleProductDeleted} />} />
        <Route path="/billing" element={<BillingSection />} />
        <Route path="*" element={<Navigate to="/inventory" replace />} />
      </Routes>
    </Router>
  );
}


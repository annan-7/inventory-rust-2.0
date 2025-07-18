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

import Bill from "./components/Bill";


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

function BillingSection({ handleProductDeleted }) {
  const [dueDate, setDueDate] = useState("");
  const [billFrom, setBillFrom] = useState({ name: "", email: "", address: "" });
  const [itemId, setItemId] = useState("");
  const [itemQty, setItemQty] = useState(1);
  const [item, setItem] = useState(null);
  const [itemList, setItemList] = useState([]);
  const [discount, setDiscount] = useState(0);
  const [shopName, setShopName] = useState("Example Shop");

  const TAX_RATE = 19;

  // Get current date
  const currentDate = new Date().toLocaleDateString();

  // Fetch product by id only
  const fetchProduct = async () => {
    if (!itemId) return;
    try {
      const result = await invoke("get_product_by_id", { id: Number(itemId) });
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

  const handleAddItem = async () => {
    if (item && item.quantity > 0) {
      // Add to bill
      setItemList([...itemList, { ...item, quantity: itemQty }]);
      
      // Delete the product from inventory (sell it)
      try {
        await invoke("delete_product", { id: item.id });
        if (handleProductDeleted) {
          handleProductDeleted();
        }
      } catch (e) {
        alert("Error selling product: " + e);
      }
      
      setItem(null);
      setItemId("");
      setItemQty(1);
    }
  };

  const subtotal = itemList.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const tax = subtotal * (TAX_RATE / 100);
  const discountAmount = subtotal * (discount / 100);
  const total = subtotal + tax - discountAmount;

  return (
    <div style={{ display: 'flex', gap: 24 }}>
      <div style={{ flex: 1 }}>
        <div style={{ background: '#222', color: '#fff', borderRadius: 8, padding: 24, marginBottom: 24 }}>
          <h2 style={{ marginTop: 0 }}>Add Products to Bill</h2>
          
          {/* Shop Name */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 4 }}>Shop Name:</label>
            <input
              type="text"
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
              style={{ width: '100%', background: '#333', color: '#fff', border: 'none', borderRadius: 4, padding: 8 }}
            />
          </div>

          {/* Product Selection */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: 4 }}>Product ID:</label>
              <input
                placeholder="Enter Product ID"
                value={itemId}
                onChange={(e) => setItemId(e.target.value)}
                style={{ width: '100%', background: '#333', color: '#fff', border: 'none', borderRadius: 4, padding: 8 }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: 4 }}>Quantity:</label>
              <input
                type="number"
                min="1"
                value={itemQty}
                onChange={(e) => setItemQty(Number(e.target.value))}
                style={{ width: '100%', background: '#333', color: '#fff', border: 'none', borderRadius: 4, padding: 8 }}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'end', gap: 8 }}>
              <button
                onClick={fetchProduct}
                style={{ background: '#444', color: '#fff', border: 'none', borderRadius: 4, padding: '8px 16px' }}
              >
                Get Product
              </button>
              <button
                onClick={handleAddItem}
                style={{ background: '#1976d2', color: '#fff', border: 'none', borderRadius: 4, padding: '8px 16px' }}
              >
                Sell Item
              </button>
            </div>
          </div>

          {/* Product Info */}
          {item && (
            <div style={{ padding: 12, background: '#333', borderRadius: 4, marginBottom: 16 }}>
              <div><strong>Product:</strong> {item.name}</div>
              <div><strong>Price:</strong> ${item.price.toFixed(2)}</div>
              <div><strong>Available Quantity:</strong> {item.quantity}</div>
            </div>
          )}
        </div>

        {/* Bill Display */}
        <Bill itemList={itemList} setItemList={setItemList} shopName={shopName} />
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
        <Route path="/billing" element={<BillingSection handleProductDeleted={handleProductDeleted} />} />
        <Route path="*" element={<Navigate to="/inventory" replace />} />
      </Routes>
    </Router>
  );
}


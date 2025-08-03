import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from "react-router-dom";

import ProductList from "./components/ProductList";
import Cart from "./components/Cart";
import CheckoutButton from "./components/CheckoutButton";
import AddProduct from "./components/AddProduct";
import DeleteProduct from "./components/DeleteProduct";
import GetProductsTest from "./components/GetProductsTest";
import DeletedProductsList from "./components/DeletedProductsList";

import Bill from "./components/Bill";

// Navigation Component
function Navigation() {
  const location = useLocation();
  
  return (
    <nav className="bg-black-700 border-b border-gray-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <span className="text-xl font-bold text-white">Inventory Pro</span>
              </div>
            </div>
          </div>

          {/* Navigation Links - Centered */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link
                to="/inventory"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === '/inventory'
                    ? 'bg-blue-700 text-white'
                    : 'text-gray-300 hover:text-white hover:bg-gray-700'
                }`}
              >
                Inventory
              </Link>
              <Link
                to="/billing"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === '/billing'
                    ? 'bg-blue-700 text-white'
                    : 'text-gray-300 hover:text-white hover:bg-gray-700'
                }`}
              >
                Billing
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button className="text-gray-300 hover:text-white hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

function InventorySection({ handleProductAdded, handleProductDeleted }) {
  return (
    <div className="flex flex-col gap-8 w-full max-w-5xl mx-auto p-4 bg-black-600">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <h1 className="text-3xl font-bold text-white tracking-tight">Inventory System</h1>
        
      </div>

      {/* Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-black-600 rounded-xl shadow p-6 border border-gray-100">
          <AddProduct onProductAdded={handleProductAdded} />
        </div>
        <div className="bg-black-600 rounded-xl shadow p-6 border border-gray-100">
          <DeleteProduct onProductDeleted={handleProductDeleted} />
        </div>
      </div>

      {/* Product List */}
      <div className="bg-black-600 rounded-xl shadow p-6 border border-gray-100">
        <ProductList />
      </div>

      {/* Test & Sold Products */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="bg-black-600 rounded-xl shadow p-6 border border-gray-100">
          <GetProductsTest />
        </div>
        <div className="bg-black-600 rounded-xl shadow p-6 border border-gray-100">
          <h2 className="text-xl font-bold mb-4 text-white">List of Sold Products</h2>
          <DeletedProductsList />
        </div>
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
  const [isBillActive, setIsBillActive] = useState(false);
  const [loading, setLoading] = useState(false);

  const TAX_RATE = 19;

  // Get current date
  const currentDate = new Date().toLocaleDateString();

  // Fetch product by id only
  const fetchProduct = async () => {
    if (!itemId) return;
    setLoading(true);
    try {
      const result = await invoke("get_product_by_id", { id: Number(itemId) });
      if (result) {
        setItem({ ...result, quantity: itemQty });
        setIsBillActive(true); // Activate bill when product is found
      } else {
        setItem(null);
        setIsBillActive(false);
        alert("Product not found");
      }
    } catch (e) {
      setItem(null);
      setIsBillActive(false);
      alert("Error fetching product");
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async () => {
    if (item && item.quantity > 0) {
      // Add to bill
      setItemList([...itemList, { ...item, quantity: itemQty }]);
      setIsBillActive(true); // Keep bill active when items are added
      
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
                disabled={loading}
                style={{ 
                  background: loading ? '#666' : '#444', 
                  color: '#fff', 
                  border: 'none', 
                  borderRadius: 4, 
                  padding: '8px 16px',
                  cursor: loading ? 'not-allowed' : 'pointer'
                }}
              >
                {loading ? 'Loading...' : 'Get Product'}
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
            <div style={{ 
              padding: 12, 
              background: '#28a745', 
              borderRadius: 4, 
              marginBottom: 16,
              border: '2px solid #20c997',
              animation: 'pulse 2s infinite'
              
            }}>
              <div style={{ color: 'white', fontWeight: 'bold' }}>✅ Product Found!</div>
              <div style={{ color: 'white' }}><strong>Product:</strong> {item.name}</div>
              <div style={{ color: 'white' }}><strong>Price:</strong> ${item.price.toFixed(2)}</div>
              <div style={{ color: 'white' }}><strong>Available Quantity:</strong> {item.quantity}</div>
            </div>
          )}
        </div>

        {/* Bill Display */      }
        
        <div className={`transition-all duration-300 ${isBillActive ? 'opacity-100 scale-100' : 'opacity-50 scale-95'}`}>
          <Bill 
            itemList={itemList} 
            setItemList={setItemList} 
            shopName={shopName}
            isActive={isBillActive}
          />
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
      <div className="min-h-screen bg-black-700">
        <Navigation />
        <main className="py-8">
          <Routes>
            <Route path="/inventory" element={<InventorySection handleProductAdded={handleProductAdded} handleProductDeleted={handleProductDeleted} />} />
            <Route path="/billing" element={<BillingSection handleProductDeleted={handleProductDeleted} />} />
            <Route path="*" element={<Navigate to="/inventory" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}


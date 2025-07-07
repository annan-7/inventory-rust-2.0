import { useEffect, useState } from "react";
//import { invoke } from "@tauri-apps/api/core";
import { invoke } from "@tauri-apps/api/tauri";

import ProductList from "./components/ProductList";
import Cart from "./components/Cart";
import CheckoutButton from "./components/CheckoutButton";

export default function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);

  const fetchProducts = async () => {
    const result = await invoke("get_products");
    setProducts(result);
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
    <div>
      <h1>🧾 Billing Interface</h1>
      
      <Cart cart={cart} setCart={setCart} />
      <CheckoutButton cart={cart} clearCart={clearCart} />
      <div>
      <h1>Inventory System</h1>
      <ProductList />
    </div>
    </div>
  );
}


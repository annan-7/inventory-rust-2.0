export default function Cart({ cart, setCart }) {
  const updateQuantity = (productName, delta) => {
    setCart(cart.map(item =>
      item.product_name === productName
        ? { ...item, quantity: Math.max(1, item.quantity + delta) }

        
        : item
    ));
  };

  const total = cart.reduce(
    
    (sum, item)    => sum + item.quantity * item.price_per_item, 0);

  return (
    <div>
      <h2>Cart  </h2>
      
      {cart.map(item => (
        <div key={item.product_name}>
          {item.product_name} x {item.quantity} @ ${item.price_per_item.toFixed(2)}




          <button onClick={() => updateQuantity(item.product_name, 1)}>+</button>
          
          <button onClick={() => updateQuantity(item.product_name, -1)}>-</button>
        </div>

        
      ))}
      <h3>Total: ${total.toFixed(2)}</h3>
    </div>
  );
}

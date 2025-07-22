import { invoke } from "@tauri-apps/api/core";

export default function CheckoutButton({ cart, clearCart }) {
  const handleCheckout = async () => {
    if (cart.length === 0) {
      alert("Cart is empty.");
      return;
    }

    try {
      await invoke("create_bill", { items: cart });
      alert("Bill saved!");
      clearCart();
    } catch (err) {
      alert("Error: " + err);
    }
  };

  return (
    <button onClick={handleCheckout} style={{ marginTop: "10px" }}>
      ✅ Checkout
    </button>
  );
}

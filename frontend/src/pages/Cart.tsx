import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import CartItem from "../components/CartItem";
import { api } from "../api/client";
import type { CartLine } from "../types";

export default function Cart() {
  const [cart, setCart] = useState<CartLine[]>(() => JSON.parse(localStorage.getItem("smartmenuai_cart") ?? "[]"));
  const navigate = useNavigate();
  const total = useMemo(() => cart.reduce((sum, line) => sum + line.product.price * line.quantity, 0), [cart]);
  function saveCart(nextCart: CartLine[]) { setCart(nextCart); localStorage.setItem("smartmenuai_cart", JSON.stringify(nextCart)); }
  async function submitOrder() { const response = await api.post("/orders", { tableId: localStorage.getItem("smartmenuai_table_id"), items: cart.map((line) => ({ productId: line.product.id, quantity: line.quantity })) }); localStorage.removeItem("smartmenuai_cart"); navigate(`/order-confirmation/${response.data.id}`); }
  return <section><div className="section-heading"><h1>Cart</h1><strong>${total.toFixed(2)}</strong></div>{cart.length === 0 ? <p>Your cart is empty.</p> : cart.map((line) => <CartItem key={line.product.id} line={line} onQuantityChange={(quantity) => saveCart(cart.map((item) => item.product.id === line.product.id ? { ...item, quantity } : item))} onRemove={() => saveCart(cart.filter((item) => item.product.id !== line.product.id))} />)}<button className="primary-action" disabled={cart.length === 0} onClick={submitOrder}>Place Order</button></section>;
}

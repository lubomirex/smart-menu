import { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import CartItem from "../components/CartItem";
import { api } from "../api/client";
import type { CartLine, Order, OrderStatus } from "../types";
import { readGuestCart, readGuestOrderHistory, saveGuestCart, saveGuestOrderHistory } from "../utils/guestStorage";

type StoredOrder = {
  id: string;
  createdAt: string;
  totalPrice: number;
  status: OrderStatus;
  itemCount: number;
  items?: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
};

export default function Cart() {
  const [cart, setCart] = useState<CartLine[]>(readGuestCart);
  const [history, setHistory] = useState<StoredOrder[]>(() => readGuestOrderHistory<StoredOrder>());
  const location = useLocation();
  const navigate = useNavigate();
  const isAdminPreview = new URLSearchParams(location.search).get("preview") === "admin";
  const menuTarget = isAdminPreview ? "/?preview=admin" : "/menu";
  const historyTarget = isAdminPreview ? "/order-history?preview=admin" : "/order-history";
  const total = useMemo(() => cart.reduce((sum, line) => sum + line.product.price * line.quantity, 0), [cart]);
  const itemCount = useMemo(() => cart.reduce((sum, line) => sum + line.quantity, 0), [cart]);

  function saveCart(nextCart: CartLine[]) {
    setCart(nextCart);
    saveGuestCart(nextCart);
  }

  function saveOrderHistory(order: Order) {
    const nextHistory = [
      {
        id: order.id,
        createdAt: order.createdAt,
        totalPrice: order.totalPrice,
        status: order.status,
        itemCount: order.items.reduce((sum, item) => sum + item.quantity, 0),
        items: order.items.map((item) => ({
          name: item.product.name,
          quantity: item.quantity,
          price: item.price
        }))
      },
      ...history
    ].slice(0, 8);
    setHistory(nextHistory);
    saveGuestOrderHistory(nextHistory);
  }

  async function submitOrder() {
    const response = await api.post<Order>("/orders", {
      tableId: localStorage.getItem("smartmenuai_table_id"),
      items: cart.map((line) => ({ productId: line.product.id, quantity: line.quantity }))
    });
    saveOrderHistory(response.data);
    saveCart([]);
    navigate(`/order-confirmation/${response.data.id}${isAdminPreview ? "?preview=admin" : ""}`);
  }

  return (
    <section className="cart-page">
      <div className="cart-page-heading">
        <p className="eyebrow">Objednávka</p>
        <h1>Košík</h1>
        <div className="cart-links">
          <Link to={menuTarget} className="text-link">Späť do menu</Link>
          <Link to={historyTarget} className="text-link">História objednávok</Link>
        </div>
      </div>

      {cart.length === 0 ? (
        <div className="empty-cart-message">
          <strong>Košík je prázdny</strong>
          <span>Vyberte si nápoj alebo dezert z menu.</span>
          <Link to={menuTarget} className="primary-action">Otvoriť menu</Link>
        </div>
      ) : (
        <>
          <div className="cart-items-list">
            {cart.map((line) => (
              <CartItem
                key={line.product.id}
                line={line}
                onQuantityChange={(quantity) => saveCart(cart.map((item) => item.product.id === line.product.id ? { ...item, quantity } : item))}
                onRemove={() => saveCart(cart.filter((item) => item.product.id !== line.product.id))}
              />
            ))}
          </div>

          <section className="cart-summary">
            <div className="summary-total"><span>Spolu</span><strong>{total.toFixed(2)} €</strong></div>
          </section>

          <div className="cart-submit-bar">
            <div>
              <span>{itemCount} položiek</span>
              <strong>{total.toFixed(2)} €</strong>
            </div>
            <button onClick={submitOrder}>Odoslať objednávku</button>
          </div>
        </>
      )}
    </section>
  );
}

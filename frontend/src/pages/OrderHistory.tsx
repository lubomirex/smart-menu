import { Link, useLocation } from "react-router-dom";
import { readGuestOrderHistory } from "../utils/guestStorage";
import { getOrderStatusLabel } from "../utils/orderStatus";
import type { OrderStatus } from "../types";

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

export default function OrderHistory() {
  const location = useLocation();
  const isAdminPreview = new URLSearchParams(location.search).get("preview") === "admin";
  const history = readGuestOrderHistory<StoredOrder>();

  return (
    <section className="guest-history-page">
      <div className="cart-page-heading">
        <p className="eyebrow">Moje objednávky</p>
        <h1>História objednávok</h1>
        <div className="cart-links">
          <Link to={isAdminPreview ? "/?preview=admin" : "/menu"} className="text-link">Späť do menu</Link>
          <Link to={isAdminPreview ? "/cart?preview=admin" : "/cart"} className="text-link">Späť do košíka</Link>
        </div>
      </div>

      {history.length === 0 ? <p className="empty-cart-message">Zatiaľ tu nie je žiadna objednávka.</p> : (
        <div className="guest-history-list">
          {history.map((order) => (
            <article key={order.id} className="history-row">
              <div className="history-order-main">
                <strong>Objednávka #{order.id.slice(0, 8)}</strong>
                <span>{new Date(order.createdAt).toLocaleString("sk-SK")}</span>
                {order.items && order.items.length > 0 ? (
                  <ul className="history-items">
                    {order.items.map((item, index) => (
                      <li key={`${order.id}-${item.name}-${index}`}>
                        <span>{item.quantity}x {item.name}</span>
                        <strong>{(item.price * item.quantity).toFixed(2)} €</strong>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <span>{order.itemCount} položiek</span>
                )}
              </div>
              <span className={`status-pill status-${order.status.toLowerCase()}`}>{getOrderStatusLabel(order.status)}</span>
              <strong>{order.totalPrice.toFixed(2)} €</strong>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

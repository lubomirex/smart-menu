import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { api } from "../api/client";
import type { Order } from "../types";
import { getOrderStatusLabel } from "../utils/orderStatus";

export default function OrderConfirmation() {
  const { id } = useParams();
  const location = useLocation();
  const isAdminPreview = new URLSearchParams(location.search).get("preview") === "admin";
  const menuTarget = isAdminPreview ? "/?preview=admin" : "/menu";
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (id) api.get<Order>(`/orders/${id}`).then((response) => setOrder(response.data));
  }, [id]);

  return (
    <section className="confirmation">
      <p className="eyebrow">Objednávka prijatá</p>
      <h1>Ďakujeme</h1>
      {order ? (
        <p>
          Objednávka #{order.id.slice(0, 8)} má stav {getOrderStatusLabel(order.status)} a sumu {order.totalPrice.toFixed(2)} €.
        </p>
      ) : (
        <p>Načítavam objednávku...</p>
      )}
      <Link to={menuTarget} className="primary-action">Späť na menu</Link>
    </section>
  );
}

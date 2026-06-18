import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../api/client";
import type { Order } from "../types";

export default function OrderConfirmation() {
  const { id } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  useEffect(() => { if (id) api.get<Order>(`/orders/${id}`).then((response) => setOrder(response.data)); }, [id]);
  return <section className="confirmation"><p className="eyebrow">Order received</p><h1>Thank you</h1>{order ? <p>Order {order.id.slice(0, 8)} is {order.status.toLowerCase()} with a total of ${order.totalPrice.toFixed(2)}.</p> : <p>Loading order...</p>}<Link to="/menu" className="primary-action">Order More</Link></section>;
}

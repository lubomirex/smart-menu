import { useEffect, useState } from "react";
import OrderTable from "../components/OrderTable";
import { api } from "../api/client";
import type { Order } from "../types";

export default function OrderManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  async function loadOrders() { const response = await api.get<Order[]>("/orders"); setOrders(response.data); }
  useEffect(() => { loadOrders(); }, []);
  async function updateStatus(orderId: string, status: string) { await api.put(`/orders/${orderId}/status`, { status }); loadOrders(); }
  return <section><div className="section-heading"><h1>Order Management</h1></div><OrderTable orders={orders} onStatusChange={updateStatus} /></section>;
}

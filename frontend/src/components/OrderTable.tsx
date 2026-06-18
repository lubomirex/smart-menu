import type { Order } from "../types";

const statuses = ["PENDING", "CONFIRMED", "PREPARING", "READY", "COMPLETED", "CANCELLED"];

export default function OrderTable({ orders, onStatusChange }: { orders: Order[]; onStatusChange?: (orderId: string, status: string) => void }) {
  return <div className="table-scroll"><table className="order-table"><thead><tr><th>Order</th><th>Table</th><th>Customer</th><th>Total</th><th>Status</th><th>Created</th></tr></thead><tbody>{orders.map((order) => <tr key={order.id}><td>{order.id.slice(0, 8)}</td><td>{order.table?.number ?? "-"}</td><td>{order.customer?.email ?? "Guest"}</td><td>${order.totalPrice.toFixed(2)}</td><td>{onStatusChange ? <select value={order.status} onChange={(event) => onStatusChange(order.id, event.target.value)}>{statuses.map((status) => <option key={status} value={status}>{status}</option>)}</select> : order.status}</td><td>{new Date(order.createdAt).toLocaleString()}</td></tr>)}</tbody></table></div>;
}

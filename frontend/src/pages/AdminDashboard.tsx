import { Link } from "react-router-dom";

export default function AdminDashboard() {
  return <section><div className="section-heading"><h1>Admin Dashboard</h1><p>Manage menu operations from one place.</p></div><div className="admin-grid"><Link to="/admin/products" className="admin-tile"><strong>Product Management</strong><span>Create and update dishes.</span></Link><Link to="/admin/orders" className="admin-tile"><strong>Order Management</strong><span>Track kitchen workflow.</span></Link></div></section>;
}

import { Link } from "react-router-dom";

export default function AdminDashboard() {
  return (
    <section className="admin-dashboard-page">
      <div className="section-heading">
        <h1>Admin Dashboard</h1>
        <p>Správa ponuky, objednávok a prevádzky na jednom mieste.</p>
      </div>
      <div className="admin-grid">
        <Link to="/admin/products" className="admin-tile">
          <strong>Správa ponuky</strong>
          <span>Pridávajte, upravujte a skrývajte produkty.</span>
        </Link>
        <Link to="/admin/orders" className="admin-tile">
          <strong>Správa objednávok</strong>
          <span>Sledujte objednávky a meníte ich stav.</span>
        </Link>
      </div>
    </section>
  );
}

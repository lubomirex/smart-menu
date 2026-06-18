import { Link } from "react-router-dom";

export default function Home() {
  return <section className="hero-section"><div className="hero-copy"><p className="eyebrow">QR ordering for modern hospitality</p><h1>SmartMenuAI</h1><p>Launch table-side ordering, menu browsing, and recommendation workflows for restaurants and cafes.</p><div className="hero-actions"><Link to="/menu" className="primary-action">Browse Menu</Link><Link to="/admin" className="secondary-action">Open Admin</Link></div></div><div className="service-panel"><div><span>Average order flow</span><strong>Scan, choose, confirm</strong></div><div><span>Recommendations</span><strong>Category and cart aware</strong></div><div><span>Operations</span><strong>Products, tables, orders</strong></div></div></section>;
}

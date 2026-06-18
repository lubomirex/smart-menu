import { NavLink } from "react-router-dom";

const links = [{ to: "/", label: "Home" }, { to: "/menu", label: "Menu" }, { to: "/cart", label: "Cart" }, { to: "/admin", label: "Admin" }];

export default function Navbar() {
  return <header className="topbar"><NavLink to="/" className="brand">SmartMenuAI</NavLink><nav className="nav-links" aria-label="Primary navigation">{links.map((link) => <NavLink key={link.to} to={link.to} className={({ isActive }) => isActive ? "active" : undefined}>{link.label}</NavLink>)}</nav><div className="auth-links"><NavLink to="/login">Login</NavLink><NavLink to="/register" className="button-link">Register</NavLink></div></header>;
}

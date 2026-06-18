import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import type { CartLine } from "../types";
import { readGuestCart } from "../utils/guestStorage";

export default function FloatingCartWidget() {
  const [cart, setCart] = useState<CartLine[]>(readGuestCart);
  const location = useLocation();
  const isGuestArea = ["/", "/menu", "/cart"].includes(location.pathname) || location.pathname.startsWith("/products/") || location.pathname.startsWith("/order-confirmation/");
  const isAdminPreview = new URLSearchParams(location.search).get("preview") === "admin";
  const cartTarget = isAdminPreview ? "/cart?preview=admin" : "/cart";
  const quantity = useMemo(() => cart.reduce((sum, line) => sum + line.quantity, 0), [cart]);
  const total = useMemo(() => cart.reduce((sum, line) => sum + line.product.price * line.quantity, 0), [cart]);

  useEffect(() => {
    const refresh = () => setCart(readGuestCart());
    window.addEventListener("storage", refresh);
    window.addEventListener("smartmenuai-cart-updated", refresh);
    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener("smartmenuai-cart-updated", refresh);
    };
  }, []);

  if (!isGuestArea || location.pathname === "/cart") return null;

  if (quantity === 0) {
    return (
      <Link to={cartTarget} className="floating-cart floating-cart-empty" aria-label="Otvoriť prázdny košík">
        <span>
          <strong>Košík je prázdny</strong>
          <small>Vyberte si z ponuky</small>
        </span>
      </Link>
    );
  }

  return (
    <Link to={cartTarget} className="floating-cart" aria-label="Otvoriť košík">
      <span className="floating-cart-count">{quantity}</span>
      <span>
        <strong>Pozrieť košík</strong>
        <small>{total.toFixed(2)} €</small>
      </span>
    </Link>
  );
}

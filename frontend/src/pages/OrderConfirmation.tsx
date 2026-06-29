import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { api } from "../api/client";
import type { Order } from "../types";
import { getOrderStatusLabel } from "../utils/orderStatus";
import { QRCodeSVG } from "qrcode.react"; // Inštalované cez npm install qrcode.react
import ApplePayButton from "apple-pay-button";


// Pomocná funkcia na vytvorenie EPC QR formátu pre bankové aplikácie
function generateEPCQRText(iban: string, recipientName: string, amount: number, variableSymbol: string) {
  const formattedAmount = amount.toFixed(2);
  return [
    "BCD",
    "002",
    "1",
    "SCT",
    "", 
    recipientName,
    iban,
    `EUR${formattedAmount}`,
    "", 
    variableSymbol, 
    `Objednavka ${variableSymbol}`
  ].join("\n");
}

export default function OrderConfirmation() {
  const { id } = useParams();
  const location = useLocation();
  const isAdminPreview = new URLSearchParams(location.search).get("preview") === "admin";
  const menuTarget = isAdminPreview ? "/?preview=admin" : "/menu";
  
  const [order, setOrder] = useState<Order | null>(null);
  const [isQRDrawerOpen, setIsQRDrawerOpen] = useState(false); // Stav pre vysúvací panel

  useEffect(() => {
    if (id) api.get<Order>(`/orders/${id}`).then((response) => setOrder(response.data));
  }, [id]);

  const qrText = order
    ? generateEPCQRText(
        "SK1209000000001234567890", // sem zadajte IBAN účtu, na ktorý sa má platiť
        "Smart Menu s.r.o.",         // Názov firmy
        order.totalPrice,
        order.id.slice(0, 8)         // variable symbol - napr ID objednavky
      )
    : "";

  return (
    <section className="guest-history-page">
      <div className="cart-page-heading">
        <p className="eyebrow">Objednávka prijatá</p>
        <h1>Ďakujeme</h1>
        <div className="cart-links">
          <Link to={menuTarget} className="text-link">Späť do menu</Link>
          <Link to={isAdminPreview ? "/history?preview=admin" : "/history"} className="text-link">Moje objednávky</Link>
        </div>
      </div>

      {order ? (
        <div className="guest-history-list">
          <article className="history-row">
            <div className="history-order-main">
              <strong>Objednávka #{order.id.slice(0, 8)}</strong>
              <span>Vaša objednávka bola úspešne prijatá.</span>
            </div>
            <span className={`status-pill status-${order.status.toLowerCase()}`}>{getOrderStatusLabel(order.status)}</span>
            <strong>{order.totalPrice.toFixed(2)} €</strong>

            <div style={{ gridColumn: "1 / -1", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginTop: "0.5rem", width: "100%" }}>
              <div style={{ display: "flex", width: "100%", height: "44px" }}>
                <ApplePayButton onClick={() => {
                  }} style={{ width: "100%", height: "100%", borderRadius: "8px" }} /> 
              </div>

              <button 
                className="qr-trigger-btn"
                onClick={() => setIsQRDrawerOpen(true)}
                style={{ margin: 0, width: "100%", height: "44px", justifyContent: "center", borderRadius: "8px", boxSizing: "border-box", display: "flex", alignItems: "center" }}
              >
                <span>📱</span> Zaplatiť QR kódom
              </button>
            </div>
          </article>
        </div>
      ) : (
        <p className="empty-cart-message">Načítavam objednávku...</p>
      )}

      {/* --- VYSUVACÍ PANEL --- */}
      <div 
        className={`qr-drawer-overlay ${isQRDrawerOpen ? "active" : ""}`}
        onClick={() => setIsQRDrawerOpen(false)}
      />

      {/* Samotný panel s QR kódom */}
      <div className={`qr-drawer ${isQRDrawerOpen ? "active" : ""}`}>
        <div className="qr-drawer-content">
          <h3>Platba QR kódom</h3>
          <p>Naskenujte kód vo vašej bankovej aplikácii pre rýchlu platbu prevodom.</p>
          
          {order && (
            <div style={{ background: "white", padding: "12px", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>
              <QRCodeSVG value={qrText} size={220} includeMargin={true} />
            </div>
          )}
          
          {order && (
            <p style={{ fontSize: "0.85rem", marginTop: "0.5rem" }}>
              Suma: <b>{order.totalPrice.toFixed(2)} €</b> | VS: <b>{order.id.slice(0, 8)}</b>
            </p>
          )}

          <button 
            className="qr-close-btn"
            onClick={() => setIsQRDrawerOpen(false)}
          >
            Zatvoriť
          </button>
        </div>
      </div>
    </section>
  );
}
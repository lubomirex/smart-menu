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
    <section className="confirmation">
      <p className="eyebrow">Objednávka prijatá</p>
      <h1>Ďakujeme</h1>
      {order ? (
        <>
          <p>
            Objednávka #{order.id.slice(0, 8)} bola prijatá. <br />
            Stav: {getOrderStatusLabel(order.status)}<br />
            Suma na zaplatenie: <b>{order.totalPrice.toFixed(2)} €</b>
          </p>

          <ApplePayButton onClick={() => {
              }} /> 

          {/* Tlačidlo na zobrazenie QR kódu */}
          <button 
            className="qr-trigger-btn"
            onClick={() => setIsQRDrawerOpen(true)}
          >
            <span>📱</span> Zaplatiť QR kódom
          </button>
        </>
      ) : (
        <p>Načítavam objednávku...</p>
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
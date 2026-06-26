import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { api } from "../api/client";
import type { Order } from "../types";
import { getOrderStatusLabel } from "../utils/orderStatus";
import { QRCodeSVG } from "qrcode.react";

function generateEPCQR(iban: string, amount: number, variableSymbol: string, recipientName: string) {
  const amountFormatted = amount.toFixed(2).replace(".", ",");
  return [
    "BCD",
    "002",
    "1",
    "SCT",
    "",
    recipientName,
    iban,
    `EUR${amountFormatted}`,
    "",
    variableSymbol,
    `Objednavka ${variableSymbol}`,
  ].join("\n");
}

export default function OrderConfirmation() {
  const { id } = useParams();
  const location = useLocation();
  const isAdminPreview = new URLSearchParams(location.search).get("preview") === "admin";
  const menuTarget = isAdminPreview ? "/?preview=admin" : "/menu";
  const [order, setOrder] = useState<Order | null>(null);

  const qrText = order ? generateEPCQR(
    "SK1234567890123456789012", // vymenit za real iban
    order.totalPrice,
    order.id.slice(0, 8), // variable symbol
    "Sem pojde nazov prijemcu" // vymenit za real nazov prijemcu
  ) : "";

  useEffect(() => {
    if (id) api.get<Order>(`/orders/${id}`).then((response) => setOrder(response.data));
  }, [id]);

  return (
    <section className="confirmation">
      <p className="eyebrow">Objednávka prijatá</p>
      <h1>Ďakujeme</h1>
      {order ? (
        <p>
          Objednávka #{order.id.slice(0, 8)} bola prijatá. <br />
          Stav: {getOrderStatusLabel(order.status)}<br />
          Suma na zaplatenie: <b> {order.totalPrice.toFixed(2)} € </b>
        </p>
      ) : (
        <p>Načítavam objednávku...</p>
      )}
      <Link to={menuTarget} className="primary-action">Späť na menu</Link>
      {order && (
        <div className="qr-payment-box">
          <h3>Zaplatiť cez QR kód</h3>
          <QRCodeSVG value={qrText} size={200} includeMargin={true} />
          <p>Na zaplatenie použite QR kód</p>
        </div>
      )}
    </section>
  );
}

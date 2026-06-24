import { useEffect } from "react";
import { api } from "../api/client";
import { readGuestOrderHistory, saveGuestOrderHistory } from "../utils/guestStorage";
import { toast } from "react-hot-toast";
import type { OrderStatus } from "../types";

type StoredOrder = {
  id: string;
  createdAt: string;
  totalPrice: number;
  status: OrderStatus;
  itemCount: number;
  items?: Array<{ name: string; quantity: number; price: number }>;
};

const statusTranslations: Record<string, string> = {
  PENDING: "Prijatá",
  PREPARING: "Pripravuje sa",
  READY: "Pripravená",
  DELIVERED: "Doručená",
  CANCELLED: "Zrušená"
};

export function useOrderStatusPolling() {
  useEffect(() => {
    const interval = setInterval(async () => {
      const history = readGuestOrderHistory<StoredOrder>();
      // Nájdeme objednávky, ktoré ešte nie sú dokončené
      const activeOrders = history.filter(
        (o) => o.status !== "DELIVERED" && o.status !== "CANCELLED"
      );

      if (activeOrders.length === 0) return;

      let historyChanged = false;
      const updatedHistory = [...history];

      for (const order of activeOrders) {
        try {
          const response = await api.get(`/orders/${order.id}`);
          const newStatus = response.data.status;

          if (newStatus && newStatus !== order.status) {
            // Stav sa zmenil!
            toast(`Objednávka je teraz: ${statusTranslations[newStatus] || newStatus}`, {
              icon: 'ℹ️',
            });

            // Aktualizujeme históriu
            const index = updatedHistory.findIndex((o) => o.id === order.id);
            if (index !== -1) {
              updatedHistory[index].status = newStatus;
              historyChanged = true;
            }
          }
        } catch (error) {
          console.error(`Failed to poll order ${order.id}`, error);
        }
      }

      if (historyChanged) {
        saveGuestOrderHistory(updatedHistory);
      }
    }, 15000); // Každých 15 sekúnd

    return () => clearInterval(interval);
  }, []);
}

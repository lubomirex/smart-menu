// Tento hook sa stara o registraciu service workera a push notifikacii
// Pri registracii sa ziska VAPID kluc z backendu a vytvori push subscription
// Subscription sa posle na backend spolu s deviceId, aby sme mohli posielat notifikacie na spravne zariadenie
import { useEffect } from "react";
import { getOrCreateDeviceId } from "../utils/deviceStorage";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
}

export default function usePush() {
  useEffect(() => {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) return;

    async function setupPush() {
      try {
        const registration = await navigator.serviceWorker.register("/service-worker.js");
        const permission = await Notification.requestPermission();
        if (permission !== "granted") return;

        // Fetch VAPID public key from backend (implement endpoint on backend)
        const r = await fetch("/api/notifications/vapidPublicKey");
        if (!r.ok) return;
        const vapidPublicKey = await r.text();

        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
        });

        // Send subscription + deviceId to backend
        await fetch("/api/devices", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            deviceId: getOrCreateDeviceId(),
            pushSubscription: subscription,
          }),
        });
      } catch (err) {
        console.error("Push setup failed:", err);
      }
    }

    setupPush();
  }, []);
}
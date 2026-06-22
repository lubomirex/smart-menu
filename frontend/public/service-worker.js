self.addEventListener('push', (event) => {
  let payload = { title: 'Aktualizácia objednávky', message: 'Stav tvojej objednávky sa zmenil.' };
  try {
    if (event.data) payload = event.data.json();
  } catch (e) {
    console.warn('push parse failed', e);
  }

  const options = {
    body: payload.message || '',
    tag: payload.orderId || undefined,  // nahradi stariu notifikaciu s rovnakym tagom
    data: payload,
    renotify: true,
    icon: '/favicon.ico'
  };

  event.waitUntil(
    self.registration.showNotification(payload.title || 'Notifikácia', options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const orderId = event.notification?.data?.orderId;
  const url = orderId ? `/order-confirmation/${orderId}` : '/';  // zhodna s App.tsx routou
  event.waitUntil(clients.openWindow(url));
});
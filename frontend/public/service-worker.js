self.addEventListener("push", function (event) {
    const data = event.data.json();

    self.registration.showNotification('Order Update', {
        body: data.message,
        icon: '/favicon.ico',
        tag: data.orderId, // zaistenie, ze notifikacia sa nahradi, ak uz existuje notifikacia s rovnakym tagom
        data: { orderId: data.orderId } // pridanie orderId do dat notifikacie
    });
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close(); // zatvorenie notifikacie po kliknuti
    const orderId = event.notification?.data?.orderId; // ziskanie orderId z dat notifikacie
    const url = orderId ? '/order/' + orderId : '/'; // vytvorenie URL na detail objednavky
    event.waitUntil(clients.openWindow(url)); // otvorenie URL v novom okne
});
io.on('connection', (socket) => {
    socket.on('subscribe-order', (orderId: string) => {
        socket.join(`order-${orderId}`);
    });
});

// zmena statusu objednavky
io.to(`order-${orderId}`).emit('order-status-changed', { 
    orderId, newStatus, timestamp
});
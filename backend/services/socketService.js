let ioInstance = null;

function initSocket(io) {
  ioInstance = io;

  io.on('connection', (socket) => {
    console.log(`[Socket.IO] Client connected: ${socket.id}`);

    // Join specific room (e.g. user ID, role, or district)
    socket.on('join_room', (room) => {
      socket.join(room);
      console.log(`[Socket.IO] Socket ${socket.id} joined room: ${room}`);
    });

    socket.on('leave_room', (room) => {
      socket.leave(room);
    });

    socket.on('disconnect', () => {
      console.log(`[Socket.IO] Client disconnected: ${socket.id}`);
    });
  });
}

function broadcastInventoryUpdate(data) {
  if (ioInstance) {
    ioInstance.emit('inventory_updated', data);
    console.log('[Socket.IO Broadcast] inventory_updated sent to all connected clients.');
  }
}

function broadcastEmergencyAlert(data) {
  if (ioInstance) {
    ioInstance.emit('emergency_request_created', data);
    ioInstance.to('donors').to('blood_banks').emit('emergency_alert', data);
    console.log('[Socket.IO Broadcast] emergency_alert broadcasted.');
  }
}

function broadcastRequestStatusUpdate(data) {
  if (ioInstance) {
    ioInstance.emit('emergency_request_updated', data);
    if (data.patientId) {
      ioInstance.to(data.patientId.toString()).emit('patient_request_updated', data);
    }
  }
}

module.exports = {
  initSocket,
  broadcastInventoryUpdate,
  broadcastEmergencyAlert,
  broadcastRequestStatusUpdate
};

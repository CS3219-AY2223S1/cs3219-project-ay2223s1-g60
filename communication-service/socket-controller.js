const createEventListeners = (socket, io) => {
  socket.on('message', (data) => {
    io.to(data.room).emit('messageResponse', data);
  });

  socket.on('typing', (data) => {
    io.to(data.room).emit('typingMessage', data);
  });

  socket.on('stop-typing', (data) => {
    io.to(data.room).emit('stop-typingMessage');
  });

  socket.on('disconnect', () => {
    console.log(`Disconnected with ${socket.id}`);
  });
};

export default createEventListeners;

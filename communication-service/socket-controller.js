const createEventListeners = (socket, io) => {
  socket.on('message', (data) => {
    io.to(data.room).emit('messageResponse', data);
    io.to(data.room).emit('stop-typingMessage');
  });

  socket.on('typing', (data) => {
    console.log('typing');
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

const createEventListeners = (socket, io) => {
  socket.on('message', (data) => {
    io.to(data.room).emit('messageResponse', data);
  });

  socket.on('disconnect', () => {
    console.log(`Disconnected with ${socket.id}`);
  });
};

export default createEventListeners;

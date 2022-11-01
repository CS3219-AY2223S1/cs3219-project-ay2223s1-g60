const createEventListeners = (socket, io) => {
  socket.on('join-room', (res) => {
    console.log('Joined room: ', res.room);
    socket.join(res.room);
    io.to(socket.id).emit('joined-room', { room: res.room });
  });

  socket.on('typedCode', (data) => {
    io.to(data.room).emit('typedCode', data);
  });

  socket.on('disconnect', () => {
    console.log(`Disconnected with ${socket.id}`);
  });
};

export default createEventListeners;

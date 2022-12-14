// stores the current session's code
let savedData = {};

const createEventListeners = (socket, io) => {
  socket.on('join-room', (res) => {
    console.log('Joined room: ', res.room);
    socket.join(res.room);
    io.to(socket.id).emit('joined-room', { room: res.room });

    if (savedData[res.room]) {
      io.to(res.room).emit('typedCode', savedData[res.room]);
    }
  });

  socket.on('typedCode', (data) => {
    io.to(data.room).emit('typedCode', data);
    // save the data into a global var
    savedData[data.room] = data;
  });

  socket.on('set-language', (data) => {
    io.to(data.room).emit('set-language', data);
  });

  socket.on('delete-room', ({ room }) => {
    if (savedData.hasOwnProperty(room)) {
      delete savedData[room];
    }
  });

  socket.on('disconnect', () => {
    console.log(`Disconnected with ${socket.id}`);
  });
};

export default createEventListeners;

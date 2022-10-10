const roles = {};

const handleGetRole = ({ room, username }, io) => {
  if (roles[room] && roles[room].interviewer && roles[room].interviewee) {
    console.log('Assigned role to room: ', room);
    io.to(room).emit('assign-role', roles[room]);
    return;
  }

  if (!roles[room]) {
    if (Math.floor(Math.random()) == 0) {
      roles[room] = { interviewer: username, interviewee: null };
    } else {
      roles[room] = { interviewer: null, interviewee: username };
    }
    return;
  }

  if (roles[room].interviewee) {
    roles[room].interviewer = username;
  } else {
    roles[room].interviewee = username;
  }
};

const createEventListeners = (socket, io) => {
  socket.on('message', (data) => {
    io.to(data.room).emit('messageResponse', data);
    io.to(data.room).emit('stop-typingMessage');
  });

  socket.on('typing', (data) => io.to(data.room).emit('typingMessage', data));

  socket.on('stop-typing', (data) =>
    io.to(data.room).emit('stop-typingMessage')
  );

  socket.on('disconnect', () => console.log(`Disconnected with ${socket.id}`));

  socket.on('delete-room', ({ room }) => (roles[room] = null));

  socket.on('get-role', (data) => handleGetRole(data, io));
};

export default createEventListeners;

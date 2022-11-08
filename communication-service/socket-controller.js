// Mapping of room and roles
const roles = {};

const handleGetRole = ({ room, username }) => {
  if (!roles[room]) {
    const isInterviewer = Math.floor(Math.random()) === 0; // decide randomly
    roles[room] = {
      interviewer: isInterviewer ? username : null,
      interviewee: !isInterviewer ? username : null,
    };
    return;
  }

  if (!roles[room].interviewee && roles[room].interviewer !== username) {
    roles[room].interviewee = username;
  } else if (!roles[room].interviewer && roles[room].interviewee !== username) {
    roles[room].interviewer = username;
  }

  console.log(roles[room]);
  return roles[room];
};

const createEventListeners = (socket, io) => {
  socket.on('join-room', ({ room }) => {
    socket.join(room);
    io.to(socket.id).emit('joined-room');
  });

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

  socket.on('get-role', handleGetRole);
  socket.on('get-roles', ({ room }) => {
    console.log('GET ROLE:', roles[room]);
    io.to(room).emit('assign-role', roles[room]);
  });
};

export default createEventListeners;

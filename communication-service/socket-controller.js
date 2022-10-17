// Mapping of room and roles
const roles = {};

const handleGetRole = ({ room, username }, io) => {
  if (roles[room] && roles[room].interviewer && roles[room].interviewee) {
    io.to(room).emit('assign-role', roles[room]);
    console.log(roles[room]);
    return roles[room];
  }

  if (!roles[room]) {
    const isInterviewer = Math.floor(Math.random()) === 0; // decide randomly
    roles[room] = {
      interviewer: isInterviewer ? username : null,
      interviewee: !isInterviewer ? username : null,
    };
    return;
  }

  roles[room].interviewee && roles[room].interviewee != username
    ? (roles[room].interviewer = username)
    : (roles[room].interviewee = username);
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

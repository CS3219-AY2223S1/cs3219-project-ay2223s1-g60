import {
  ormCreateRoom as createRoom,
  ormDeleteRoom as deleteRoom,
} from '../model/room-orm.js';

const waitingRoom = [];

// Finds match from waiting room, returns -1 if unavailable
const findMatch = (req) => {
  return waitingRoom.findIndex((room) => {
    return room.socketId !== req.socketId && room.difficulty === req.difficulty;
  });
};

// Adds user to waiting room
const addWaitingUser = (req) => {
  waitingRoom.push({
    userId: req.userId,
    difficulty: req.difficulty,
    socketId: req.socketId,
  });
};

// Remove user from waiting room
const removeWaitingUser = (socketId) => {
  let index = waitingRoom.findIndex((room) => {
    return room.socketId === socketId;
  });

  if (index >= 0) {
    waitingRoom.splice(index, 1);
  }
};

const onFindMatchEvent = (req, io) => {
  let index = findMatch(req);

  if (index < 0) {
    addWaitingUser(req);
  } else {
    io.to(waitingRoom[index].socketId).emit('found-match');
    io.to(req.socketId).emit('found-match');

    // create room using orm
    const room = createRoom(
      waitingRoom[index].socketId,
      req.socketId,
      req.difficulty
    ).then((res) => {
      if (res.error) {
        // TODO: handle error for when room creation fails
        console.log(res.message);
      }

      io.to(waitingRoom[index].socketId).emit('join-room', res.roomId);
      io.to(req.socketId).emit('join-room', res.roomId);

      removeWaitingUser(waitingRoom[index].socketId);
    });
  }

  console.log(waitingRoom);
};

const onDisconnectEvent = (socket) => {
  removeWaitingUser(socket.id);
  // TODO: change hard code
  deleteRoom(socket.id);
  console.log(`Disconnected with ${socket.id}`);
};

const createEventListeners = (socket, io) => {
  socket.on('find-match', (req) => onFindMatchEvent(req, io));
  socket.on('disconnect', () => onDisconnectEvent(socket));
};

export default createEventListeners;

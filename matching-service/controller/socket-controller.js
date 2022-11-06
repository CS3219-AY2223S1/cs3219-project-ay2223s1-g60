import {
  ormCreateRoom as createRoom,
  ormDeleteRoom as deleteRoom,
} from '../model/room-orm.js';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import 'dotenv/config';

const waitingRoom = [];
const ROOM_URL = 'http://localhost:8001/api/room';
const QUESTION_URL = 'http://localhost:8004/api/question';

// Finds match from waiting room, returns -1 if unavailable
const findMatch = (req) => {
  return waitingRoom.findIndex((room) => {
    return (
      room.user.user_id !== req.user.user_id &&
      room.difficulty === req.difficulty
    );
  });
};

// Adds user to waiting room
const addWaitingUser = (req, io) => {
  waitingRoom.push(req);
  io.to(req.socketId).emit('update-waiting-room', waitingRoom);
};

// Remove user from waiting room
const removeWaitingUser = (username) => {
  let index = waitingRoom.findIndex((room) => room.username === username);
  if (index >= 0) waitingRoom.splice(index, 1)[0];
};

const removeWaitingSocket = (socketId) => {
  let index = waitingRoom.findIndex((room) => room.socketId === socketId);
  if (index >= 0) waitingRoom.splice(index, 1)[0];
};

const onFindMatchEvent = (req, io) => {
  console.log(waitingRoom);
  let index = findMatch(req);

  if (index < 0) {
    addWaitingUser(req, io);
    return;
  }

  const waitingUser = waitingRoom[index];
  removeWaitingUser(waitingRoom[index].username);
  io.to(waitingUser.socketId).to(req.socketId).emit('found-match');

  // create room using orm
  createRoom(waitingUser.user, req.user, req.difficulty).then(async (res) => {
    if (!res.err) {
      if (!res.roomId) {
        console.log('User already in a room');
        // TODO: handle this (delete existing room? prevent finding a new match?)
        return;
      }

      if (process.env.ENV !== 'TEST') {
        const roomToken = generateRoomToken(
          waitingUser.user.username,
          req.user.username,
          res.roomId
        );
        await onGetQuestionEvent(io, { room: res.roomId });

        io.to(waitingUser.socketId).to(req.socketId).emit('join-room', {
          roomId: res.roomId,
          token: roomToken,
        });
      }

      return res;
    }

    console.log(res.message); // TODO: handle room creation error
  });
};

const generateRoomToken = (username1, username2, roomId) => {
  let privateRoomKey = process.env.JWT_ROOM_PRIVATE_KEY;
  let token = jwt.sign({ username1, username2, roomId }, privateRoomKey, {
    expiresIn: '2h',
  });
  return token;
};

const onDisconnectEvent = (socket) => {
  removeWaitingSocket(socket.id);
  console.log(waitingRoom);
  console.log(`Disconnected with ${socket.id}`);
};

const onGetQuestionEvent = async (io, { room }) => {
  try {
    const difficulty = await axios
      .get(`${ROOM_URL}?roomId=${room}`)
      .then(({ data: { difficulty } }) => difficulty);
    const question = await axios
      .get(`${QUESTION_URL}?difficulty=${difficulty}`)
      .then(({ data: { resp } }) => resp);

    io.to(room).emit('question', question);

    const updatedRoom = await axios.put(`${ROOM_URL}`, {
      roomId: room,
      question,
    });
    return updatedRoom;
  } catch (err) {
    console.log('ERROR GET QUESTION: ' + err);
  }
};

const timers = {};

const countDown = (room) => {
  timers[room].time -= 1;
  if (timers[room].time <= 0) {
    clearInterval(timers[room].interval);
    timers[room].time = 0;
  }
  return timers[room].time;
};

const handleTimer = (room, io) => {
  if (timers[room]) return;
  timers[room] = { time: 120, interval: null };
  timers[room].interval = setInterval(
    () => io.to(room).emit('timer', countDown(room)),
    1000
  );
};

const handleExtendTimer = ({ room, seconds }) => {
  if (!timers[room]) return;
  timers[room].time += seconds;
};

const onDeleteRoomEvent = ({ room }, io) => {
  deleteRoom(room).then((res) =>
    res.err ? console.log(res.message) : console.log('Delete room: ', room)
  );
  if (timers[room]) {
    clearInterval(timers[room].interval);
    timers[room] = null;
  }
  io.to(room).emit('match-left');
};

const createEventListeners = (socket, io) => {
  socket.on('find-match', (req) => onFindMatchEvent(req, io));
  socket.on('disconnect', () => onDisconnectEvent(socket));
  socket.on('cancel-req', ({ user }) => removeWaitingUser(user));
  socket.on('delete-room', (req) => onDeleteRoomEvent(req, io));
  socket.on('get-question', async (room) => onGetQuestionEvent(io, room));
  socket.on('join-room', ({ room }) => {
    socket.join(room);
    handleTimer(room, io);
  });
  socket.on('extend-time', (data) => handleExtendTimer(data));
};

export default createEventListeners;

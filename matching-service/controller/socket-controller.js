import {
  ormCreateRoom as createRoom,
  ormDeleteRoom as deleteRoom,
} from '../model/room-orm.js';
import jwt from 'jsonwebtoken';
import axios from 'axios';

const waitingRoom = [];
const ROOM_URL = 'http://localhost:8001/api/room';
const QUESTION_URL = 'http://localhost:8004/api/question';

// Finds match from waiting room, returns -1 if unavailable
const findMatch = (req) => {
  return waitingRoom.findIndex((room) => {
    return room.socketId !== req.socketId && room.difficulty === req.difficulty;
  });
};

// Adds user to waiting room
const addWaitingUser = (req, io) => {
  waitingRoom.push(req);
  io.to(req.socketId).emit('update-waiting-room', waitingRoom);
};

// Remove user from waiting room
const removeWaitingUser = (socketId, io) => {
  let index = waitingRoom.findIndex((room) => {
    return room.socketId === socketId;
  });

  index > 0 && waitingRoom.splice(index, 1)[0];
};

const onFindMatchEvent = (req, io) => {
  let index = findMatch(req);

  if (index < 0) {
    addWaitingUser(req, io);
    return;
  }

  // create room using orm
  createRoom(waitingRoom[index].username, req.username, req.difficulty).then(
    (res) => {
      if (!res.err) {
        io.to(waitingRoom[index].socketId).emit('found-match');
        io.to(req.socketId).emit('found-match');

        removeWaitingUser(waitingRoom[index].socketId, io);

        const roomToken = generateRoomToken(
          waitingRoom[index].username,
          req.username,
          res.roomId
        );

        io.to(waitingRoom[index].socketId).emit('join-room', {
          roomId: res.roomId,
          token: roomToken,
        });

        io.to(req.socketId).emit('join-room', {
          roomId: res.roomId,
          token: roomToken,
        });

        onGetQuestionEvent(io, { room: res.roomId });
        return res;
      } else {
        console.log(res.message); // TODO: handle room creation error
      }
    }
  );
};

const generateRoomToken = (username1, username2, roomId) => {
  let privateRoomKey = process.env.JWT_ROOM_PRIVATE_KEY;
  let token = jwt.sign(
    {
      username1: username1,
      username2: username2,
      roomId: roomId,
    },
    privateRoomKey,
    { expiresIn: '2h' }
  );
  console.log('Room token: ' + token);
  return token;
};

const onDisconnectEvent = (socket) => {
  removeWaitingUser(socket.id);
  console.log(`Disconnected with ${socket.id}`);
};

const onGetQuestionEvent = async (io, { room }) => {
  try {
    const difficulty = await (
      await axios.get(`${ROOM_URL}?roomId=${room}`)
    ).data.roomResp.difficulty;
    const questionObj = await axios.get(
      `${QUESTION_URL}?difficulty=${difficulty}`
    );
    io.to(room).emit('question', questionObj.data.resp);
    const updatedRoom = await axios.put(`${ROOM_URL}`, {
      roomId: room,
      question: questionObj.data.resp,
    });
    return updatedRoom;
  } catch (err) {
    console.log('ERROR GET QUESTION: ' + err);
  }
};

const timers = {};
const handleTimer = (room, io) => {
  if (timers[room]) return;
  timers[room] = { time: 120, interval: null };
  timers[room].interval = setInterval(
    () => io.to(room).emit('timer', (timers[room].time -= 1)),
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
  socket.on('delete-room', (req) => onDeleteRoomEvent(req, io));
  socket.on('get-question', async (room) => onGetQuestionEvent(io, room));
  socket.on('join-room', ({ room }) => {
    socket.join(room);
    handleTimer(room, io);
  });
  socket.on('extend-time', (data) => handleExtendTimer(data));
};

export default createEventListeners;

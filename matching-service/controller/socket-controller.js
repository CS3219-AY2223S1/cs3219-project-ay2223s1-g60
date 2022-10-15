import {
  ormCreateRoom as createRoom,
  ormDeleteRoom as deleteRoom,
} from '../model/room-orm.js';
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
const addWaitingUser = (req) => {
  waitingRoom.push({
    username: req.username,
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
    createRoom(waitingRoom[index].username, req.username, req.difficulty).then(
      (res) => {
        if (!res.err) {
          io.to(waitingRoom[index].socketId).emit('join-room', res.roomId);
          io.to(req.socketId).emit('join-room', res.roomId);
          removeWaitingUser(waitingRoom[index].socketId);
          onGetQuestionEvent(io, { room: res.roomId });
          return res;
        } else {
          console.log(res.message); // TODO: handle room creation error
        }
      }
    );
  }
};

const onDisconnectEvent = (socket) => {
  removeWaitingUser(socket.id);
  console.log(`Disconnected with ${socket.id}`);
};

const onDeleteRoomEvent = ({ room }, io) => {
  deleteRoom(room).then((res) =>
    res.err ? console.log(res.message) : console.log('Delete room: ', room)
  );
  io.to(room).emit('match-left');
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

const createEventListeners = (socket, io) => {
  socket.on('find-match', (req) => onFindMatchEvent(req, io));
  socket.on('disconnect', () => onDisconnectEvent(socket));
  socket.on('delete-room', (req) => onDeleteRoomEvent(req, io));
  socket.on('get-question', async (room) => onGetQuestionEvent(io, room));
  socket.on('join-room', ({ room }) => socket.join(room));
};

export default createEventListeners;

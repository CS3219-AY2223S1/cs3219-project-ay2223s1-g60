import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors()); // config cors so that front-end can use
app.options('*', cors());

app.get('/', (req, res) => {
  res.send('Hello World from matching-service');
});

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: ['http://localhost:3000'],
  },
});

const rooms = [];
io.on('connection', (socket) => {
  console.log(`Connected to ${socket.id}`);

  socket.on('find-match', (req) => {
    let index = rooms.findIndex((room) => {
      return (
        room.socketId !== req.socketId && room.difficulty === req.difficulty
      );
    });

    if (index < 0) {
      rooms.push({
        userId: req.userId,
        difficulty: req.difficulty,
        socketId: req.socketId,
      });
    } else {
      io.to(rooms[index].socketId).emit('found-match');
      io.to(req.socketId).emit('found-match');

      // TODO: create room in db
      // return roomId
      // emit to both clients

      rooms.splice(index, 1);
    }

    console.log(rooms);
  });

  socket.on('message', (data) => {
    io.emit('messageResponse', data);
  });

  socket.on('disconnect', () => {
    let toDelete = rooms.findIndex((room) => {
      return room.socketId === socket.id;
    });

    if (toDelete >= 0) {
      rooms.splice(toDelete, 1);
    }

    console.log(rooms);
    console.log(`Disconnected with ${socket.id}`);
  });
});

httpServer.listen(8001);

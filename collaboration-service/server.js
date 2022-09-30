import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import 'dotenv';
import createEventListeners from './socket-controller.js';

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors()); // config cors so that front-end can use
app.options('*', cors());

app.get('/', (req, res) => {
  res.send('Hello World from collaboration-service');
});

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: [process.env.origin || 'http://localhost:3000'],
  },
});

io.on('connection', (socket) => {
  console.log(`Connected to ${socket.id}`);
  const room = socket.handshake.query.room;
  socket.join(room);
  console.log('Joined room ', room);
  createEventListeners(socket, io);
});

const port = process.env.PORT || 8003;
httpServer.listen(port);

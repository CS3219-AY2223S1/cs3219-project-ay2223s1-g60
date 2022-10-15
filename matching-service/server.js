import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import createEventListeners from './controller/socket-controller.js';
import { getRoom, updateRoomQuestion } from './controller/room-controller.js';
import 'dotenv';

const app = express();
const router = express.Router();

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
    origin: [process.env.ORIGIN || 'http://localhost:3000'],
  },
});

io.on('connection', (socket) => {
  console.log(`Connected to ${socket.id}`);
  createEventListeners(socket, io);
});

router.get('/', getRoom);
router.put('/', updateRoomQuestion);

app.use('/api/room', router).all((_, res) => {
  res.setHeader('content-type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
});

httpServer.listen(8001);

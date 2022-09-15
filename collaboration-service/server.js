import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import 'dotenv';

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

  socket.on('typedCode', (data) => {
    io.emit('typedCode', data);
  });

  socket.on('disconnect', () => {
    console.log(`Disconnected with ${socket.id}`);
  });
});

const port = process.env.PORT || 8003;
httpServer.listen(port);

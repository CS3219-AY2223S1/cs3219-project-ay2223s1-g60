import express from 'express';
import cors from 'cors';
import { createServer } from 'http';

// Properties
const port = 8001;

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors()); // config cors so that front-end can use
app.options('*', cors());

app.get('/', (req, res) => {
  res.send('Hello World from matching-service');
});

const httpServer = createServer(app);

httpServer.listen(port, () => {
  console.log('Server started on port: ', port);
});

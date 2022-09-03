import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { findMatch } from './controller/socket-controller.js';

// Properties
const port = 8001;

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors()); // config cors so that front-end can use
app.options('*', cors());

const router = express.Router();

router.get('/', (_, res) => res.send('Hello World from matching-service'));
router.post('/find-match', findMatch);
// router.post('/find-match', findMatch);

app.use('/api/matching', router).all((_, res) => {
  res.setHeader('content-type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
});

const httpServer = createServer(app);

httpServer.listen(port, () => {
  console.log('matching-service started on port: ', port);
});

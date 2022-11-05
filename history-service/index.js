import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 8005;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors()); // config cors so that front-end can use
app.options('*', cors());
import {
  getHistory,
  getHistoryList,
  createHistory,
} from './controller/history-controller.js';
import { verifyToken } from './middleware/authJwt.js';

const router = express.Router();

// Controller will contain all the User-defined Routes
router.get('/historyList/:user_id', verifyToken, getHistoryList);
router.get('/:user_id/:roomId', verifyToken, getHistory);
router.post('/:user_id', verifyToken, createHistory);

app.use('/api/history', router).all((_, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('content-type', 'application/json');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
});

app.listen(8005, () =>
  console.log(`history-service listening on port ${PORT}`)
);

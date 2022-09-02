import express from "express";
import cors from "cors";

const app = express();
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors()) // config cors so that front-end can use
app.options('*', cors())
import { createUser, logout, loginWithToken, signIn } from './controller/user-controller.js';
import redis from "redis";

// let redisClient = null;

// (async () => {
//     redisClient = redis.createClient();

//     redisClient.on("error", (error) => {
//         console.log(error);
//     });
//     redisClient.on("connect", () => {
//         console.log("Redis connected!");
//     });

//     await redisClient.connect();
// })();
const router = express.Router();

// Controller will contain all the User-defined Routes
router.get('/', (_, res) => res.send('Hello World from user-service'))
router.post('/signup', createUser)
router.get('/logout', logout)
router.post('/loginWithToken', loginWithToken);
router.post("/loginWithUsernamePassword", signIn);

app.use("/api/user", router).all((_, res) => {
  res.setHeader("content-type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");
});

app.listen(8000, () => console.log("user-service listening on port 8000"));

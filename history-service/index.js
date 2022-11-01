import express from "express";
import cors from "cors";

const app = express();
const PORT = 8005;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors()); // config cors so that front-end can use
app.options("*", cors());
import {
    getHistory,
    getHistoryList,
    createHistory
} from "./controller/history-controller.js";
import { verifyToken } from "./middleware/authJwt.js";

const router = express.Router();

app.get("/", (_, res) => res.send("Hello World from history-service"));

// Controller will contain all the User-defined Routes
router.get("/historyList/:username", verifyToken, getHistoryList);
router.get("/:username/:roomId", verifyToken, getHistory);
router.post("/:username", verifyToken, createHistory);

app.use("/api/history", router).all((_, res) => {
  res.setHeader("content-type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");
});

app.listen(POST, () => console.log(`history-service listening on port ${PORT}`));

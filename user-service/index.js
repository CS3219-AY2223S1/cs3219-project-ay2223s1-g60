import express from "express";
import cors from "cors";

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors()); // config cors so that front-end can use
app.options("*", cors());
import {
  createUser,
  signIn,
  connectToRedis,
} from "./controller/user-controller.js";

const router = express.Router();

// Controller will contain all the User-defined Routes
router.post("/sign-in", signIn);
router.get("/", (_, res) => res.send("Hello World from user-service"));
router.post("/", createUser);

app.use("/api/user", router).all((_, res) => {
  res.setHeader("content-type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");
});

await connectToRedis();

app.listen(8000, () => console.log("user-service listening on port 8000"));

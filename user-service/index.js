import express from "express";
import cors from "cors";
import {
  changePassword,
  changeUsername,
  connectToRedis,
  createUser,
  deleteUser,
  isTokenInBlacklist,
  logout,
  loginWithToken,
  signIn,
} from "./controller/user-controller.js";

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors()); // config cors so that front-end can use
app.options("*", cors());

const router = express.Router();

// Controller will contain all the User-defined Routes
router.get("/", (_, res) => res.send("Hello World from user-service"));
router.get("/blacklist", isTokenInBlacklist);

router.post("/signup", createUser);
router.post("/logout", logout);
router.post("/loginWithToken", loginWithToken);
router.post("/login", signIn);
router.post("/change-password", changePassword);
router.post("/change-username", changeUsername);

router.delete("/delete-user", deleteUser);

app.use("/api/user", router).all((_, res) => {
  res.setHeader("content-type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");
});

await connectToRedis();

app.listen(8000, () => console.log("user-service listening on port 8000"));

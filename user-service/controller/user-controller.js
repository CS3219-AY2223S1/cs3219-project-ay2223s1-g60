import {
  ormCreateUser as _createUser,
  ormDeleteToken as _logout,
  ormGetToken as _getToken,
  ormGetUser as _getUser,
  ormAddTokenToUser as _addToken,
} from "../model/user-orm.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createClient } from "redis";

const redisClient = createClient();

export async function createUser(req, res) {
  try {
    const { username, password } = req.body;
    let saltRounds = parseInt(process.env.SALT_ROUNDS);

    if (username && password) {
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const resp = await _createUser(username, hashedPassword);
      console.log(resp);
      if (resp.err) {
        return res
          .status(400)
          .json({ message: "Could not create a new user!" });
      } else {
        console.log(`Created new user ${username} successfully!`);
        return res
          .status(201)
          .json({ message: `Created new user ${username} successfully!` });
      }
    } else {
      return res
        .status(400)
        .json({ message: "Username and/or Password are missing!" });
    }
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Database failure when creating new user!" });
  }
}

export async function signIn(req, res) {
  try {
    const { username, password } = req.body;

    if (username && password) {
      const user = await _getUser(username, password);
      if (user.err) {
        return res.status(400).json({ message: "Could not sign in!" });
      } else {
        console.log(`Signed in user ${username} successfully!`);

        let token = await generateToken(user);

        const updated = await _addToken(username, token);

        return res.status(200).json({
          token: token,
        });
      }
    } else {
      return res
        .status(400)
        .json({ message: "Username and/or Password are missing!" });
    }
  } catch (err) {
    return res.status(500).json({ message: "Could not found user" });
  }
}

export async function generateToken(user) {
  let privateKey = process.env.JWT_PRIVATE_KEY;

  let token = await jwt.sign(
    {
      username: user.username,
      hashedPassword: user.hashedPassword,
      _id: user._id,
    },
    privateKey,
    { expiresIn: "60s" }
  );
  console.log(token);
  return token;
}

export async function connectToRedis() {
  redisClient.on("error", (error) => {
    console.log("Redis client error " + error);
  });
  redisClient.on("connect", () => {
    console.log("Redis connected!");
  });

  await redisClient.connect();
}

export async function loginWithToken(req, res) {
  try {
    const { username } = req.body;
    const token = req.headers.authorization.split(" ")[1];

    if (username && token) {
      const resp = await _getToken(username, token);

      if (resp.err) {
      } else {
        jwt.verify(
          resp,
          process.env.JWT_PRIVATE_KEY,
          function (err, decodedFromDb) {
            try {
              jwt.verify(
                token,
                process.env.JWT_PRIVATE_KEY,
                function (err, decodedFromUser) {
                  if (
                    decodedFromDb.username === decodedFromUser.username &&
                    decodedFromDb.hashedPassword ===
                      decodedFromUser.hashedPassword &&
                    decodedFromDb._id === decodedFromUser._id
                  ) {
                    return res.status(201).json({
                      message: `Successfully log ${username} in with token!`,
                    });
                  } else {
                    return res
                      .status(400)
                      .json({ message: "Your token is invalid" });
                  }
                  console.log(decoded); // bar
                }
              );
            } catch (err) {
              return res.status(400).json({ message: "Your token is invalid" });
            } // bar
          }
        );
      }
    } else {
      return res
        .status(400)
        .json({ message: "Username and/or token are missing!" });
    }
  } catch (err) {}
}

export async function logout(req, res) {
  try {
    const { username, token } = req.body;

    if (username && token) {
      const resp = await _logout(username, token);
      console.log(resp);
      if (resp.err) {
        return res
          .status(400)
          .json({ message: `Could not logout ${username}!` });
      } else {
        await insertTokenToBlacklist(token);
        return res
          .status(201)
          .json({ message: `Log ${username} out successfully!` });
      }
    } else {
      return res
        .status(400)
        .json({ message: "Username and/or token are missing!" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error in logging out" });
  }
}

export async function insertTokenToBlacklist(token) {
  const { iat } = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
  const expiryDate = iat + 60;

  const token_key = `bl_${token}`;
  await redisClient.set(token_key, token);
  redisClient.expireAt(token_key, expiryDate);
}

export async function isTokenInBlacklist(req, res) {
  const { token } = req.body;
  const inDenyList = await redisClient.get(`bl_${token}`);
  if (inDenyList) {
    return res.status(200).json({ message: `${token} in blacklist` });
  } else {
    return res.status(200).json({ message: `${token} NOT in blacklist` });
  }
}

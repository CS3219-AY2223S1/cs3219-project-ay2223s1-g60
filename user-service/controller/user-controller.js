import {
  ormCreateUser as _createUser,
  ormDeleteToken as _logout,
  ormGetToken as _getToken,
  ormGetUser as _getUser,
  ormAddTokenToUser as _addToken,
  ormChangePassword as _changePassword,
  ormChangeUsername as _changeUsername,
  ormDeleteUser as _deleteUser,
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
      console.log("response controller: ");
      console.log(resp);
      if (resp.err) {
        if (
          resp.err.name &&
          resp.err.name === "MongoServerError" &&
          resp.err.code === 11000
        ) {
          return res.status(409).json({ message: "Duplicate user!" });
        }
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
    console.log("Here error ", err);
    return res
      .status(500)
      .json({ message: "Database failure when creating new user!" });
  }
}

export async function signIn(req, res) {
  try {
    const { username, password } = req.body;
    if (username && password) {
      const user = await _getUser(username);
      if (user.err) {
        return res.status(400).json({ message: "Could not sign in!" });
      } else {

        const isPasswordCorrect = user.comparePassword(password);

        if (!isPasswordCorrect) {
          return res.status(400).json( { message: "Wrong username and/or password"} );
        }

        let token = await generateToken(user);

        const updated = await _addToken(username, token);

        return res.status(201).json({
          username: username,
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

export async function changePassword(req, res) {
  try {
    const { username, oldPassword, newPassword } = req.body;
    if (username && oldPassword && newPassword) {
      let saltRounds = parseInt(process.env.SALT_ROUNDS);
      const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);
      const updated = await _changePassword(
        username,
        oldPassword,
        hashedNewPassword
      );
      if (updated) {
        return res
          .status(200)
          .json({ message: "Successfully changed password." });
      } else {
        return res
          .status(400)
          .json({ message: "Wrong username and/or password!" });
      }
    } else {
      return res
        .status(400)
        .json({ message: "Username and/or Passwords are missing!" });
    }
  } catch (err) {
    return res.status(500).json({ message: "Could not found user" });
  }
}

export async function changeUsername(req, res) {
  // Todo: Check token in header
  // Todo: handle existing username
  try {
    const { username, newUsername, password } = req.body;
    if (username && newUsername && password) {
      const updated = await _changeUsername(username, newUsername, password);
      console.log("Controller: " + JSON.stringify(updated));
      if (updated.err) {
        return res
          .status(400)
          .json({ message: "Wrong username and/or password!" });
      } else if (updated) {
        return res
          .status(200)
          .json({ message: "Successfully changed username." });
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

export async function deleteUser(req, res) {
  // TODO : CHECK BEARER TOKEN (AUTHORIZATION)
  // TODO : Token in req.body
  try {
    const { username } = req.body;
    if (username) {
      const isDeleted = await _deleteUser(username);
      console.log("Controller: " + JSON.stringify(isDeleted));
      if (!isDeleted) {
        return res.status(400).json({ message: "User does not exist!" });
      } else if (isDeleted) {
        return res.status(200).json({ message: "Successfully deleted user." });
      }
    } else {
      return res.status(400).json({ message: "Username is missing!" });
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
    { expiresIn: "1h" }
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
    return res.status(201).json({
      message: `Successfully log ${req.body.username} in with token!`,
      username: req.body.username,
    });
  } catch (err) {
    return res.status(500).json({
      message: `Database failure!`,
    });
  }
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

export async function isTokenInBlacklist(token) {
  const inDenyList = await redisClient.get(`bl_${token}`);

  return inDenyList;
}

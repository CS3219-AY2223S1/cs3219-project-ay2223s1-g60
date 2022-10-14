import { ormGetToken as _getToken } from "../model/user-orm.js";
import jwt from "jsonwebtoken";

const isValidRequest = (req) => {
  return (
    req.body.username &&
    req.headers &&
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  );
};

const isMatchingCredential = (fromDb, fromUser) => {
  return (
    fromDb.username === fromUser.username &&
    fromDb.hashedPassword === fromUser.hashedPassword &&
    fromDb._id === fromUser._id
  );
};

const decodeToken = (token) => {
  const decodedToken = jwt.verify(
    token,
    process.env.JWT_PRIVATE_KEY,
    function (err, decoded) {
      if (err) {
        throw err;
      }
      return decoded;
    }
  );
  return decodedToken;
};

export async function verifyToken(req, res, next) {
  if (!isValidRequest(req)) {
    return res.status(401).json({ message: "Missing JWT token!" });
  }

  const username = req.body.username;
  const tokenFromDb = await _getToken(username);
  const tokenFromUser = req.headers.authorization.split(" ")[1];
  try {
    const fromDb = decodeToken(tokenFromDb);
    const fromUser = decodeToken(tokenFromUser);

    if (!isMatchingCredential(fromDb, fromUser)) {
      return res.status(401).json({ message: "Unauthorized access" });
    }
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid JWT token!" });
  }
}

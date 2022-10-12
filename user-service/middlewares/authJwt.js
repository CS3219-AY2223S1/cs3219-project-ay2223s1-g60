import { ormGetToken as _getToken } from "../model/user-orm.js";
import jwt from "jsonwebtoken";

export async function verifyToken(req, res, next) {
  if (
    req.body.username &&
    req.headers &&
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    const username = req.body.username;
    const tokenFromDb = await _getToken(username);
    const tokenFromUser = req.headers.authorization.split(" ")[1];
    try {
      const fromDb = jwt.verify(
        tokenFromDb,
        process.env.JWT_PRIVATE_KEY,
        function (err, decodedFromDb) {
          if (err) {
            throw err;
          }
          return decodedFromDb;
        }
      );
      const fromUser = jwt.verify(
        tokenFromUser,
        process.env.JWT_PRIVATE_KEY,
        function (err, decodedFromUser) {
          if (err) {
            throw err;
          }
          return decodedFromUser;
        }
      );

      if (
        fromDb.username === fromUser.username &&
        fromDb.hashedPassword === fromUser.hashedPassword &&
        fromDb._id === fromUser._id
      ) {
        next();
      } else {
        return res.status(401).json({ message: "Unauthorized access" });
      }
    } catch (err) {
      return res.status(401).json({ message: "Invalid JWT token!" });
    }
  } else {
    return res.status(401).json({ message: "Missing JWT token!" });
  }
}

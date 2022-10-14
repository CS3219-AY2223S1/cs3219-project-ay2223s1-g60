import { decodeToken, isValidRequest } from "../../utils/token.js";

const isVerifiedUser = (decoded, username, roomId) => {
  return (
    (decoded.username1 == username || decoded.username2 == username) &&
    decoded.roomId == roomId
  );
};

export async function verifyRoomUser(req, res) {
  if (!isValidRequest(req)) {
    return res.status(401).json({ message: "Missing JWT token!" });
  }
  const { username, roomId } = req.body;
  const tokenUser = req.headers.authorization.split(" ")[1];
  try {
    const decoded = decodeToken(tokenUser, process.env.JWT_ROOM_PRIVATE_KEY);
    if (!isVerifiedUser(decoded, username, roomId)) {
      return res.status(401).json({ message: "Unauthorized access" });
    }
    return res
      .status(201)
      .json({ message: "User is verified. Joining the room." });
  } catch (error) {
    return res.status(401).json({ message: "Invalid JWT token!" });
  }
}

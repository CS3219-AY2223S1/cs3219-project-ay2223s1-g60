import jwt from "jsonwebtoken";

export async function verifyRoomUser(req, res) {
  console.log("Auth: " + JSON.stringify(req.headers));
  console.log("Body: " + JSON.stringify(req.body));
  if (
    req.body &&
    req.headers &&
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    const { username, roomId } = req.body;
    const tokenUser = req.headers.authorization.split(" ")[1];
    try {
      jwt.verify(
        tokenUser,
        process.env.JWT_ROOM_PRIVATE_KEY,
        function (err, decoded) {
          console.log("Decoded: " + JSON.stringify(decoded));
          console.log("Error : " + JSON.stringify(err));
          if (err) {
            throw err;
          }
          if (
            (decoded.username1 == username || decoded.username2 == username) &&
            decoded.roomId == roomId
          ) {
            return res
              .status(201)
              .json({ message: "User is verified. Joining the room." });
          } else {
            return res.status(401).json({ message: "Unauthorized access" });
          }
        }
      );
    } catch (error) {
      return res.status(401).json({ message: "Invalid JWT token!" });
    }
  } else {
    return res.status(401).json({ message: "Missing JWT token!" });
  }
}

import jwt from "jsonwebtoken";

export async function verifyToken(req, res, next) {
  if (!(
    ( req.body || req.query ) &&
    req.headers &&
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer")) {
    return res.status(401).json({ message: "Missing JWT token!" });
  }

  const { username } = req.params;

  const tokenFromUser = req.headers.authorization.split(" ")[1];

  try {
    const fromUser = jwt.verify(tokenFromUser, process.env.JWT_PRIVATE_KEY, function (err, decoded) {
        if (err) {
          throw err;
        }
        return decoded;
    });

    if (fromUser.username != username) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid JWT token!" });
  }
}

import {
  ormGetRoom as _getRoom,
  ormUpdateRoomQuestion as _updateRoomQuestion,
} from "../model/room-orm.js";

export async function getRoom(req, res) {
  try {
    const { roomId } = req.query;

    if (!roomId) {
      return res.status(400).json({ message: "Missing room ID" });
    }
    const roomResp = await _getRoom(roomId);
    if (roomResp.err) {
      return res.status(400).json({ message: "Could not get room!" });
    }

    return res.status(201).json({ roomResp });
  } catch (err) {
    console.log("Error room: " + err);
    return res.status(500).json({ message: err });
  }
}

export async function updateRoomQuestion(req, res) {
  try {
    const { roomId, question } = req.body;

    if (!(roomId && question)) {
      return res.status(400).json({ message: "Missing room ID or question" });
    }
    const roomResp = await _updateRoomQuestion(roomId, question);
    if (!roomResp || roomResp.err) {
      return res.status(400).json({ message: "Could not update room!" });
    }

    return res.status(201).json({ roomResp });
  } catch (err) {
    console.log("Error room: " + err);
    return res.status(500).json({ message: err });
  }
}

import { ormCreateRoom as _createRoom } from '../model/room-orm.js';

export async function createRoom(req, res) {
  try {
    const { user1, user2, difficulty } = req.body;

    if (user1 && user2 && difficulty) {
      if (difficulty < 0 || difficulty > 3) {
        return res.status(400).json({ message: 'Unknown difficulty level!' });
      }

      _createRoom({ user1, user2, difficulty }).then((res) => {
        if (res.error) {
          return res.status(500).json({ message: res.message });
        }

        return res.status(201).json({ roomId: res.roomId });
      });
    }

    res.status(400).json({ message: 'Incorrect request parameters!' });
  } catch (err) {
    return res
      .status(500)
      .json({ message: 'Database failure when creating new room!' });
  }
}

import {
  ormGetRoom as _getRoom,
  ormUpdateRoomQuestion as _updateRoomQuestion,
} from '../model/room-orm.js';

export async function getRoom(req, res) {
  try {
    const { roomId } = req.query;

    if (!roomId) {
      return res.status(400).json({ message: 'Missing room ID' });
    }
    const room = await _getRoom(roomId);
    if (!room) {
      return res.status(400).json({ message: 'Could not get room!' });
    }
    return res.status(201).json(room);
  } catch (err) {
    console.log('Error room: ' + err);
    return res.status(500).json({ message: err });
  }
}

export async function updateRoomQuestion(req, res) {
  try {
    const { roomId, question } = req.body;

    if (!(roomId && question)) {
      return res.status(400).json({ message: 'Missing room ID or question' });
    }
    const room = await _updateRoomQuestion(roomId, question);
    if (!room || room.err) {
      return res.status(400).json({ message: 'Could not update room!' });
    }

    return res.status(201).json(room);
  } catch (err) {
    console.log('Error room: ' + err);
    return res.status(500).json({ message: err });
  }
}

export async function deleteRoom(req, res) {
  try {
    const { user1, user2, difficulty } = req.body;

    if (user1 && user2 && difficulty) {
      if (difficulty < 0 || difficulty > 3) {
        return res.status(400).json({ message: 'Unknown difficulty level!' });
      }

      _createRoom({ user1, user2, difficulty }).then((res) => {
        if (res.error) {
          return res.status(500).json({ message: res.message });
        }

        return res.status(201).json({ roomId: res.roomId });
      });
    }

    res.status(400).json({ message: 'Incorrect request parameters!' });
  } catch (err) {
    return res
      .status(500)
      .json({ message: 'Database failure when creating new room!' });
  }
}

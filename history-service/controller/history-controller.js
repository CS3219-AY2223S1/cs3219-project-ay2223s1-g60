import {
  ormCreateHistory as _createHistory,
  ormGetHistory as _getHistory,
  ormGetAllHistories as _getAllHistories,
} from '../model/history-orm.js';

export async function createHistory(req, res) {
  try {
    const { user1, user2, question, chats, code, roomId } = req.body;
    if ((user1, user2, question, chats, code, roomId)) {
      const historyBody = {
        user1,
        user2,
        question,
        chats,
        code,
        roomId,
      };

      const history = await _createHistory(historyBody);
      if (history.err) {
        console.log(history.err);
        return res.status(400).json({ message: 'Could not insert history!' });
      } else {
        return res
          .status(201)
          .json({ message: 'Successfully added history entry!' });
      }
    } else {
      return res.status(400).json({ message: 'Username is missing!' });
    }
  } catch (err) {
    return res.status(500).json({ message: 'Database error!' });
  }
}

export async function getHistory(req, res) {
  try {
    const { user_id, roomId } = req.params;
    if (user_id && roomId) {
      const history = await _getHistory(user_id, roomId);
      if (history.err) {
        return res.status(400).json({ message: 'Could not fetch histories!' });
      } else {
        return res.status(201).json({
          history,
        });
      }
    } else {
      return res.status(400).json({ message: 'User ID is missing!' });
    }
  } catch (err) {
    return res.status(500).json({ message: 'Database error!' });
  }
}

export async function getHistoryList(req, res) {
  try {
    const { user_id } = req.params;
    if (user_id) {
      const histories = await _getAllHistories(user_id);
      if (histories.err) {
        return res.status(400).json({ message: 'Could not fetch histories!' });
      } else {
        return res.status(201).json({
          histories,
        });
      }
    } else {
      return res.status(400).json({ message: 'User ID is missing!' });
    }
  } catch (err) {
    return res.status(500).json({ message: 'Database error!' });
  }
}

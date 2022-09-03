import { ormFindMatch as _findMatch } from '../model/match-orm.js';

// TODO: add match functionality
export async function findMatch(req, res) {
  try {
    const { username, difficulty } = req.body;

    if (username && difficulty) {
      const resp = await _findMatch(username, difficulty);

      console.log('Find Match: ', resp);

      if (resp.err) {
        console.log(err);
        return res
          .status(400)
          .json({ message: 'Could not create find match request!' });
      }

      return res
        .status(201)
        .json({ message: 'Created find match request succesfully!' });
    } else {
      return res
        .status(500)
        .json({ message: 'Username and/or difficulty missing!' });
    }
  } catch (err) {
    return res
      .status(500)
      .json({ message: 'Database failure when finding match!' });
  }
}

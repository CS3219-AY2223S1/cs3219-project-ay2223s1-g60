import { findMatch, createMatch, updateMatch } from './repository.js';

//need to separate orm functions from repository to decouple business logic from persistence

export async function ormFindMatch(username, difficulty) {
  try {
    return findMatch({ username, difficulty }).then(async (match) => {
      return match
        ? ormUpdateMatch(match.username, username)
        : ormCreateMatch(username, difficulty);
    });
  } catch (err) {
    console.log('ERROR: Could not create find match request!');
    return { err };
  }
}

export async function ormCreateMatch(username, difficulty) {
  try {
    const matchReq = await createMatch({ username, difficulty });
    matchReq.save();
    return matchReq;
  } catch (err) {
    console.log('ERROR: Could not create find match request!');
    return { err };
  }
}

export async function ormUpdateMatch(matchedUser, username) {
  try {
    const matched = await updateMatch({ matchedUser, username });
    return true;
  } catch (err) {
    console.log('ERROR: Could not update match request!');
    console.log(err);
    return { err };
  }
}

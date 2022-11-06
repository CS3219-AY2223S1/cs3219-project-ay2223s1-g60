import { getHistory, getAllHistories, createHistory } from './repository.js';
import 'dotenv/config';

//need to separate orm functions from repository to decouple business logic from persistence

// CREATE FUNCTION
export async function ormCreateHistory(history) {
  try {
    const newHistory = await createHistory(history);
    await newHistory.save();
    return true;
  } catch (err) {
    return { err };
  }
}

// READ FUNCTION
export async function ormGetAllHistories(user_id) {
  try {
    const histories = await getAllHistories(user_id);
    return histories;
  } catch (err) {
    return { err };
  }
}

export async function ormGetHistory(user_id, roomId) {
  try {
    const history = await getHistory(user_id, roomId);
    return history;
  } catch (err) {
    console.log(`ERROR: Could not get user's history from DB.`);
    return { err };
  }
}

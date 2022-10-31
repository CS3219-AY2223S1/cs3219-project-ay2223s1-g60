import {
  getHistory,
  getAllHistories,
  createHistory
} from "./repository.js";
import "dotenv/config";

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
export async function ormGetAllHistories(username) {
  try {
    const histories = await getAllHistories(username);
    return histories;
  } catch (err) {
    return { err };
  }
}

export async function ormGetHistory(username, roomId) {
  try {
    const history = await getHistory(username, roomId);
    return history;
  } catch (err) {
    console.log(
      `ERROR: Could not get user from DB. Wrong username / password.`
    );
    return { err };
  }
}

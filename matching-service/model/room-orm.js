import {
  createRoomModel,
  getRoomModel,
  deleteRoomModel,
  updateRoomModelQuestion,
} from "./repository.js";

export async function ormCreateRoom(user1, user2, difficulty) {
  try {
    const newRoom = await createRoomModel({ user1, user2, difficulty });
    await newRoom.save();

    return {
      error: false,
      message: "Room creation successful!",
      roomId: newRoom._id,
    };
  } catch (err) {
    return { error: true, message: err };
  }
}

export async function ormGetRoom(roomId) {
  try {
    const newRoom = await getRoomModel(roomId);
    return newRoom;
  } catch (err) {
    return { error: true, message: err };
  }
}

export async function ormUpdateRoomQuestion(roomId, question) {
  try {
    const updatedRoom = await updateRoomModelQuestion({ roomId, question });
    return updatedRoom;
  } catch (err) {
    return { error: true, message: err };
  }
}

export async function ormDeleteRoom(roomId) {
  try {
    await deleteRoomModel(roomId);
    return {
      error: false,
      message: "Room deletion successful!",
    };
  } catch (err) {
    return { error: true, message: err };
  }
}

import { createRoomModel, deleteRoomModel } from './repository.js';

export async function ormCreateRoom(user1, user2, difficulty) {
  try {
    const newRoom = await createRoomModel({ user1, user2, difficulty });
    await newRoom.save();

    return {
      error: false,
      message: 'Room creation successful!',
      roomId: newRoom._id,
    };
  } catch (err) {
    return { error: true, message: err };
  }
}

export async function ormDeleteRoom(user) {
  try {
    await deleteRoomModel(user);
    return {
      error: false,
      message: 'Room deletion successful!',
      roomId: newRoom._id,
    };
  } catch (err) {
    return { error: true, message: err };
  }
}

import { createRoomModel } from './repository.js';

export async function ormCreateRoom(user1, user2, difficulty) {
    try {
        const newRoom = await createRoomModel({ user1, user2, difficulty });
        await newRoom.save();

        return { error: false, message: "Room creation successful!", roomId: newRoom._id }
    } catch (err) {
        return { error: true, message: err };
    }
}

import {
    ormCreateRoom as _createRoom
} from "../model/room-orm.js";

export async function createRoom(req, res) {
    try {
        const { user1, user2, difficulty } = req.body;

        if (user1 && user2 && difficulty) {
            if (difficulty < 0 || difficulty > 3) {
                return res.status(400).json({ message: "Unknown difficulty level!" });
            }

            _createRoom({user1, user2, difficulty}).then((res) => {
                if (res.error) {
                    return res.status(500).json({ message: res.message });
                }

                return res.status(201).json({ roomId: res.roomId });
            })
        }

        res.status(400).json({ message: "Incorrect request parameters!" });
    } catch (err) {
        return res.status(500).json({ message: "Database failure when creating new room!" })
    }
}
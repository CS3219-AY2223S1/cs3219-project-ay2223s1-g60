import {
    ormCreateHistory as _createHistory,
    ormGetHistory as _getHistory,
    ormGetAllHistories as _getAllHistories
} from "../model/history-orm.js";

export async function createHistory(req, res) {
    try {
        const { username1, username2, question, chats, code, roomId } = req.body;
        console.log("BODY: ", req.body);
        if ( username1, username2, question, chats, code, roomId ) {

            const historyBody = {
                username1: username1,
                username2: username2,
                question: question,
                chats: chats,
                code: code,
                roomId: roomId
            };

            const history = await _createHistory(historyBody);
            if (history.err) {
                console.log(history.err);
                return res.status(400).json({ message: "Could not insert history!" });
            } else {
                return res.status(201).json({ message: "Successfully added history entry!" });
            }
        } else {
            return res.status(400).json({ message: "Username is missing!" });
        }
    } catch (err) {
        return res.status(500).json({ message: "Database error!" });
    }

}

export async function getHistory(req, res) {
    try {
        const { username, roomId } = req.params;
        if ( username && roomId ) {
            const history = await _getHistory(username, roomId);
            if (history.err) {
                return res.status(400).json({ message: "Could not fetch histories!" });
            } else {
                return res.status(201).json({
                    history: history,
                });
            }
        } else {
            return res
                .status(400)
                .json({ message: "Username is missing!" });
        }
    } catch (err) {
        return res.status(500).json({ message: "Database error!" });
    }
        
}

export async function getHistoryList(req, res) {
    try {
        const { username } = req.params;
        if ( username ) {
            const histories = await _getAllHistories(username);
            if (histories.err) {
                return res.status(400).json({ message: "Could not fetch histories!" });
            } else {
                return res.status(201).json({
                    histories: histories,
                });
            }
        } else {
            return res
                .status(400)
                .json({ message: "Username is missing!" });
        }
    } catch (err) {
        return res.status(500).json({ message: "Database error!" });
    }
}

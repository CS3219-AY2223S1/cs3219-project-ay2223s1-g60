import HistoryModel from "./history-model.js";
import "dotenv/config";

//Set up mongoose connection
import mongoose from "mongoose";

let mongoDB =
  process.env.ENV === "PROD"
    ? process.env.DB_CLOUD_URI
    : process.env.DB_LOCAL_URI;

mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

let db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => console.log("Successfully connected to MongoDB"));

// CREATE FUNCTION
export async function createHistory(params) {
  return await HistoryModel.create({
    username1: params.username1,
    username2: params.username2,
    roomId: params.roomId,
    question: params.question,
    chats: params.chats,
    code: params.code
  });
  // return new UserModel(params);
}

// READ FUNCTION
export async function getAllHistories(username) {
  const histories = await HistoryModel.find(
    { 
      $or: [
      { username1: username }, { username2: username }
    ]
  } , "username1 username2 roomId question"
  );

  return histories;
}

export async function getHistory(username, roomId) {
  const history = await HistoryModel.find(
    { 
      $and: [
        { $or: [
          { username1: username }, { username2: username }
        ]}, 
        { roomId: roomId }
      ]
  });

  return history;
}

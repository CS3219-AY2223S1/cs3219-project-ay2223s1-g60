import "dotenv/config";
import RoomModel from "./room-model.js";

//Set up mongoose connection
import mongoose from "mongoose";

let mongoDB =
  process.env.ENV == "PROD"
    ? process.env.DB_CLOUD_URI
    : process.env.DB_LOCAL_URI;

mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

let db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => console.log("Successfully connected to MongoDB"));

export async function createRoomModel(params) {
  return new RoomModel(params);
}

export async function getRoomModel(roomId) {
  return RoomModel.findOne({ _id: mongoose.Types.ObjectId(roomId) });
}

export async function updateRoomModelQuestion(params) {
  return RoomModel.findOneAndUpdate(
    { _id: mongoose.Types.ObjectId(params.roomId) },
    { $set: { question: params.question } },
    { returnDocument: "after" }
  );
}

export async function deleteRoomModel(roomId) {
  return RoomModel.deleteOne({ _id: mongoose.Types.ObjectId(roomId) });
}

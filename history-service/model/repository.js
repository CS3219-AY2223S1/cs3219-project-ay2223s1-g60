import HistoryModel from './history-model.js';
import 'dotenv/config';

//Set up mongoose connection
import mongoose from 'mongoose';

let mongoDB =
  process.env.ENV === 'PROD'
    ? process.env.DB_CLOUD_URI
    : process.env.DB_LOCAL_URI;

mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => console.log('Successfully connected to MongoDB'));

// CREATE FUNCTION
export async function createHistory(params) {
  return await HistoryModel.create({
    user1: params.user1,
    user2: params.user2,
    roomId: params.roomId,
    question: params.question,
    chats: params.chats,
    code: params.code,
  });
  // return new UserModel(params);
}

// READ FUNCTION
export async function getAllHistories(user_id) {
  const histories = await HistoryModel.find(
    {
      $or: [{ 'user1.user_id': user_id }, { 'user2.user_id': user_id }],
    },
    'user1 user2 roomId question'
  );
  return histories;
}

export async function getHistory(user_id, roomId) {
  const history = await HistoryModel.findOne({
    $and: [
      {
        $or: [{ 'user1.user_id': user_id }, { 'user2.user_id': user_id }],
      },
      { roomId: roomId },
    ],
  });

  return history;
}

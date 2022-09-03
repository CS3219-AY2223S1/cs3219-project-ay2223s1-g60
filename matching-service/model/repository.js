import 'dotenv/config';
import MatchModel from './match-model.js';

//Set up mongoose connection
import mongoose from 'mongoose';

let mongoDB =
  process.env.ENV == 'PROD'
    ? process.env.DB_CLOUD_URI
    : process.env.DB_LOCAL_URI;

mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => console.log('Successfully connected to MongoDB'));

// TODO: Implement function findMatch, etc...
export async function findMatch(params) {
  return await MatchModel.findOne({
    difficulty: params.difficulty,
    sessionInfo: null,
  });
}

export async function createMatch(params) {
  console.log('createMatch: ', params);
  return new MatchModel(params);
}

export async function updateMatch(params) {
  return await MatchModel.updateOne(
    { username: params.matchedUser },
    { matchedUser: params.username }
  );
}

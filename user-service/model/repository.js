import UserModel from './user-model.js';
import 'dotenv/config';

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

export async function createUser(params) {
  return new UserModel(params);
}

export async function deleteToken(username, token) {
  console.log("Username : ", username);
  console.log("Token : ", token);
  const user = await UserModel.findOne({username:username});
  return await user.updateOne({ $unset: { token:"" }});
  // await UserModel.updateOne( {username:username, token: token}, { $unset: { token:"" }})
}

export async function getToken(username) {
    const user = await UserModel.findOne({username:username}, "token");
    return user.token;
}

export async function getUser(params) {
  const user = await UserModel.findOne({ username: params.username });
  if (user && user.comparePassword(params.password)) {
    return user;
  }
}

export async function addTokenToUser(params) {
  const updated = await UserModel.updateOne(
    { username: params.username },
    { $set: { token: params.token } }
  );
  console.log("Updated: " + JSON.stringify(updated));
  return updated;
}

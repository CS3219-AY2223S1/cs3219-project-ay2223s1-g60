import UserModel from './user-model.js';
import 'dotenv/config';

//Set up mongoose connection
import mongoose from 'mongoose';

let mongoDB = process.env.ENV == "PROD" ? process.env.DB_CLOUD_URI : process.env.DB_LOCAL_URI;

mongoose.connect(mongoDB, { useNewUrlParser: true , useUnifiedTopology: true});

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

export async function createUser(params) { 
  return new UserModel(params)
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
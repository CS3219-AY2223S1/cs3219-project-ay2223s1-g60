import {
  createUser,
  deleteToken,
  getToken,
  addTokenToUser,
  getUser,
} from "./repository.js";
import "dotenv/config";
import mongooseErrorHandler from "mongoose-validation-error-message-handler";

//need to separate orm functions from repository to decouple business logic from persistence
export async function ormCreateUser(username, hashedPassword) {
  try {
    const newUser = await createUser({ username, hashedPassword });

    let res = true;
    await newUser.save((err) => {
      if (err) {
        if (err.name === "MongoServerError" && err.code === 11000) {
          console.log("ORM1 error : ", JSON.stringify(err));
          const error = mongooseErrorHandler(err, {
            messages: {
              string: 'Duplicate username! GBLK'
            }
          });
          console.log("ORM2 error : ", error);
          return err;
        }
      } else {
        return true;
      }
    });
    return res;
  } catch (err) {
    console.log("ERROR: Could not create new user");
    return { err };
  }
}

export async function ormDeleteToken(username, token) {
  try {
    return await deleteToken(username, token);
  } catch (err) {
    console.log(`ERROR: Could not delete token from DB.`);
    return { err };
  }
}

export async function ormGetToken(username, token) {
  try {
    const dbToken = await getToken(username);
    return dbToken;
  } catch (err) {
    return { err };
  }
}

export async function ormGetUser(username, password) {
  try {
    const user = await getUser({ username, password });
    return user;
  } catch (err) {
    console.log(
      `ERROR: Could not get user from DB. Wrong username / password.`
    );
    return { err };
  }
}

export async function ormAddTokenToUser(username, token) {
  try {
    const updated = await addTokenToUser({ username: username, token: token });
    return updated;
  } catch (err) {
    console.log(`ERROR: Could not add token to DB.`);
    return { err };
  }
}

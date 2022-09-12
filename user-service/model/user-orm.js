import {
  createUser,
  deleteToken,
  getToken,
  addTokenToUser,
  getUser,
  changePassword,
  changeUsername,
  deleteUser,
} from "./repository.js";
import "dotenv/config";

//need to separate orm functions from repository to decouple business logic from persistence

// CREATE FUNCTION
export async function ormCreateUser(username, hashedPassword) {
  try {
    const newUser = await createUser({ username, hashedPassword });
    newUser.save();
    return true;
  } catch (err) {
    return { err };
  }
}

// READ FUNCTION
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

// UPDATE FUNCTION
export async function ormChangePassword(
  username,
  oldPassword,
  newHashedPassword
) {
  try {
    const updatedUser = await changePassword({
      username,
      oldPassword,
      newHashedPassword,
    });
    console.log(updatedUser);

    return updatedUser;
  } catch (err) {
    return { err };
  }
}

export async function ormChangeUsername(username, newUsername, password) {
  try {
    const updatedUser = await changeUsername({
      username,
      newUsername,
      password,
    });
    console.log(updatedUser);
    return updatedUser;
  } catch (err) {
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

// DELETE FUNCTION
export async function ormDeleteToken(username, token) {
  try {
    return await deleteToken(username, token);
  } catch (err) {
    console.log(`ERROR: Could not delete token from DB.`);
    return { err };
  }
}

export async function ormDeleteUser(username, password) {
  const isDeleted = await deleteUser(username, password);
  return isDeleted;
}

import { addTokenToUser, createUser, getUser } from "./repository.js";

//need to separate orm functions from repository to decouple business logic from persistence
export async function ormCreateUser(username, hashedPassword) {
  try {
    const newUser = await createUser({ username, hashedPassword });
    newUser.save();
    return true;
  } catch (err) {
    console.log("ERROR: Could not create new user");
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

import {
  URL_USER_SIGNUP,
  URL_USER_LOGIN,
  URL_USER_LOGOUT,
  URL_USER_LOGIN_WITH_TOKEN,
  LOCAL_STORAGE_TOKEN_KEY,
  LOCAL_STORAGE_USERNAME_KEY,
  URL_USER_DELETE_USER,
  URL_USER_CHANGE_USERNAME,
  URL_USER_CHANGE_PASSWORD,
} from "../configs";
import {
  STATUS_CODE_CONFLICT,
  UNAME_PASSWORD_MISSING,
} from "../constants";

import axios from "axios";

async function signUp(username: string, password: string): Promise<any> {
  const body = {
    username: username,
    password: password,
  };

  const resp = await axios.post(URL_USER_SIGNUP, body).catch((err) => {
    if (err.response.status === STATUS_CODE_CONFLICT) {
      throw new Error("This username already exists");
    } else {
      throw new Error("Please try again later");
    }
  });

  return resp;
}

async function loginWithUsername(
  username: string,
  password: string
): Promise<any> {
  const body = {
    username: username,
    password: password,
  };

  const resp = await axios.post(URL_USER_LOGIN, body).catch((err) => {
    if (err.response.status === UNAME_PASSWORD_MISSING) {
      throw new Error("Username or password is missing!");
    } else {
      throw new Error("Username or password is incorrect!");
    }
  });

  const data = resp.data;
  window.localStorage.setItem(LOCAL_STORAGE_TOKEN_KEY, data.token);
  window.localStorage.setItem(LOCAL_STORAGE_USERNAME_KEY, data.username);
  return data.username;
}

async function loginWithToken(): Promise<any> {
  const token = window.localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY);
  const username = window.localStorage.getItem(LOCAL_STORAGE_USERNAME_KEY);
  let headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const body = {
    username: username,
  };

  const resp = await axios
    .post(URL_USER_LOGIN_WITH_TOKEN, body, { headers: headers })
    .catch((err) => {
      if (err.response.status === 400) {
        throw new Error("Your token is invalid");
      } else {
        throw new Error("Username or password is incorrect!");
      }
    });

  return username;
}

async function logout(): Promise<any> {
  const token = window.localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY);
  const username = window.localStorage.getItem(LOCAL_STORAGE_USERNAME_KEY);

  const body = {
    username: username,
    token: token,
  };

  const resp = await axios.post(URL_USER_LOGOUT, body).catch((err) => {
    console.log("Response login with token :", err);
    if (err.response.status === UNAME_PASSWORD_MISSING) {
      throw new Error("Username or password is missing!");
    } else {
      throw new Error("Username or password is incorrect!");
    }
  });

  window.localStorage.removeItem(LOCAL_STORAGE_TOKEN_KEY);
  window.localStorage.removeItem(LOCAL_STORAGE_USERNAME_KEY);

  return resp;
}

const changeUsername = async (
  username: string,
  newUsername: string,
  password: string
) => {
  const body = {
    username: username,
    newUsername: newUsername,
    password: password,
  };

  const resp = await axios.post(URL_USER_CHANGE_USERNAME, body).catch((err) => {
    if (err.response) {
      throw new Error("Change password failed");
    }
  });

  window.localStorage.setItem(LOCAL_STORAGE_USERNAME_KEY, newUsername);
  return newUsername;
};

const changePassword = async (
  username: string,
  currentPassword: string,
  newPassword: string
) => {
  const body = {
    username: username,
    newPassword: newPassword,
    oldPassword: currentPassword,
  };

  const resp = await axios.post(URL_USER_CHANGE_PASSWORD, body).catch((err) => {
    if (err.response) {
      throw new Error("Change password failed");
    }
  });
};

async function deleteUser(): Promise<any> {
  const username = window.localStorage.getItem(LOCAL_STORAGE_USERNAME_KEY);

  const body = {
    username: username,
  };

  const resp = await axios
    .delete(URL_USER_DELETE_USER, { data: body })
    .catch((err) => {
      if (err.response) {
        throw new Error("Logout failed");
      } else {
        console.log(resp);
      }
    });

  window.localStorage.removeItem(LOCAL_STORAGE_USERNAME_KEY);
  window.localStorage.removeItem(LOCAL_STORAGE_TOKEN_KEY);
  // await logout();
  return resp;
}

export {
  loginWithUsername,
  loginWithToken,
  signUp,
  logout,
  deleteUser,
  changeUsername,
  changePassword,
};

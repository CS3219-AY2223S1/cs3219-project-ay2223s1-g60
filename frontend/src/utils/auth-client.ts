import {
  LOCAL_STORAGE_TOKEN_KEY,
  LOCAL_STORAGE_USERNAME_KEY,
  URL_USER_CHANGE_PASSWORD,
  URL_USER_CHANGE_USERNAME,
  URL_USER_DELETE_USER,
  URL_USER_LOGIN,
  URL_USER_LOGIN_WITH_TOKEN,
  URL_USER_LOGOUT,
  URL_USER_SIGNUP,
  URL_USER_SVC,
  USER_LOGIN,
  USER_LOGIN_WITH_TOKEN,
  USER_SIGNUP,
} from "../configs";
import { STATUS_CODE_CONFLICT, UNAME_PASSWORD_MISSING } from "../constants";
import { Response } from "../@types/UserContext";

import axios, { AxiosResponse } from "axios";

const instance = axios.create({
  baseURL: URL_USER_SVC,
  timeout: 15000,
});

const responseBody = (response: AxiosResponse) => {
  const res: Response<typeof response.data> = {
    status: response.status,
    statusText: response.statusText,
    data: response.data,
  };

  return res;
};

const requests = {
  get: (url: string) =>
    instance
      .get(url)
      .then(responseBody)
      .catch((err) => responseBody(err.response)),
  post: (url: string, body: {}) =>
    instance
      .post(url, body)
      .then(responseBody)
      .catch((err) => responseBody(err.response)),
  postWithHeaders: (url: string, body: {}, headers: {}) =>
    instance
      .post(url, body, headers)
      .then(responseBody)
      .catch((err) => responseBody(err.response)),
  put: (url: string, body: {}) =>
    instance
      .put(url, body)
      .then(responseBody)
      .catch((err) => responseBody(err.response)),
  delete: (url: string) =>
    instance
      .delete(url)
      .then(responseBody)
      .catch((err) => responseBody(err.response)),
};

export const AuthClient = {
  signUp: (body: {
    username: string;
    password: string;
  }): Promise<Response<{}>> => requests.post(USER_SIGNUP, body),

  loginWithUname: (body: {
    username: string;
    password: string;
  }): Promise<Response<{ username: string; token: string }>> =>
    requests.post(USER_LOGIN, body),

  loginWithToken: (
    token: string,
    username: string
  ): Promise<Response<{ message: string; username: string }>> => {
    let headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    return requests.postWithHeaders(
      USER_LOGIN_WITH_TOKEN,
      { username },
      { headers }
    );
  },
};

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

export { logout, deleteUser, changeUsername, changePassword };

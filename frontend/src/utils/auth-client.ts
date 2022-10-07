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
  USER_CHANGE_USERNAME,
  USER_LOGIN,
  USER_LOGIN_WITH_TOKEN,
  USER_LOGOUT,
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

  logout: (body: {
    token: string;
    username: string;
  }): Promise<Response<{}>> => {
    return requests.post(USER_LOGOUT, body);
  },

  changeUsername: (body: {
    username: string;
    newUsername: string;
    password: string;
  }): Promise<Response<{}>> => {
    return requests.post(USER_CHANGE_USERNAME, body);
  },
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

export { deleteUser, changePassword };

import axios, { AxiosResponse } from "axios";
import {
  URL_USER_SVC,
  USER_CHANGE_PASSWORD,
  USER_CHANGE_USERNAME,
  USER_DELETE_USER,
  USER_LOGIN,
  USER_LOGIN_WITH_TOKEN,
  USER_LOGOUT,
  USER_SIGNUP,
} from "../configs";

declare namespace API {
  type Response<T> = {
    status: number;
    statusText: string;
    data: T;
  };
}

const instance = axios.create({
  baseURL: URL_USER_SVC,
  timeout: 15000,
});

const responseBody = (response: AxiosResponse) => {
  const res: API.Response<typeof response.data> = {
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
  delete: (url: string, body: {}) =>
    instance
      .delete(url, body)
      .then(responseBody)
      .catch((err) => responseBody(err.response)),
};

export const AuthClient = {
  signUp: (body: {
    username: string;
    password: string;
  }): Promise<API.Response<{ message: string }>> =>
    requests.post(USER_SIGNUP, body),

  loginWithUname: (body: {
    username: string;
    password: string;
  }): Promise<
    API.Response<{ username: string; token: string; message: string }>
  > => requests.post(USER_LOGIN, body),

  loginWithToken: (
    token: string,
    username: string
  ): Promise<API.Response<{ message: string; username: string }>> => {
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
  }): Promise<API.Response<{ message: string }>> => {
    return requests.post(USER_LOGOUT, body);
  },

  changeUsername: (body: {
    username: string;
    newUsername: string;
    password: string;
  }): Promise<API.Response<{ message: string }>> => {
    return requests.post(USER_CHANGE_USERNAME, body);
  },

  changePassword: (body: {
    username: string;
    oldPassword: string;
    newPassword: string;
  }): Promise<API.Response<{ message: string }>> => {
    return requests.post(USER_CHANGE_PASSWORD, body);
  },

  deleteUser: (data: {
    username: string;
  }): Promise<API.Response<{ message: string }>> => {
    return requests.delete(USER_DELETE_USER, { data });
  },
};

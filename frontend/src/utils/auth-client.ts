import axios, { AxiosResponse } from 'axios';
import {
  URL_USER_SVC,
  USER_CHANGE_PASSWORD,
  USER_CHANGE_USERNAME,
  USER_DELETE_USER,
  USER_LOGIN,
  USER_LOGIN_WITH_TOKEN,
  USER_LOGOUT,
  USER_SIGNUP,
} from '../configs';
import { requests, API } from './api-request';

export const AuthClient = {
  signUp: (body: {
    username: string;
    password: string;
  }): Promise<API.Response<{ message: string }>> =>
    requests.post(URL_USER_SVC, USER_SIGNUP, body),

  loginWithUname: (body: {
    username: string;
    password: string;
  }): Promise<
    API.Response<{ username: string; token: string; message: string }>
  > => requests.post(URL_USER_SVC, USER_LOGIN, body),

  loginWithToken: (
    token: string,
    username: string
  ): Promise<API.Response<{ message: string; username: string }>> => {
    let headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };

    return requests.postWithHeaders(
      URL_USER_SVC,
      USER_LOGIN_WITH_TOKEN,
      { username },
      { headers }
    );
  },

  logout: (body: {
    token: string;
    username: string;
  }): Promise<API.Response<{ message: string }>> => {
    return requests.post(URL_USER_SVC, USER_LOGOUT, body);
  },

  changeUsername: (
    headers: { Authorization: string },
    body: {
      username: string;
      newUsername: string;
      password: string;
    }
  ): Promise<API.Response<{ message: string }>> => {
    return requests.postWithHeaders(URL_USER_SVC, USER_CHANGE_USERNAME, body, {
      headers: headers,
    });
  },

  changePassword: (
    headers: { Authorization: string },
    body: {
      username: string;
      oldPassword: string;
      newPassword: string;
    }
  ): Promise<API.Response<{ message: string }>> => {
    return requests.postWithHeaders(URL_USER_SVC, USER_CHANGE_PASSWORD, body, {
      headers: headers,
    });
  },

  deleteUser: (data: {
    username: string;
  }): Promise<API.Response<{ message: string }>> => {
    return requests.delete(URL_USER_SVC, USER_DELETE_USER, { data });
  },
};

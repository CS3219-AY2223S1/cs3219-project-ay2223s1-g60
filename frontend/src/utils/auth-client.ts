import {
  URI_ROOM_SVC,
  URL_MATCHING_SVC,
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
import { getTokens } from '../context/UserContext';
import { QuestionModel } from '../components/room/QuestionModel';

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

  changeUsername: (body: {
    username: string;
    newUsername: string;
    password: string;
  }): Promise<API.Response<{ message: string }>> => {
    const headers = {
      Authorization: `Bearer ${getTokens().token}`,
      'Content-Type': 'application/json',
    };
    return requests.postWithHeaders(URL_USER_SVC, USER_CHANGE_USERNAME, body, {
      headers: headers,
    });
  },

  changePassword: (body: {
    username: string;
    oldPassword: string;
    newPassword: string;
  }): Promise<API.Response<{ message: string }>> => {
    const headers = {
      Authorization: `Bearer ${getTokens().token}`,
      'Content-Type': 'application/json',
    };
    return requests.postWithHeaders(URL_USER_SVC, USER_CHANGE_PASSWORD, body, {
      headers: headers,
    });
  },

  deleteUser: (data: {
    username: string;
  }): Promise<API.Response<{ message: string }>> => {
    return requests.delete(URL_USER_SVC, USER_DELETE_USER, { data });
  },

  authRoom: (data: {
    username: string;
    room: string;
    token: string;
  }): Promise<API.Response<{ message: string }>> => {
    const { username, room, token } = data;
    const body = { username, roomId: room };
    const headers = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };

    return requests.postWithHeaders(
      URL_MATCHING_SVC,
      '/api/matching/verify-user',
      body,
      headers
    );
  },

  getQuestion: (data: {
    room: string;
  }): Promise<API.Response<{ question: QuestionModel }>> => {
    return requests.get(URI_ROOM_SVC, `?roomId=${data.room}`);
  },
};

import { RoomModel } from '../@types/RoomContext';
import { QuestionModel } from '../components/room/QuestionModel';
import { URI_ROOM_SVC, URL_MATCHING_SVC } from '../configs';
import { API, requests } from './api-request';

const APIRoom = {
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

  getRoom: (roomId: string): Promise<API.Response<RoomModel>> => {
    return requests.get(URI_ROOM_SVC, `/?roomId=${roomId}`);
  },
};

export default APIRoom;

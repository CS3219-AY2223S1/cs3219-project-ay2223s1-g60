import { RoomModel } from '../@types/RoomContext';
import { HistoryModel } from '../components/room/HistoryModel';
import { URL_HISTORY_SVC } from '../configs';
import { getTokens } from '../context/UserContext';
import { API, requests } from './api-request';

const APIHistory = {
  getHistories: (): Promise<API.Response<{ histories: HistoryModel[] }>> => {
    const { token, username } = getTokens();
    let headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };

    return requests.get(URL_HISTORY_SVC, `/historyList/${username}`, {
      headers,
    });
  },

  getHistory: (
    roomId: string
  ): Promise<API.Response<{ history: HistoryModel }>> => {
    const { token, username } = getTokens();
    let headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };

    return requests.get(URL_HISTORY_SVC, `/${username}/${roomId}`, { headers });
  },

  createHistory: (
    history: HistoryModel
  ): Promise<API.Response<{ message: string }>> => {
    const { token, username } = getTokens();

    let headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };

    return requests.postWithHeaders(URL_HISTORY_SVC, `/${username}`, history, {
      headers,
    });
  },
};

export default APIHistory;

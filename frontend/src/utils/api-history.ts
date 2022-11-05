import { RoomModel } from '../@types/RoomContext';
import { HistoryModel } from '../components/room/HistoryModel';
import { URL_HISTORY_SVC } from '../configs';
import { getTokens } from '../context/UserContext';
import { API, requests } from './api-request';

const APIHistory = {
  getHistories: (
    user_id: string
  ): Promise<API.Response<{ histories: HistoryModel[] }>> => {
    const { token } = getTokens();
    let headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };

    return requests.get(URL_HISTORY_SVC, `/historyList/${user_id}`, {
      headers,
    });
  },

  getHistory: (
    roomId: string,
    user_id: string
  ): Promise<API.Response<{ history: HistoryModel }>> => {
    const { token } = getTokens();
    let headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };

    return requests.get(URL_HISTORY_SVC, `/${user_id}/${roomId}`, { headers });
  },

  createHistory: (
    history: HistoryModel,
    user_id: string
  ): Promise<API.Response<{ message: string }>> => {
    const { token } = getTokens();

    let headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };

    return requests.postWithHeaders(URL_HISTORY_SVC, `/${user_id}`, history, {
      headers,
    });
  },
};

export default APIHistory;

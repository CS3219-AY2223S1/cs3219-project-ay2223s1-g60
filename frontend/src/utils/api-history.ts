import { HistoryModel } from '../components/room/HistoryModel';
import { URL_HISTORY_SVC } from '../configs';
import { getTokens } from '../context/UserContext';
import { API, requests } from './api-request';

const APIHistory = {
  getHistories: (
    user: string
  ): Promise<API.Response<{ histories: HistoryModel[] }>> => {
    let headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokens().token}`,
    };

    return requests.get(URL_HISTORY_SVC, `/historyList/${user}`, { headers });
  },

  getHistory: (
    user: string,
    roomId: string
  ): Promise<API.Response<{ history: HistoryModel }>> => {
    let headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokens().token}`,
    };

    return requests.get(URL_HISTORY_SVC, `/${user}/${roomId}`, { headers });
  },
};

export default APIHistory;
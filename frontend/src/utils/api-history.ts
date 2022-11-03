import { HistoryModel } from '../components/room/HistoryModel';
import { URL_HISTORY_SVC } from '../configs';
import { getTokens, useUser } from '../context/UserContext';
import { API, requests } from './api-request';

const user = useUser().username;

const APIHistory = {
  getHistories: (): Promise<API.Response<{ histories: HistoryModel[] }>> => {
    let headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokens().token}`,
    };

    return requests.get(URL_HISTORY_SVC, `/historyList/${user}`, { headers });
  },
};

export default APIHistory;

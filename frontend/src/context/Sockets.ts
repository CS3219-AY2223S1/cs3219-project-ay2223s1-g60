import { io } from 'socket.io-client';
import {
  URL_COLLABORATION_SVC,
  URL_COMMUNICATION_SVC,
  URL_MATCHING_SVC,
} from '../configs';

const sockets = {
  roomSocket: io(URL_MATCHING_SVC),
  chatSocket: io(URL_COMMUNICATION_SVC),
  collabSocket: io(URL_COLLABORATION_SVC),
};

export default sockets;

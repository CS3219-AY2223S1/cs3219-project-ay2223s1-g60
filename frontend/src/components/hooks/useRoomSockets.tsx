import React from 'react';
import { io } from 'socket.io-client';
import {
  URL_COLLABORATION_SVC,
  URL_COMMUNICATION_SVC,
  URL_MATCHING_SVC,
} from '../../configs';
import { useUser } from '../../context/UserContext';

const useRoomSockets = (room: string) => {
  const user = useUser().username;
  const collabSocket = io(URL_COLLABORATION_SVC, { query: { room: room } });
  const chatSocket = io(URL_COMMUNICATION_SVC, { query: { room: room } });
  const timerSocket = io(URL_MATCHING_SVC);

  chatSocket.on('join-room', () =>
    chatSocket.emit('get-role', { room: room, username: user })
  );

  chatSocket.on('disconnect', () =>
    chatSocket.emit('delete-room', { room: room })
  );

  timerSocket.on('disconnect', () =>
    timerSocket.emit('delete-room', { room: room })
  );

  return {
    timerSocket: timerSocket,
    chatSocket: chatSocket,
    collabSocket: collabSocket,
  };
};

export default useRoomSockets;

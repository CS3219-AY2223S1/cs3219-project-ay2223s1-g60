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
  const roomSocket = io(URL_MATCHING_SVC);

  chatSocket.on('join-room', () =>
    chatSocket.emit('get-role', { room: room, username: user })
  );

  chatSocket.on('disconnect', () =>
    chatSocket.emit('delete-room', { room: room })
  );

  roomSocket.on('disconnect', () =>
    roomSocket.emit('delete-room', { room: room })
  );

  roomSocket.on('connect', () => {
    roomSocket.emit('join-room', { room: room });
  });

  return { roomSocket, chatSocket, collabSocket };
};

export default useRoomSockets;

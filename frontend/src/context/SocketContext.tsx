import React, { createContext, useContext } from 'react';
import APIRoom from '../utils/api-room';
import { useSnackbar } from './SnackbarContext';
import sockets from './Sockets';
import { getRoomToken, useUser } from './UserContext';

const SocketContext = createContext({
  ...sockets,
  joinRoom: (room: string, onFail: VoidFunction) => {},
});

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const username = useUser().username;
  const snackbar = useSnackbar();

  const authenticate = (room: string) => {
    const token = getRoomToken();

    return username && token
      ? APIRoom.authRoom({ username, room, token }).then(
          ({ status }) => status === 201
        )
      : new Promise<boolean>(() => false);
  };

  const joinRoom = async (room: string, onFail: VoidFunction) => {
    const authenticated = await authenticate(room);
    if (!authenticated) {
      snackbar.setError('User not authorized to access room');
      onFail();
      return;
    }

    const { roomSocket, chatSocket, collabSocket } = sockets;

    roomSocket.emit('join-room', { room });
    collabSocket.emit('join-room', { room });
    chatSocket.emit('join-room', { room });

    chatSocket.on('joined-room', () =>
      chatSocket.emit('get-role', { room, username })
    );

    chatSocket.on('disconnect', () => chatSocket.emit('delete-room', { room }));
    roomSocket.on('disconnect', () => roomSocket.emit('delete-room', { room }));
  };

  return (
    <SocketContext.Provider value={{ ...sockets, joinRoom }}>
      {children}
    </SocketContext.Provider>
  );
}

const useSockets = () => useContext(SocketContext);

export { useSockets };

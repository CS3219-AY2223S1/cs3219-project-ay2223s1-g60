import React, { createContext, useContext } from 'react';
import sockets from './Sockets';

const SocketContext = createContext({
  ...sockets,
  joinRoom: (room: string, user: string) => {},
});

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const joinRoom = (room: string, user: string) => {
    const { roomSocket, chatSocket, collabSocket } = sockets;

    roomSocket.emit('join-room', { room });
    collabSocket.emit('join-room', { room });
    chatSocket.emit('join-room', { room });

    chatSocket.on('joined-room', () => {
      chatSocket.emit('fetch-messages', { room });
      chatSocket.emit('get-role', { room, username: user });
    });

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

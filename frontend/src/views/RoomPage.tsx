import React from 'react';
import { io } from 'socket.io-client';
import ChatBox from '../components/room/ChatBox';
import CodeEditor from '../components/room/CodeEditor';
import CodingQuestion from '../components/room/CodingQuestion';

function RoomPage() {
  const socket = io('http://localhost:8001');

  return (
    <div>
      <CodingQuestion />
      <CodeEditor />
      <ChatBox socket={socket} />
    </div>
  );
}

export default RoomPage;

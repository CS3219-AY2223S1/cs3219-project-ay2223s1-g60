import React from 'react';
import { io } from 'socket.io-client';
import { Stack } from '@mui/material';
import ChatBox from '../components/room/ChatBox';
import CodeEditor from '../components/room/CodeEditor';
import CodingQuestion from '../components/room/CodingQuestion';

function RoomPage() {
  const socket = io('http://localhost:8001');

  return (
    <Stack direction={'row'} spacing={8} alignItems={'stretch'}>
      <Stack flex={1}>
        <CodingQuestion />
        <CodeEditor socket={socket} />
      </Stack>
      <ChatBox socket={socket} />
    </Stack>
  );
}

export default RoomPage;

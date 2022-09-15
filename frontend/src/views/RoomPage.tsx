import React from 'react';
import { Stack } from '@mui/material';
import ChatBox from '../components/room/ChatBox';
import CodeEditor from '../components/room/CodeEditor';
import CodingQuestion from '../components/room/CodingQuestion';
import { io } from 'socket.io-client';
import { URL_COLLABORATION_SVC, URL_COMMUNICATION_SVC } from '../configs';

function RoomPage() {
  const collabSocket = io(URL_COLLABORATION_SVC);
  const chatSocket = io(URL_COMMUNICATION_SVC);

  return (
    <Stack direction={'row'} spacing={8} alignItems={'stretch'}>
      <Stack flex={1}>
        <CodingQuestion />
        <CodeEditor socket={collabSocket} />
      </Stack>
      <ChatBox socket={chatSocket} />
    </Stack>
  );
}

export default RoomPage;

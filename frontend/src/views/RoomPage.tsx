import React, { useEffect } from 'react';
import { Stack } from '@mui/material';
import ChatBox from '../components/room/ChatBox';
import CodeEditor from '../components/room/CodeEditor';
import CodingQuestion from '../components/room/CodingQuestion';
import { io } from 'socket.io-client';
import { useLocation } from 'react-router-dom';
import { URL_COLLABORATION_SVC, URL_COMMUNICATION_SVC } from '../configs';

function RoomPage() {
  const { search } = useLocation();
  const room =
    React.useMemo(() => new URLSearchParams(search), [search]).get('id') || '0';
  const collabSocket = io(URL_COLLABORATION_SVC, { query: { room: room } });
  const chatSocket = io(URL_COMMUNICATION_SVC, { query: { room: room } });

  return (
    <Stack direction={'row'} spacing={8} alignItems={'stretch'}>
      <Stack flex={1}>
        <CodingQuestion />
        <CodeEditor socket={collabSocket} room={room} />
      </Stack>
      <ChatBox socket={chatSocket} room={room} />
    </Stack>
  );
}

export default RoomPage;

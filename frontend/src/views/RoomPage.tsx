import React from 'react';
import { Box, Stack } from '@mui/material';
import ChatBox from '../components/room/chat/ChatBox';
import CodeEditor from '../components/room/CodeEditor';
import CodingQuestion from '../components/room/CodingQuestion';
import { io } from 'socket.io-client';
import { useLocation } from 'react-router-dom';
import {
  URL_COLLABORATION_SVC,
  URL_COMMUNICATION_SVC,
  URL_MATCHING_SVC,
} from '../configs';
import TimerModal from '../components/modal/TimerModal';

function RoomPage() {
  const { search } = useLocation();
  const room =
    React.useMemo(() => new URLSearchParams(search), [search]).get('id') || '0';
  const collabSocket = io(URL_COLLABORATION_SVC, { query: { room: room } });
  const chatSocket = io(URL_COMMUNICATION_SVC, { query: { room: room } });
  const timerSocket = io(URL_MATCHING_SVC);

  return (
    <Box>
      <TimerModal socket={timerSocket} seconds={30} room={room} />
      <Stack direction={'row'} spacing={8} alignItems={'stretch'}>
        <Stack flex={1}>
          <CodingQuestion />
          <CodeEditor socket={collabSocket} room={room} />
        </Stack>
        <ChatBox socket={chatSocket} room={room} />
      </Stack>
    </Box>
  );
}

export default RoomPage;

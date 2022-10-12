import React from 'react';
import { Box, Stack } from '@mui/material';
import ChatBox from '../components/room/chat/ChatBox';
import CodeEditor from '../components/room/CodeEditor';
import CodingQuestion from '../components/room/CodingQuestion';
import { useLocation } from 'react-router-dom';
import TimerModal from '../components/modal/TimerModal';
import useRoomSockets from '../components/hooks/useRoomSockets';

function RoomPage() {
  const { search } = useLocation();

  const room =
    React.useMemo(() => new URLSearchParams(search), [search]).get('id') || '0';
  const { timerSocket, collabSocket, chatSocket } = useRoomSockets(room);

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

import React from 'react';
import { Box, Stack } from '@mui/material';
import { useLocation } from 'react-router-dom';
import ChatBox from '../components/room/chat/ChatBox';
import CodeEditor from '../components/room/CodeEditor';
import CodingQuestion from '../components/room/CodingQuestion';
import useRoomSockets from '../components/hooks/useRoomSockets';

function RoomPage() {
  const { search } = useLocation();
  const room =
    React.useMemo(() => new URLSearchParams(search), [search]).get('id') || '0';
  const { roomSocket, collabSocket, chatSocket } = useRoomSockets(room);

  return (
    <Box style={{ height: 'calc(100vh - 60px)' }}>
      <Stack
        direction={'row'}
        spacing={2}
        style={{ width: '100vw', maxHeight: '100%' }}
      >
        <CodingQuestion socket={roomSocket} room={room} />
        <CodeEditor socket={collabSocket} roomSocket={roomSocket} room={room} />
        <ChatBox socket={chatSocket} room={room} />
      </Stack>
    </Box>
  );
}

export default RoomPage;

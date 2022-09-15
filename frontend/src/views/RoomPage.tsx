import React from 'react';
import { Stack } from '@mui/material';
import ChatBox from '../components/room/ChatBox';
import CodeEditor from '../components/room/CodeEditor';
import CodingQuestion from '../components/room/CodingQuestion';

function RoomPage() {
  return (
    <Stack direction={'row'} spacing={8} alignItems={'stretch'}>
      <Stack flex={1}>
        <CodingQuestion />
        <CodeEditor />
      </Stack>
      <ChatBox />
    </Stack>
  );
}

export default RoomPage;

import React from 'react';
import { Socket } from 'socket.io-client';
import { Stack, Typography } from '@mui/material';
import ChatInput from './ChatInput';
import ChatView from './ChatView';

function ChatBox(props: { socket: Socket; room: string }) {
  const { socket, room } = props;
  return (
    <Stack
      spacing={2}
      paddingBottom={'2rem'}
      sx={{ position: 'sticky', width: '40%' }}
    >
      <Typography variant={'h3'}>Chat</Typography>
      <ChatView socket={socket} />
      <ChatInput socket={socket} room={room} />
    </Stack>
  );
}

export default ChatBox;

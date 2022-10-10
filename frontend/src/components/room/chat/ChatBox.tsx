import React, { useState } from 'react';
import { Socket } from 'socket.io-client';
import { Stack, Typography } from '@mui/material';
import ChatInput from './ChatInput';
import ChatView from './ChatView';
import { defaultRole, Roles } from './roles';

function ChatBox(props: { socket: Socket; room: string }) {
  const { socket, room } = props;
  const [roles, setRoles] = useState<Roles>(defaultRole);

  socket.on('assign-role', (roles: Roles) => setRoles(roles));

  return (
    <Stack
      spacing={2}
      paddingBottom={'2rem'}
      sx={{ position: 'sticky', width: '40%' }}
    >
      <Typography variant={'h3'}>Chat</Typography>
      <ChatView socket={socket} role={roles} />
      <ChatInput socket={socket} room={room} />
    </Stack>
  );
}

export default ChatBox;

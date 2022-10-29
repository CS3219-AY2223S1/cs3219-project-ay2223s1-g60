import React, { useState } from 'react';
import { Stack, Typography } from '@mui/material';
import ChatInput from './ChatInput';
import ChatView from './ChatView';
import { defaultRole, Roles } from './ChatModel.d';
import { useSockets } from '../../../context/SocketContext';

function ChatBox(props: { room: string }) {
  const { chatSocket: socket } = useSockets();
  const [roles, setRoles] = useState<Roles>(defaultRole);

  socket.on('assign-role', (roles: Roles) => setRoles(roles));

  return (
    <Stack
      spacing={2}
      sx={{
        width: '500px',
        justifyContent: 'space-between',
        paddingTop: '1rem',
      }}
    >
      <Typography variant={'h6'} sx={{ textAlign: 'center' }}>
        Chat
      </Typography>
      <ChatView role={roles} />
      <ChatInput room={props.room} />
    </Stack>
  );
}

export default ChatBox;

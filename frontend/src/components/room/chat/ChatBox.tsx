import React, { useState } from 'react';
import { Button, Stack, Typography } from '@mui/material';
import { CasinoRounded } from '@mui/icons-material';
import ChatInput from './ChatInput';
import ChatView from './ChatView';
import { Roles } from './ChatModel.d';
import { useSockets } from '../../../context/SocketContext';

function ChatBox(props: { room: string }) {
  const { room } = props;
  const { chatSocket: socket } = useSockets();
  const [roles, setRoles] = useState<Roles | undefined>();

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
      <Button
        fullWidth
        variant='outlined'
        endIcon={<CasinoRounded />}
        disabled={roles ? true : false}
        onClick={() => socket.emit('get-roles', { room })}
      >
        Assign Roles
      </Button>
      <ChatView role={roles} />
      <ChatInput room={room} />
    </Stack>
  );
}

export default ChatBox;

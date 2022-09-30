import React, { useState } from 'react';
import { Button, Stack, TextField } from '@mui/material';
import { Socket } from 'socket.io-client';

function ChatInput(props: { socket: Socket; room: string }) {
  const { socket, room } = props;
  const [message, setMessage] = useState('');
  const chatPlaceholder = 'Type your message here';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const data = { socketId: socket.id, name: 'User ID', room: room };
    setMessage(e.target.value);
    e.target.value.length !== 0
      ? socket.emit('typing', data)
      : socket.emit('stop-typing', data);
  };

  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    socket.emit('message', {
      text: message,
      name: 'User ID', // TODO: replace with actual user id
      id: `${socket.id}${Math.random()}`,
      socketId: socket.id,
      room: room,
    });
    setMessage('');
  };

  return (
    <form onSubmit={handleSendMessage}>
      <Stack direction={'row'} sx={{ position: 'absolute', bottom: 0 }}>
        <TextField
          placeholder={chatPlaceholder}
          value={message}
          onChange={handleChange}
          onKeyDown={(e) => e.key === 'Enter'}
          fullWidth={true}
        ></TextField>
        <Button variant={'contained'} type='submit'>
          Send
        </Button>
      </Stack>
    </form>
  );
}

export default ChatInput;

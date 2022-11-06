import React, { useState } from 'react';
import { Button, Stack, TextField } from '@mui/material';
import { useUser } from '../../../context/UserContext';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import { grey } from '@mui/material/colors';
import { useSockets } from '../../../context/SocketContext';
import { useRoom } from '../../../context/RoomContext';

function ChatInput() {
  const { chatSocket: socket } = useSockets();
  const username = useUser().username;
  const {
    room: { roomId },
  } = useRoom();

  const [message, setMessage] = useState('');
  const chatPlaceholder = 'Type your message here';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const data = { socketId: socket.id, name: username, room: roomId };
    setMessage(e.target.value);
    e.target.value.length !== 0
      ? socket.emit('typing', data)
      : socket.emit('stop-typing', data);
  };

  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (message.length === 0) return;
    socket.emit('message', {
      text: message,
      name: username,
      socketId: socket.id,
      room: roomId,
    });
    setMessage('');
  };

  return (
    <Stack
      direction={'row'}
      sx={{ backgroundColor: grey[100], padding: '0.8rem 1rem' }}
    >
      <form onSubmit={handleSendMessage} style={{ width: '100%' }}>
        <TextField
          placeholder={chatPlaceholder}
          value={message}
          onChange={handleChange}
          onKeyDown={(e) => e.key === 'Enter'}
          fullWidth={true}
          variant='standard'
          InputProps={{
            disableUnderline: true,
            endAdornment: (
              <Button variant='text' type='submit'>
                <SendRoundedIcon sx={{ color: grey[400] }} />
              </Button>
            ),
          }}
          sx={{ input: { color: grey[600] } }}
        ></TextField>
      </form>
    </Stack>
  );
}

export default ChatInput;

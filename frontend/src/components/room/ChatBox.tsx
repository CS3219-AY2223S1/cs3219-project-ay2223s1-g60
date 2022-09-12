import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { ChatModel } from './chat-model';
import { Socket } from 'socket.io-client';

type ChatBoxProps = {
  socket: Socket;
};

function ChatBox(props: ChatBoxProps) {
  const { socket } = props;
  const [chats, setChats] = useState<ChatModel[]>([]);
  const [message, setMessage] = useState('');

  const chatPlaceholder = 'Type your message here';

  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    socket.emit('message', {
      text: message,
      name: 'User ID', // TODO: replace with actual user id
      id: `${socket.id}${Math.random()}`,
      socketId: socket.id,
    });
    setMessage('');
  };

  const Message = (chat: ChatModel) => (
    <Box
      sx={{
        backgroundColor: 'primary.main',
        borderRadius: '16px',
        width: 'fit-content',
      }}
      paddingX={'1rem'}
      paddingY={'0.5rem'}
    >
      <Typography>{chat.text}</Typography>
    </Box>
  );

  useEffect(() => {
    socket.on('messageResponse', (data: ChatModel) => {
      console.log(data);
      setChats([...chats, data]);
    });
  }, [socket, chats]);

  return (
    <Box display={'flex'} flexDirection={'column'} padding={'4rem'}>
      <Stack spacing={2}>
        <Typography variant={'h3'}>Chat</Typography>
        <Container>
          <Stack spacing={1}>{chats.map((chat, i) => Message(chat))}</Stack>
        </Container>
        <form onSubmit={handleSendMessage}>
          <Stack direction={'row'}>
            <TextField
              placeholder={chatPlaceholder}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter'}
              sx={{ width: '100%' }}
            ></TextField>
            <Button variant={'contained'} type='submit'>
              Send
            </Button>
          </Stack>
        </form>
      </Stack>
    </Box>
  );
}

export default ChatBox;

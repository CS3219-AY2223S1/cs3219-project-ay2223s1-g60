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

function ChatBox(props: { socket: Socket }) {
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
        backgroundColor: `${
          chat.socketId === socket.id ? 'primary.main' : 'secondary.main'
        }`,
        borderRadius: '16px',
        width: 'fit-content',
        display: 'flex',
        alignSelf: `${chat.socketId === socket.id ? 'flex-end' : 'flex-start'}`,
      }}
      paddingX={'1rem'}
      paddingY={'0.5rem'}
    >
      <Typography
        sx={{
          textAlign: `${chat.socketId === socket.id ? 'right' : 'left'}`,
        }}
      >
        {chat.text}
      </Typography>
    </Box>
  );

  useEffect(() => {
    socket.on('messageResponse', (data: ChatModel) => {
      console.log(data);
      setChats([...chats, data]);
    });
  }, [socket, chats]);

  return (
    <Stack
      spacing={2}
      paddingBottom={'2rem'}
      sx={{ position: 'sticky', width: '40%' }}
    >
      <Typography variant={'h3'}>Chat</Typography>
      <Container>
        {chats.length === 0 && (
          <Typography>View your messages here...</Typography>
        )}
        <Stack spacing={1} display={'flex'}>
          {chats.map((chat, i) => Message(chat))}
        </Stack>
      </Container>
      <form onSubmit={handleSendMessage}>
        <Stack direction={'row'} sx={{ position: 'absolute', bottom: 0 }}>
          <TextField
            placeholder={chatPlaceholder}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter'}
            fullWidth={true}
          ></TextField>
          <Button variant={'contained'} type='submit'>
            Send
          </Button>
        </Stack>
      </form>
    </Stack>
  );
}

export default ChatBox;
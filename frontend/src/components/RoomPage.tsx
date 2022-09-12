import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Container,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { io } from 'socket.io-client';
import { ChatModel } from './chat-model';

function RoomPage() {
  const [codingQuestion, setCodingQuestion] = useState('Lorem Ipsum');
  const [chats, setChats] = useState<ChatModel[]>([]);
  const [message, setMessage] = useState('');

  const codeEditorPlaceholder = '/* Insert your code here */';
  const chatPlaceholder = 'Type your message here';

  const socket = io('http://localhost:8001');

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

  useEffect(() => {
    socket.on('messageResponse', (data) => {
      console.log(data);
      setChats([...chats, data]);
    });
  }, [socket, chats]);

  const Message = (msg: string) => (
    <Box
      sx={{ backgroundColor: 'primary.main' }}
      paddingX={'1rem'}
      paddingY={'0.5rem'}
    >
      <Typography>{msg}</Typography>
    </Box>
  );

  return (
    <div>
      <Box display={'flex'} flexDirection={'column'} padding={'4rem'}>
        <Stack spacing={2}>
          <Typography variant={'h3'} marginBottom={'2rem'}>
            Coding Question
          </Typography>
          <Button variant='contained'>Next Question</Button>
          <Container>
            <Typography>{codingQuestion}</Typography>
          </Container>
        </Stack>
      </Box>
      <Box display={'flex'} flexDirection={'column'} padding={'4rem'}>
        <Stack spacing={2}>
          <Typography variant={'h3'} marginBottom={'2rem'}>
            Code Editor
          </Typography>
          <TextField
            placeholder={codeEditorPlaceholder}
            multiline
            rows={20}
          ></TextField>
        </Stack>
      </Box>
      <Box display={'flex'} flexDirection={'column'} padding={'4rem'}>
        <Stack spacing={2}>
          <Typography variant={'h3'}>Chat</Typography>
          <Container>
            <Stack spacing={1}>
              {chats.map((chat, i) => Message(chat.text))}
            </Stack>
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
    </div>
  );
}

export default RoomPage;

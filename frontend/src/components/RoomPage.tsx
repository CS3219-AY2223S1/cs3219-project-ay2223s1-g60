import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

function RoomPage() {
  const [codingQuestion, setCodingQuestion] = useState('Lorem Ipsum');
  const [chats, setChats] = useState<string[]>([]);
  const [message, setMessage] = useState('');

  const codeEditorPlaceholder = '/* Insert your code here */';
  const chatPlaceholder = 'Type your message here';

  const sendMessage = () => {
    setChats([...chats, message]);
    setMessage('');
  };

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
            <Stack spacing={1}>{chats.map((chat, i) => Message(chat))}</Stack>
          </Container>
          <Stack direction={'row'}>
            <TextField
              placeholder={chatPlaceholder}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              sx={{ width: '100%' }}
            ></TextField>
            <Button variant={'contained'} onClick={sendMessage}>
              Send
            </Button>
          </Stack>
        </Stack>
      </Box>
    </div>
  );
}

export default RoomPage;

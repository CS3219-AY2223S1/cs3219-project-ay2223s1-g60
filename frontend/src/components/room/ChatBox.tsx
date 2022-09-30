import React, { useState, useEffect } from 'react';
import { Button, Container, Stack, TextField, Typography } from '@mui/material';
import { ChatModel } from './chat-model';
import { Socket } from 'socket.io-client';
import Message from './Message';

function ChatBox(props: { socket: Socket; room: string }) {
  const { socket, room } = props;
  const [chats, setChats] = useState<ChatModel[]>([]);
  const [typingMessage, setTypingMessage] = useState('');
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

  useEffect(() => {
    socket.on('messageResponse', (data: ChatModel) => {
      console.log(data);
      setChats([...chats, data]);
    });
  }, [socket, chats]);

  useEffect(() => {
    socket.on('stop-typingMessage', () => setTypingMessage(''));

    socket.on('typingMessage', (data: { socketId: string; name: string }) => {
      if (socket.id != data.socketId) {
        setTypingMessage(`${data.name} is typing`);
      }
    });
  }, [socket, typingMessage]);

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
          {chats.map((chat, i) =>
            Message({ chat: chat, isSelf: chat.socketId == socket.id })
          )}
          {typingMessage.length > 0 && <Typography>{typingMessage}</Typography>}
        </Stack>
      </Container>
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
    </Stack>
  );
}

export default ChatBox;

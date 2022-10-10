import React, { useState, useEffect } from 'react';
import { Container, Stack, Typography } from '@mui/material';
import { Socket } from 'socket.io-client';
import { ChatModel } from '../../../models/ChatModel';
import ChatBubble from './ChatBubble';
import { Roles } from './roles';

const Placeholder = () => <Typography>View your messages here...</Typography>;

function ChatView(props: { socket: Socket; role: Roles }) {
  const { socket, role } = props;
  const [chats, setChats] = useState<ChatModel[]>([]);
  const [typingMessage, setTypingMessage] = useState('');

  socket.on('messageResponse', (data: ChatModel) => setChats([...chats, data]));
  socket.on('typingMessage', (data: { socketId: string; name: string }) => {
    if (socket.id !== data.socketId) {
      setTypingMessage(`${data.name} is typing`);
    }
  });
  socket.on('stop-typingMessage', () => setTypingMessage(''));

  return (
    <Container>
      {chats.length === 0 && <Placeholder />}
      <Typography>{role.interviewer} as Interviewer</Typography>
      <Typography>{role.interviewee} as Interviewee</Typography>
      <Stack spacing={1} display={'flex'}>
        {chats.map((chat, i) => (
          <ChatBubble
            chat={chat}
            isSelf={chat.socketId === socket.id}
            key={i}
          />
        ))}
        {typingMessage.length > 0 && <Typography>{typingMessage}</Typography>}
      </Stack>
    </Container>
  );
}

export default ChatView;

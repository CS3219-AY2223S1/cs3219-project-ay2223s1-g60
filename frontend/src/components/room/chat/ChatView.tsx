import React, { PropsWithChildren, useState } from 'react';
import { Container, Stack, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import { Socket } from 'socket.io-client';
import { ChatModel, Roles } from './ChatModel.d';
import ChatBubble from './ChatBubble';

const TypographyPlaceholder = (props: PropsWithChildren) => (
  <Typography sx={{ color: grey[500] }}>{props.children}</Typography>
);

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
    <Container sx={{ flexGrow: '1' }}>
      <TypographyPlaceholder>
        {role.interviewer} as Interviewer
      </TypographyPlaceholder>
      <TypographyPlaceholder>
        {role.interviewee} as Interviewee
      </TypographyPlaceholder>
      <Stack spacing={1} sx={{ mt: '1rem' }}>
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

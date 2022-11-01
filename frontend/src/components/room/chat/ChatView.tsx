import React, { PropsWithChildren, useState } from 'react';
import { Container, Stack, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import { ChatModel, Roles } from './ChatModel.d';
import ChatBubble from './ChatBubble';
import { useSockets } from '../../../context/SocketContext';
import { useRoom } from '../../../context/RoomContext';

const TypographyPlaceholder = (props: PropsWithChildren) => (
  <Typography sx={{ color: grey[500] }}>{props.children}</Typography>
);

function ChatView(props: { role?: Roles }) {
  const { chatSocket: socket } = useSockets();
  const { role } = props;
  const { room: { chats }, setChats } = useRoom();
  // const [chats, setChats] = useState<ChatModel[]>([]);
  const [typingMessage, setTypingMessage] = useState('');

  socket.on('messageResponse', (data: ChatModel) => setChats(data));
  socket.on('typingMessage', (data: { socketId: string; name: string }) => {
    if (socket.id !== data.socketId) {
      setTypingMessage(`${data.name} is typing`);
    }
  });
  socket.on('stop-typingMessage', () => setTypingMessage(''));

  return (
    <Container sx={{ flexGrow: '1' }}>
      {role && (
        <>
          <TypographyPlaceholder>
            {role.interviewer} as Interviewer
          </TypographyPlaceholder>
          <TypographyPlaceholder>
            {role.interviewee} as Interviewee
          </TypographyPlaceholder>
        </>
      )}
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

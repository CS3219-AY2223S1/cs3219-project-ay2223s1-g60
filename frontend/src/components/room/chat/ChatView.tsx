import React, { PropsWithChildren, useState } from 'react';
import { Container, Stack, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import { ChatModel, Roles } from './ChatModel.d';
import ChatBubble from './ChatBubble';
import { useSockets } from '../../../context/SocketContext';
import { useRoom } from '../../../context/RoomContext';
import { useUser } from '../../../context/UserContext';

const TypographyPlaceholder = (props: PropsWithChildren) => (
  <Typography sx={{ color: grey[500] }}>{props.children}</Typography>
);

function ChatView(props: { role?: Roles }) {
  const { chatSocket: socket } = useSockets();
  const { role } = props;
  const {
    room: { chats },
    appendChat,
  } = useRoom();
  const user = useUser();
  const [typingMessage, setTypingMessage] = useState('');

  socket.on('messageResponse', (data: ChatModel) => appendChat(data));
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
            isSelf={chat.name === user.username}
            key={i}
          />
        ))}
        {typingMessage.length > 0 && <Typography>{typingMessage}</Typography>}
      </Stack>
    </Container>
  );
}

export default ChatView;

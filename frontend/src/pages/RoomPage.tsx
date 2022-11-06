import React, { useEffect } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import ChatBox from '../components/room/chat/ChatBox';
import CodeEditor from '../components/room/CodeEditor';
import CodingQuestion from '../components/room/CodingQuestion';
import { useNavigate, useParams } from 'react-router-dom';
import { useSockets } from '../context/SocketContext';
import { useRoom } from '../context/RoomContext';
import APIRoom from '../utils/api-room';
import APIHistory from '../utils/api-history';
import { useUser } from '../context/UserContext';

function RoomPage(props: { readOnly?: boolean }) {
  const navigate = useNavigate();
  const sockets = useSockets();
  const {
    setRoomId,
    setQuestion,
    setReadOnly,
    setChats,
    setLanguage,
    setCode,
  } = useRoom();
  const user = useUser();
  const { id } = useParams();
  const roomId = id;

  const getQuestion = () => {
    roomId &&
      APIRoom.getQuestion({ room: roomId })
        .then(({ data: { question } }) => {
          setQuestion(question);
        })
        .catch((err) => console.log(err));
  };

  sockets.roomSocket.on('question', getQuestion);
  useEffect(() => {
    if (props.readOnly) {
      setReadOnly(props.readOnly);
    }
    if (roomId && !props.readOnly) {
      setRoomId(roomId);
      getQuestion();
      sockets.joinRoom(roomId, () => navigate('/home'));
    } else {
      user.user_id &&
        roomId &&
        APIHistory.getHistory(roomId, user.user_id)
          .then(({ data: { history } }) => {
            console.log(history);
            setQuestion(history.question);
            setCode(history.code.code);
            setLanguage(history.code.language);
            setChats(history.chats);
          })
          .catch((err) => {
            console.log(err);
          });
    }
  }, [roomId]);

  return roomId ? (
    <Box sx={{ height: 'calc(100vh - 94px)' }}>
      <Stack
        direction={'row'}
        spacing={2}
        style={{ width: '100vw', maxHeight: '100%' }}
      >
        <CodingQuestion />
        <CodeEditor />
        <ChatBox />
      </Stack>
    </Box>
  ) : (
    <Typography>Unauthorized access</Typography>
  );
}

export default RoomPage;

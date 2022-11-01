import React, { useEffect, useState } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import ChatBox from '../components/room/chat/ChatBox';
import CodeEditor from '../components/room/CodeEditor';
import CodingQuestion from '../components/room/CodingQuestion';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  defaultQuestion,
  QuestionModel,
} from '../components/room/QuestionModel.d';
import { useSockets } from '../context/SocketContext';
import { AuthClient } from '../utils/auth-client';

function RoomPage() {
  const { search } = useLocation();
  const navigate = useNavigate();
  const sockets = useSockets();
  const room = React.useMemo(() => new URLSearchParams(search), [search]).get(
    'id'
  );

  const [question, setQuestion] = useState<QuestionModel>(defaultQuestion);

  const getQuestion = () => {
    room &&
      AuthClient.getQuestion({ room })
        .then(({ data: { question } }) => {
          console.log(question);
          setQuestion(question);
        })
        .catch((err) => console.log(err));
  };

  sockets.roomSocket.on('question', getQuestion);
  useEffect(() => {
    if (room) {
      getQuestion();
      sockets.joinRoom(room, () => navigate('/home'));
    }
  }, [room]);

  return room ? (
    <Box>
      <Stack
        direction={'row'}
        spacing={2}
        style={{ width: '100vw', maxHeight: '100%' }}
      >
        <CodingQuestion question={question} room={room} />
        <CodeEditor room={room} />
        <ChatBox room={room} />
      </Stack>
    </Box>
  ) : (
    <Typography>Unauthorized access</Typography>
  );
}

export default RoomPage;

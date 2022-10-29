import React, { useEffect, useState } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import ChatBox from '../components/room/chat/ChatBox';
import CodeEditor from '../components/room/CodeEditor';
import CodingQuestion from '../components/room/CodingQuestion';
import { useNavigate, useLocation } from 'react-router-dom';
import { getRoomToken, useUser } from '../context/UserContext';
import { requests } from '../utils/api-request';
import { URL_MATCHING_SVC, URI_ROOM_SVC } from '../configs';
import { useSnackbar } from '../context/SnackbarContext';
import {
  defaultQuestion,
  QuestionModel,
} from '../components/room/QuestionModel.d';
import axios from 'axios';
import { useSockets } from '../context/SocketContext';

function RoomPage() {
  const { search } = useLocation();
  const navigate = useNavigate();
  const snackBar = useSnackbar();

  const sockets = useSockets();
  const room = React.useMemo(() => new URLSearchParams(search), [search]).get(
    'id'
  );
  const username = useUser().username;
  const body = {
    username: username,
    roomId: room,
  };
  const token = getRoomToken();
  console.log('Room Token : ', token);
  const header = {
    // TODO: store room key in local storage
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };
  requests
    .postWithHeaders(
      URL_MATCHING_SVC,
      '/api/matching/verify-user',
      body,
      header
    )
    .then(({ data: { message }, status }) => {
      if (status !== 201) {
        snackBar.setError('Unauthorized access to this room.');
        navigate('/home');
      }

      room && username && sockets.joinRoom(room, username);
    });

  const [question, setQuestion] = useState<QuestionModel>(defaultQuestion);

  const getQuestion = () => {
    axios
      .get(`${URI_ROOM_SVC}?roomId=${room}`)
      .then(({ data }) => setQuestion(data.roomResp.question))
      .catch((err) => console.log(err));
  };

  sockets.roomSocket.on('question', getQuestion);
  useEffect(() => {
    if (room) getQuestion();
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

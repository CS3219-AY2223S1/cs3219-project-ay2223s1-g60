import React, { useEffect, useState } from 'react';
import { Alert, AlertTitle, Box, Stack } from '@mui/material';
import ChatBox from '../components/room/chat/ChatBox';
import CodeEditor from '../components/room/CodeEditor';
import CodingQuestion from '../components/room/CodingQuestion';
import { useNavigate, useLocation } from 'react-router-dom';
import useRoomSockets from '../components/hooks/useRoomSockets';
import { getRoomToken, useUser } from '../context/UserContext';
import { requests } from '../utils/api-request';
import { URL_MATCHING_SVC, URI_ROOM_SVC} from '../configs';
import { useSnackbar } from '../context/SnackbarContext';
import { defaultQuestion, QuestionModel } from '../components/room/QuestionModel.d';
import axios from 'axios';

function RoomPage() {
  const { search } = useLocation();
  const [roomStatus, setRoomStatus] = useState(true);
  const [verificationMsg, setVerificationMsg] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const navigate = useNavigate();
  const snackBar = useSnackbar();

  const room =
    React.useMemo(() => new URLSearchParams(search), [search]).get('id') || '0';
  const username = useUser().username;
  const body = {
    username: username,
    roomId: room,
  };
  const token = getRoomToken();
  console.log('TOKENNNN : ' + token);
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
      // snackBar.setSuccess(message, 2000);
    });
  
  const { roomSocket, collabSocket, chatSocket } = useRoomSockets(room);
  const [question, setQuestion] = useState<QuestionModel>(defaultQuestion);

  const getQuestion = () => {
    axios
      .get(`${URI_ROOM_SVC}?roomId=${room}`)
      .then(({ data }) => {
        setQuestion(data.roomResp.question);
        console.log(data);
      })
      .catch((err) => console.log(err));
  };

  roomSocket.on('question', () => {
    console.log('QUESTION AVAILABLE!');
    getQuestion();
  });

  useEffect(getQuestion, []);

  return showAlert ? (
    <div>
      {/* <Alert
        onClose={() => setShowAlert(false)}
        severity={roomStatus ? 'success' : 'error'}
        sx={{ mb: 1 }}
      >
        <AlertTitle>{roomStatus ? 'Room created' : verificationMsg}</AlertTitle> */}
      {roomStatus && <h1>Room not verified</h1>}
      {/* </Alert> */}
    </div>
  ) : (
    <Box>
      <Stack
        direction={'row'}
        spacing={2}
        style={{ width: '100vw', maxHeight: '100%' }}
      >
          <CodingQuestion question={question} socket={roomSocket} room={room} />
        <CodeEditor socket={collabSocket} roomSocket={roomSocket} room={room} />
        <ChatBox socket={chatSocket} room={room} />
      </Stack>
    </Box>
  );
}

export default RoomPage;

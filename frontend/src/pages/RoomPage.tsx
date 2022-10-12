import React, { useState } from 'react';
import { Alert, AlertTitle, Box, Stack } from '@mui/material';
import ChatBox from '../components/room/chat/ChatBox';
import CodeEditor from '../components/room/CodeEditor';
import CodingQuestion from '../components/room/CodingQuestion';
import { useNavigate, useLocation } from 'react-router-dom';
import TimerModal from '../components/modal/TimerModal';
import useRoomSockets from '../components/hooks/useRoomSockets';
import { useUser } from '../context/UserContext';
import { requests } from '../utils/api-request';
import { URL_MATCHING_SVC, LOCAL_STORAGE_TOKEN_ROOM_KEY } from '../configs';

function RoomPage() {
  const { search } = useLocation();
  const [roomStatus, setRoomStatus] = useState(true);
  const [verificationMsg, setVerificationMsg] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const navigate = useNavigate();

  const room =
    React.useMemo(() => new URLSearchParams(search), [search]).get('id') || '0';
  const username = useUser().username;
  const body = {
    username: username,
    roomId: room,
  };
  const token = window.localStorage.getItem(LOCAL_STORAGE_TOKEN_ROOM_KEY);
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
        navigate('/home');
      }
      console.log(message);
    });

  const { timerSocket, collabSocket, chatSocket } = useRoomSockets(room);

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
      <TimerModal socket={timerSocket} seconds={30} room={room} />
      <Stack direction={'row'} spacing={8} alignItems={'stretch'}>
        <Stack flex={1}>
          <CodingQuestion />
          <CodeEditor socket={collabSocket} room={room} />
        </Stack>
        <ChatBox socket={chatSocket} room={room} />
      </Stack>
    </Box>
  );
}

export default RoomPage;

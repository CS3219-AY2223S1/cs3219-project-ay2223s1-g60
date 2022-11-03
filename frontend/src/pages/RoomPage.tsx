import React, { useEffect } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import ChatBox from '../components/room/chat/ChatBox';
import CodeEditor from '../components/room/CodeEditor';
import CodingQuestion from '../components/room/CodingQuestion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSockets } from '../context/SocketContext';
import { useRoom } from '../context/RoomContext';
import APIRoom from '../utils/api-room';

function RoomPage() {
  const { search } = useLocation();
  const navigate = useNavigate();
  const sockets = useSockets();
  const { setRoomId, setQuestion } = useRoom();
  const room = React.useMemo(() => new URLSearchParams(search), [search]).get(
    'id'
  );

  // const [question, setQuestion] = useState<QuestionModel>(defaultQuestion);

  const getQuestion = () => {
    room &&
      APIRoom.getQuestion({ room })
        .then(({ data: { question } }) => {
          console.log(question);
          setQuestion(question);
          // setQuestion(question);
        })
        .catch((err) => console.log(err));
  };

  sockets.roomSocket.on('question', getQuestion);
  useEffect(() => {
    if (room) {
      setRoomId(room);
      getQuestion();
      sockets.joinRoom(room, () => navigate('/home'));
    }
  }, [room]);

  return room ? (
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

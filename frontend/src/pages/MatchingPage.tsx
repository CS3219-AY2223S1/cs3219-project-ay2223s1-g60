import React, { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Stack,
  styled,
  Typography,
} from '@mui/material';
import LoadingModal from '../components/modal/LoadingModal';
import { useUser } from '../context/UserContext';
import { useSockets } from '../context/SocketContext';

function MatchingPage() {
  const username = useUser().username || '';
  const { roomSocket: socket } = useSockets();
  const [loading, setLoading] = useState(false);
  const [difficulty, setDifficulty] = useState(0);

  const StyledPaper = styled(Paper)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.9,
    borderRadius: '15px',
    padding: '0 40px 20px 40px',
    boxShadow: 'none',
    backgroundColor: '#f3f7fa',
    textAlign: 'center',
    color: 'black',
    height: '350px',
    width: '300px',
    transition: '0.8s',
    '&:hover': {
      cursor: 'pointer',
      boxShadow: '8px 8px 35px #d7dbe3',
      transition: '0.8s',
      transform: 'scale(1.1)',
    },
  }));

  const SelectDifficultyAndFindMatch = (difficulty: number) => {
    setDifficulty(difficulty);
    setLoading(true);
    socket.emit('find-match', {
      username,
      socketId: socket.id,
      difficulty,
    });
  };

  return (
    <Container
      sx={{
        height: 'calc(100vh - 94px)',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <Stack alignItems={'center'} justifyContent={'center'} spacing={10}>
        <Stack direction={'row'} spacing={4}>
          <StyledPaper onClick={() => SelectDifficultyAndFindMatch(1)}>
            <Box
              component='img'
              sx={{
                height: 240,
                width: 240,
              }}
              alt='Studying'
              src='beginner.png'
            />

            <Typography>Easy</Typography>
          </StyledPaper>

          <StyledPaper onClick={() => SelectDifficultyAndFindMatch(2)}>
            <Box
              component='img'
              sx={{
                height: 240,
                width: 240,
              }}
              alt='Studying'
              src='intermediate.png'
            />

            <Typography>Intermediate</Typography>
          </StyledPaper>

          <StyledPaper onClick={() => SelectDifficultyAndFindMatch(3)}>
            <Box
              component='img'
              sx={{
                height: 240,
                width: 240,
              }}
              alt='Studying'
              src='expert.png'
            />

            <Typography>Hard</Typography>
          </StyledPaper>
        </Stack>

        <Typography variant={'h1'} sx={{ fontSize: '2rem' }}>
          Choose your difficulty level
        </Typography>
      </Stack>

      {loading && difficulty && (
        <LoadingModal
          open={loading}
          closeModal={() => setLoading(false)}
          username={username}
          difficulty={difficulty}
        />
      )}
    </Container>
  );
}

export default MatchingPage;

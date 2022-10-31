import React from 'react';
import {
  Dialog,
  Stack,
  Box,
  Button,
  CircularProgress,
  DialogTitle,
  Typography,
} from '@mui/material';
import { io } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import { LOCAL_STORAGE_TOKEN_ROOM_KEY, URL_MATCHING_SVC } from '../../configs';
import { saveRoomToken } from '../../context/UserContext';
import { useCountDown } from '../hooks/useCountDown';

type LoadingModalProps = {
  open: boolean;
  closeModal: () => void;
  username: string;
  difficulty: number;
};

const LoadingModal: React.FC<LoadingModalProps> = (props) => {
  const { open, closeModal, difficulty, username } = props;
  const socket = io(URL_MATCHING_SVC);
  const navigate = useNavigate();

  // timeout
  const startCountDown = () =>
    setTimeout(() => {
      socket.disconnect();
      closeModal();
    }, 30000);

  const timer = useCountDown(30);

  socket.on('connect', () => {
    console.log(`${socket.id} is trying to connect`);

    socket.emit('find-match', { username, socketId: socket.id, difficulty });
    startCountDown();

    // Server notifies client that a match is found
    socket.on('found-match', () => {
      console.log('found match!');

      socket.on('join-room', ({ roomId, token }) => {
        console.log(roomId);
        saveRoomToken(token);
        clearTimeout(startCountDown());
        socket.disconnect();
        closeModal();
        navigate(`/room?id=${roomId}`);
      });
    });
  });

  const cleanUp = () => {
    clearTimeout(startCountDown());
    socket.disconnect();
    closeModal();
  };

  return (
    <Dialog open={open}>
      <DialogTitle>Finding match...</DialogTitle>

      <Box sx={{ width: 400, height: 180 }}>
        <Stack
          sx={{ height: '100%' }}
          justifyContent='space-around'
          alignItems='center'
        >
          <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            <CircularProgress
              variant='determinate'
              size={60}
              value={100 - (timer.currTime / 30) * 100}
            />
            <Box
              sx={{
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                position: 'absolute',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography
                variant='caption'
                component='div'
                color='text.secondary'
              >{`${Math.round(timer.currTime)} s`}</Typography>
            </Box>
          </Box>
          <Button variant='contained' onClick={cleanUp}>
            Cancel
          </Button>
        </Stack>
      </Box>
    </Dialog>
  );
};

export default LoadingModal;

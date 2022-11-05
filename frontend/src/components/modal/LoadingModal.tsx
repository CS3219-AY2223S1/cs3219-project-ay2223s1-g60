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
import { useNavigate } from 'react-router-dom';
import { saveRoomToken } from '../../context/UserContext';
import { useCountDown } from '../hooks/useCountDown';
import { useSockets } from '../../context/SocketContext';

type LoadingModalProps = {
  open: boolean;
  closeModal: () => void;
  username: string;
  difficulty: number;
};

const LoadingModal: React.FC<LoadingModalProps> = (props) => {
  const { open, closeModal, difficulty, username } = props;
  const socket = useSockets().roomSocket;
  const navigate = useNavigate();

  // timeout
  const startCountDown = () => setTimeout(closeModal, 30000);
  const timer = useCountDown(30);

  const cleanUp = () => {
    clearTimeout(startCountDown());
    socket.emit('cancel-req', { user: username });
    closeModal();
  };

  startCountDown();

  // Server notifies client that a match is found
  socket.on('found-match', () => {
    console.log('found match!');

    socket.on('join-room', ({ roomId, token }) => {
      saveRoomToken(token);
      clearTimeout(startCountDown());
      closeModal();
      navigate(`/room/${roomId}`);
    });
  });

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

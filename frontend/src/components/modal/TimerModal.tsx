import React, { useEffect, useState } from 'react';
import { Stack, Button, Typography } from '@mui/material';
import { AlarmAddRounded, AlarmRounded } from '@mui/icons-material';
import { formatTime } from '../hooks/useCountDown';
import { useSockets } from '../../context/SocketContext';
import { useSnackbar } from '../../context/SnackbarContext';

const TimeView = (props: { currTime: number; warn: boolean }) => {
  const { warn, currTime } = props;

  return (
    <Typography
      variant='h6'
      sx={{
        border: '1px solid',
        borderColor: `${warn ? 'error.main' : 'primary.main'}`,
        padding: '4px 8px',
        borderRadius: '8px',
        color: `${warn ? 'error.main' : 'primary.main'}`,
      }}
    >
      {formatTime(currTime)}
    </Typography>
  );
};

function TimerModal(props: {
  extendSec: number;
  onTimeUp: VoidFunction;
  onExtend: VoidFunction;
}) {
  const warnSec = 30;

  const socket = useSockets().roomSocket;
  const snackbar = useSnackbar();

  const { extendSec, onTimeUp, onExtend } = props;
  const [currTime, setCurrTime] = useState(Infinity);
  const [warn, setWarn] = useState(false);
  const [showTime, setShowTime] = useState(true);

  useEffect(() => {
    socket.on('timer', (time) => setCurrTime(time));
  }, []);

  const isTimeUp = () => currTime <= 0;

  useEffect(() => {
    if (currTime <= warnSec) {
      setWarn(true);
      snackbar.setError("Time's almost up");
    } else {
      setWarn(false);
    }

    if (currTime <= 0) {
      onTimeUp();
    }
  }, [currTime, onTimeUp]);

  return (
    <Stack spacing={1} direction='row-reverse' alignItems='center'>
      {!warn || isTimeUp() ? (
        <Button
          onClick={() => setShowTime(!showTime)}
          sx={{
            paddingY: '1rem',
            color: `${isTimeUp() ? 'error.main' : 'primary.main'}`,
          }}
        >
          <AlarmRounded />
        </Button>
      ) : (
        <Button
          sx={{ color: 'error.main', flexDirection: 'column' }}
          onClick={onExtend}
        >
          <AlarmAddRounded />
          <Typography sx={{ marginLeft: '4px', fontSize: 'small' }}>
            {extendSec / 60} min
          </Typography>
        </Button>
      )}
      {(showTime || (warn && !isTimeUp())) && (
        <TimeView currTime={currTime} warn={warn} />
      )}
    </Stack>
  );
}

export default TimerModal;

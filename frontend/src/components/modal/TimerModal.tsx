import React, { useEffect, useState } from 'react';
import {
  Alert,
  Collapse,
  Fade,
  IconButton,
  Stack,
  Button,
  Typography,
} from '@mui/material';
import {
  AlarmAddRounded,
  AlarmRounded,
  CloseRounded,
} from '@mui/icons-material';
import { useCountDown, formatTime } from '../hooks/useCountDown';

const TimerAlert = (props: { show: boolean }) => {
  const [openAlert, setOpenAlert] = useState(true);

  return (
    <Collapse in={openAlert}>
      <Fade in={props.show}>
        <Alert
          severity='info'
          sx={{
            position: 'absolute',
            bottom: '0',
            left: '0',
            mb: '1rem',
            zIndex: '10',
          }}
          action={
            <IconButton
              aria-label='close'
              size='small'
              onClick={() => setOpenAlert(false)}
            >
              <CloseRounded />
            </IconButton>
          }
        >
          Time's almost up!
        </Alert>
      </Fade>
    </Collapse>
  );
};

function TimerModal(props: { seconds: number; onTimeUp: VoidFunction }) {
  const extendSec = 300;
  const warnSec = 30;

  const { seconds, onTimeUp } = props;

  const [warn, setWarn] = useState(false);
  const [showTime, setShowTime] = useState(true);
  const { currTime, isTimeUp, extendTime } = useCountDown(seconds);

  useEffect(() => {
    currTime <= warnSec ? setWarn(true) : setWarn(false);
    isTimeUp && onTimeUp();
  }, [currTime, isTimeUp, onTimeUp]);

  const TimeView = () => (
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

  return (
    <Stack spacing={1} direction='row-reverse' alignItems='center'>
      <TimerAlert show={warn} />
      {!warn || isTimeUp ? (
        <Button
          onClick={() => setShowTime(!showTime)}
          sx={{
            paddingY: '1rem',
            color: `${isTimeUp ? 'error.main' : 'primary.main'}`,
          }}
        >
          <AlarmRounded />
        </Button>
      ) : (
        <Button
          sx={{ color: 'error.main', flexDirection: 'column' }}
          onClick={() => extendTime(extendSec)}
        >
          <AlarmAddRounded />
          <Typography sx={{ marginLeft: '4px', fontSize: 'small' }}>
            {extendSec / 60} min
          </Typography>
        </Button>
      )}
      {(showTime || (warn && !isTimeUp)) && <TimeView />}
    </Stack>
  );
}

export default TimerModal;

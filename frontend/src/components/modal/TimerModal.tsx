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

function TimerModal(props: { seconds: number; onTimeUp: VoidFunction }) {
  const extendSec = 300;
  const warnSec = 30;

  const { seconds, onTimeUp } = props;

  const [openAlert, setOpenAlert] = useState(true);
  const [showTime, setShowTime] = useState(true);
  const [warn, setWarn] = useState(false);
  const { currTime, extendTime } = useCountDown(seconds);

  useEffect(() => {
    currTime <= warnSec ? setWarn(true) : setWarn(false);
    currTime <= 0 && onTimeUp();
  }, [currTime]);

  return (
    <Stack spacing={1} direction='row-reverse' alignItems='center'>
      <Collapse in={openAlert}>
        <Fade in={warn}>
          <Alert
            severity='info'
            sx={{
              position: 'absolute',
              bottom: '0',
              left: '50%',
              marginY: '1rem',
              zIndex: '10',
              display: 'flex',
              alignItems: 'center',
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
      {!warn || currTime <= 0 ? (
        <Button
          onClick={() => setShowTime(!showTime)}
          sx={{
            paddingY: '1rem',
            color: `${currTime <= 0 ? 'error.main' : 'primary.main'}`,
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
      {(showTime || (warn && currTime > 0)) && (
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
      )}
    </Stack>
  );
}

export default TimerModal;

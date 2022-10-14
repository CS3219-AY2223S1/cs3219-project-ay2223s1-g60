import React, { useEffect, useState } from 'react';
import { Alert, Fade, Stack, Button, Typography } from '@mui/material';
import AlarmRoundedIcon from '@mui/icons-material/AlarmRounded';
import AlarmAddRoundedIcon from '@mui/icons-material/AlarmAddRounded';
import { useNavigate } from 'react-router-dom';
import { useCountDown, formatTime } from '../hooks/useCountDown';

function TimerModal(props: { seconds: number }) {
  const extendSec = 300;
  const warnSec = 30;

  const { seconds } = props;

  const [showTime, setShowTime] = useState(true);
  const [warn, setWarn] = useState(false);
  const { currTime, extendTime } = useCountDown(seconds);

  useEffect(() => {
    currTime <= warnSec ? setWarn(true) : setWarn(false);
  }, [currTime]);

  return (
    <Stack spacing={1} direction='row-reverse' alignItems='center'>
      <Fade in={warn}>
        <Alert
          severity='info'
          sx={{
            position: 'absolute',
            bottom: '0',
            left: '50%',
            marginY: '1rem',
            zIndex: '10',
          }}
        >
          Time's almost up!
        </Alert>
      </Fade>
      {!warn ? (
        <Button
          onClick={() => setShowTime(!showTime)}
          sx={{ paddingY: '1rem' }}
        >
          <AlarmRoundedIcon />
        </Button>
      ) : (
        <Button
          sx={{ color: 'error.main', flexDirection: 'column' }}
          onClick={() => extendTime(extendSec)}
        >
          <AlarmAddRoundedIcon />
          <Typography sx={{ marginLeft: '4px', fontSize: 'small' }}>
            {extendSec / 60} min
          </Typography>
        </Button>
      )}
      {(showTime || warn) && (
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

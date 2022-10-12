import React, { useState } from 'react';
import { Box, Button, Stack, Typography } from '@mui/material';
import LoadingModal from './loading/LoadingModal';
import { useUser } from '../context/UserContext';

function MatchingPage() {
  const username = useUser().username || '';
  const [loading, setLoading] = useState(false);
  const [difficulty, setDifficulty] = useState(0);

  const SelectButton = (props: { name: string; id: number }) => (
    <Button
      variant={difficulty === props.id ? 'contained' : 'outlined'}
      onClick={() => setDifficulty(props.id)}
    >
      {props.name}
    </Button>
  );

  return (
    <div className='matching-page'>
      {loading && (
        <LoadingModal
          open={loading}
          closeModal={() => setLoading(false)}
          username={username}
          difficulty={difficulty}
        />
      )}
      <Box display={'flex'} flexDirection={'column'} width={'30%'}>
        <Typography variant={'h3'} marginBottom={'2rem'}>
          Difficulty Setting
        </Typography>
        <Stack spacing={2}>
          <SelectButton name={'easy'} id={1} />
          <SelectButton name={'medium'} id={2} />
          <SelectButton name={'hard'} id={3} />
          <Button variant={'contained'} onClick={() => setLoading(true)}>
            Find Match
          </Button>
        </Stack>
      </Box>
    </div>
  );
}

export default MatchingPage;

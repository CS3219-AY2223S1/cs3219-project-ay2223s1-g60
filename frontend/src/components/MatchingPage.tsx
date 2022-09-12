import React, { useState } from 'react';
import { Box, Button, Stack, Typography } from '@mui/material';
import LoadingModal from './loading/LoadingModal';

function MatchingPage() {
  const [loading, setLoading] = useState(false);
  const [difficulty, setDifficulty] = useState(0);

  return (
    <div className='matching-page'>
      {loading && (
        <LoadingModal
          open={loading}
          closeModal={() => setLoading(false)}
          userId={2} // TODO: Obtain username
          difficulty={difficulty}
        />
      )}
      <Box display={'flex'} flexDirection={'column'} width={'30%'}>
        <Typography variant={'h3'} marginBottom={'2rem'}>
          Difficulty Setting
        </Typography>
        <Stack spacing={2}>
          <Button variant={'outlined'} onClick={() => setDifficulty(1)}>
            Easy
          </Button>
          <Button variant={'outlined'} onClick={() => setDifficulty(2)}>
            Medium
          </Button>
          <Button variant={'outlined'} onClick={() => setDifficulty(3)}>
            Hard
          </Button>
          <Button variant={'contained'} onClick={() => setLoading(true)}>
            Find Match
          </Button>
        </Stack>
      </Box>
    </div>
  );
}

export default MatchingPage;

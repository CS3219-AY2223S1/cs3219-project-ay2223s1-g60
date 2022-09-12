import React, { useState } from 'react';
import { Box, Button, Container, Stack, Typography } from '@mui/material';

function CodingQuestion() {
  const [codingQuestion, setCodingQuestion] = useState('Lorem Ipsum');

  return (
    <Box display={'flex'} flexDirection={'column'} padding={'4rem'}>
      <Stack spacing={2}>
        <Typography variant={'h3'} marginBottom={'2rem'}>
          Coding Question
        </Typography>
        <Button variant='contained'>Next Question</Button>
        <Container>
          <Typography>{codingQuestion}</Typography>
        </Container>
      </Stack>
    </Box>
  );
}

export default CodingQuestion;

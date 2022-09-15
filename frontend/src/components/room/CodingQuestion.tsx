import React, { useState } from 'react';
import { Button, Container, Stack, Typography } from '@mui/material';

function CodingQuestion() {
  const [codingQuestion, setCodingQuestion] = useState('Lorem Ipsum');

  return (
    <Stack spacing={2}>
      <Typography variant={'h3'} marginBottom={'2rem'}>
        Coding Question
      </Typography>
      <Button variant='contained'>Next Question</Button>
      <Container>
        <Typography>{codingQuestion}</Typography>
      </Container>
    </Stack>
  );
}

export default CodingQuestion;

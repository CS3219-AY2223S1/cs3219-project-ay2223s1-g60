import React, { useState } from 'react';
import { Button, Divider, Stack, Typography } from '@mui/material';
import { Socket } from 'socket.io-client';
import { QuestionModel } from './QuestionModel.d';

enum DifficultyEnum {
  Easy,
  Medium,
  Hard,
}

function CodingQuestion(props: {
  question: QuestionModel;
  socket: Socket;
  room: string;
}) {
  const { question, socket, room } = props;
  const [loading, setLoading] = useState(false);

  return loading ? (
    <div>Loading...</div>
  ) : (
    <Stack
      spacing={2}
      style={{
        width: '400px',
        padding: '1rem 2rem',
        justifyContent: 'space-between',
        maxHeight: '100%',
      }}
    >
      <Typography variant='h4'>{question?.question_title}</Typography>
      <Typography variant='subtitle1'>
        {DifficultyEnum[question?.question_difficulty - 1]}
      </Typography>
      <Divider />
      <div
        dangerouslySetInnerHTML={{ __html: question?.question_text }}
        style={{ flex: 1, overflow: 'scroll', paddingRight: '1rem' }}
      />
      <Button
        variant='contained'
        onClick={() => socket.emit('get-question', { room })}
      >
        Next Question
      </Button>
    </Stack>
  );
}

export default CodingQuestion;

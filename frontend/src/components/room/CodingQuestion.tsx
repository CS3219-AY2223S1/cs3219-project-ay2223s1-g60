import React from 'react';
import { Button, Divider, Stack, Typography } from '@mui/material';
import { DifficultyEnum, QuestionModel } from './QuestionModel.d';
import { useSockets } from '../../context/SocketContext';

function CodingQuestion(props: { question: QuestionModel; room: string }) {
  const { roomSocket: socket } = useSockets();
  const { question, room } = props;

  return (
    <Stack
      spacing={2}
      style={{
        width: '400px',
        padding: '1rem 2rem',
        justifyContent: 'space-between',
        maxHeight: '100%',
      }}
    >
      <Typography variant='h4'>{question.question_title}</Typography>
      <Typography variant='subtitle1'>
        {DifficultyEnum[question.question_difficulty - 1]}
      </Typography>
      <Divider />
      <div
        dangerouslySetInnerHTML={{ __html: question.question_text }}
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

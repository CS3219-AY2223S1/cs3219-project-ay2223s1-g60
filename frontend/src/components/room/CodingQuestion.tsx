import React, { useState, useEffect } from 'react';
import { Button, Divider, Stack, Typography } from '@mui/material';
import { Socket } from 'socket.io-client';
import { defaultQuestion, QuestionModel } from './QuestionModel.d';
import axios from 'axios';
import { URI_ROOM_SVC } from '../../configs';

enum DifficultyEnum {
  Easy,
  Medium,
  Hard,
}

function CodingQuestion(props: { socket: Socket; room: string }) {
  const { socket, room } = props;
  const [question, setQuestion] = useState<QuestionModel>(defaultQuestion);
  const [loading, setLoading] = useState(true);

  const getQuestion = () => {
    axios
      .get(`${URI_ROOM_SVC}?roomId=${room}`)
      .then(({ data }) => {
        setQuestion(data.roomResp.question);
        setLoading(false);
      })
      .catch((err) => console.log(err));
  };

  socket.on('question', () => {
    console.log('QUESTION AVAILABLE!');
    setLoading(true);
    getQuestion();
  });

  useEffect(getQuestion, [getQuestion]);

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

import React, { useState } from 'react';
import { Button, Container, Divider, Stack, Typography } from '@mui/material';
import { Socket } from 'socket.io-client';
import { defaultQuestion, QuestionModel } from './QuestionModel.d';
import axios from 'axios';
import { URI_ROOM_SVC } from '../../configs';

enum DifficultyEnum {
  Easy,
  Medium,
  Hard,
}

function CodingQuestion(props: { timerSocket: Socket; room: string }) {
  const [question, setQuestion] = useState<QuestionModel>(defaultQuestion);

  props.timerSocket.on('question', (qn) => {
    getQuestion();
  });

  const getQuestion = () => {
    axios
      .get(`${URI_ROOM_SVC}?roomId=${props.room}`)
      .then((roomObj) => {
        setQuestion(roomObj.data.roomResp.question);
      })
      .catch((err) => console.log(err));
  };

  const getNextQuestion = () => {
    props.timerSocket.emit('get-question', { room: props.room });
  };

  return (
    <Stack
      spacing={2}
      style={{
        width: '400px',
        padding: '2rem',
        justifyContent: 'space-between',
      }}
    >
      <Stack spacing={2}>
        <Typography variant='h4'>{question.question_title}</Typography>
        <Typography variant='subtitle1'>
          Difficulty : {DifficultyEnum[question.question_difficulty - 1]}
        </Typography>
        <Divider />
        <Container
          style={{ flexGrow: '1', height: '480px', overflowY: 'scroll' }}
        >
          <Typography>
            <div dangerouslySetInnerHTML={{ __html: question.question_text }} />
          </Typography>
        </Container>
      </Stack>
      <Button variant='contained' onClick={getNextQuestion}>
        Next Question
      </Button>
    </Stack>
  );
}

export default CodingQuestion;

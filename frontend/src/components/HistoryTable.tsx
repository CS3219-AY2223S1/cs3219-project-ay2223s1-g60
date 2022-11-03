import React, { useEffect, useState } from 'react';
import { getTokens, useUser } from '../context/UserContext';
import { URL_HISTORY_SVC } from '../configs';
import { requests } from '../utils/api-request';
import {
  Button,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { HistoryModel } from '../components/room/HistoryModel';
import { DifficultyEnum } from './room/QuestionModel.d';

const TableHeader = () => (
  <TableHead sx={{ padding: '0 40px 20px 40px' }}>
    <TableRow sx={{ padding: '0 40px 20px 40px' }}>
      <TableCell>Match</TableCell>
      <TableCell align='left'>Question Title</TableCell>
      <TableCell align='center'>Difficulty</TableCell>
      <TableCell align='right'></TableCell>
    </TableRow>
  </TableHead>
);

const NoAttempt = () => (
  <Container
    sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexGrow: 1,
    }}
  >
    <Typography variant='h6'>No attempt has been made</Typography>
  </Container>
);

const HistoryRow = (props: { history: HistoryModel; match: string }) => {
  const { match, history } = props;
  const {
    roomId,
    question: { question_title: title, question_difficulty: difficulty },
  } = history;

  return (
    <TableRow
      key={roomId}
      sx={{
        '&:last-child td, &:last-child th': { border: 0 },
      }}
    >
      <TableCell component='th' scope='row'>
        {match}
      </TableCell>
      <TableCell align='left'>{title}</TableCell>
      <TableCell align='center'>{DifficultyEnum[difficulty - 1]}</TableCell>
      <TableCell align='right'>
        <Button>View Attempt</Button>
      </TableCell>
    </TableRow>
  );
};

function HistoryTable() {
  const user = useUser();
  const [histories, setHistories] = useState<HistoryModel[]>([]);

  useEffect(() => {
    let headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokens().token}`,
    };

    requests
      .get(URL_HISTORY_SVC, `/historyList/${user.username}`, { headers })
      .then(({ status, statusText, data: { histories } }) => {
        console.log(histories);
        if (status !== 201) throw new Error(statusText);
        setHistories(histories);
      })
      .catch((err) => {
        console.log(err);
        // snackbar.setError(err.toString());
      });
  }, [user.username]);

  return (
    <TableContainer
      sx={{
        width: '100%',
        height: '350px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Table sx={{ minWidth: 650 }} aria-label='simple table'>
        <TableHeader />
        <TableBody sx={{ padding: '0 40px 20px 40px' }}>
          {histories.map((history) => (
            <HistoryRow
              history={history}
              match={
                history.username1 === user.username
                  ? history.username2
                  : history.username1
              }
            />
          ))}
        </TableBody>
      </Table>
      {histories.length === 0 && <NoAttempt />}
    </TableContainer>
  );
}

export default HistoryTable;

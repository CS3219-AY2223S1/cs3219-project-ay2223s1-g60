import React, { useEffect, useState } from 'react';
import { getTokens, useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { URL_HISTORY_SVC } from '../configs';
import { requests } from '../utils/api-request';
import {
  Box,
  Button,
  Container,
  Paper,
  Stack,
  Typography,
  useTheme,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { HistoryModel } from '../components/room/HistoryModel';

function HomePage() {
  const user = useUser();
  const navigate = useNavigate();
  const theme = useTheme();

  const [histories, setHistories] = useState<HistoryModel[]>([]);

  useEffect(() => {
    let headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokens().token}`,
    };

    requests
      .get(URL_HISTORY_SVC, `/historyList/${user.username}`, { headers })
      .then((resp) => {
        console.log(resp.data.histories);
        if (resp.status !== 201) throw new Error(resp.statusText);
        setHistories(resp.data.histories);
      })
      .catch((err) => {
        console.log(err);
        // snackbar.setError(err.toString());
      });
  }, []);

  return (
    <Container
      maxWidth='sm'
      sx={{
        height: 'calc(100vh - 94px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Paper
        sx={{
          borderRadius: '15px',
          padding: '0 40px 20px 40px',
          boxShadow: '8px 8px 35px #d7dbe3',
          backgroundColor: '#f3f7fa',
          textAlign: 'center',
          color: 'black',
          height: '350px',
          width: '100%',
        }}
      >
        <Stack
          sx={{
            height: '100%',
          }}
          alignItems={'center'}
          justifyContent={'space-between'}
        >
          <Stack alignItems={'center'} spacing={2}>
            <Box
              component='img'
              sx={{
                height: 260,
                width: 260,
                marginTop: '-130px',
              }}
              alt='Studying'
              src='studying.png'
            />

            <Typography variant={'h1'} sx={{ fontSize: '2rem' }}>
              Welcome back {user.username}
            </Typography>

            <Typography variant={'body1'}>Let's match!</Typography>
          </Stack>

          <Button
            onClick={() => navigate('/match')}
            fullWidth
            sx={{
              height: '60px',
              borderRadius: '15px',
              backgroundColor: '#FDD231',
              color: 'black',
            }}
          >
            <Typography variant={'button'} sx={{ fontSize: '1rem' }}>
              Select Difficulty
            </Typography>
          </Button>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label='simple table'>
              <TableHead>
                <TableRow>
                  <TableCell>Match's Username</TableCell>
                  <TableCell align='right'>Room ID</TableCell>
                  <TableCell align='right'>Question Title</TableCell>
                  <TableCell align='right'>History Details</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {histories?.map((history) => (
                  <div>
                    <TableRow
                      key={history.roomId}
                      sx={{
                        '&:last-child td, &:last-child th': { border: 0 },
                      }}
                    >
                      <TableCell component='th' scope='row'>
                        {history.username1 == user.username
                          ? history.username2
                          : history.username1}
                      </TableCell>
                      <TableCell align='right'>{history.roomId}</TableCell>
                      <TableCell align='right'>
                        {history.question.question_title}
                      </TableCell>
                      <TableCell align='right'>
                        <Button>View History</Button>
                      </TableCell>
                    </TableRow>
                  </div>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Stack>
      </Paper>
    </Container>
  );
}

export default HomePage;

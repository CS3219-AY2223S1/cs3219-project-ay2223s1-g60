import React, { useEffect, useState } from 'react';
import { getTokens, useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { requests } from '../utils/api-request';
import { URL_HISTORY_SVC } from '../configs';
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { HistoryModel } from '../components/room/HistoryModel';

function HomePage() {
  const user = useUser();
  const navigate = useNavigate();
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
    <div>
      <p>SUCCESSFULLY LOGGED {user.username} IN</p>
      <button onClick={() => navigate('/match')}>Find Match</button>

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
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
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
    </div>
  );
}

export default HomePage;

import React from 'react';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Paper,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import HistoryTable from '../components/HistoryTable';

function HomePage() {
  const user = useUser();
  const navigate = useNavigate();
  const theme = useTheme();

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
          margin: '1rem',
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
        </Stack>
      </Paper>
      <Paper
        sx={{
          borderRadius: '15px',
          boxShadow: '8px 8px 35px #d7dbe3',
          backgroundColor: '#f3f7fa',
          textAlign: 'center',
          color: 'black',
        }}
      >
        <HistoryTable />
      </Paper>
    </Container>
  );
}

export default HomePage;

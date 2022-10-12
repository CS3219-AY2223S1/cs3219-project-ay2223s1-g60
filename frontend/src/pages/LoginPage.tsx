import React, { useState } from 'react';
import {
  Alert,
  AlertTitle,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Container,
  Grid,
  InputAdornment,
  Link,
  TextField,
  Typography,
} from '@mui/material';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import { useNavigate } from 'react-router-dom';
import { AuthClient } from '../utils/auth-client';
import {
  LOCAL_STORAGE_TOKEN_KEY,
  LOCAL_STORAGE_USERNAME_KEY,
} from '../configs';
import { useAuth } from '../context/UserContext';

function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [loginFailMessage, setLoginFailMessage] = useState<string>('');
  const [showAlert, setShowAlert] = useState(false);
  const navigate = useNavigate();
  const authClient = useAuth();

  const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const username = data.get('username');
    const password = data.get('password');

    if (!username || !password) {
      return;
    }

    const body = {
      username: username.toString(),
      password: password.toString(),
    };

    setLoading(true);
    AuthClient.loginWithUname(body)
      .then(({ data: { username, token, message }, status }) => {
        if (status !== 201) throw new Error(message);

        authClient.setUser({ username: username });
        window.localStorage.setItem(LOCAL_STORAGE_TOKEN_KEY, token);
        window.localStorage.setItem(LOCAL_STORAGE_USERNAME_KEY, username);
        navigate('/home');
      })
      .catch((err) => {
        setLoginFailMessage(err);
        setShowAlert(true);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Container
      maxWidth='xs'
      sx={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mb: 20,
        }}
      >
        <Avatar />

        <Typography component='h1' variant='h5'>
          Log in
        </Typography>

        <Box
          sx={{
            mt: 3,
          }}
          component='form'
          autoComplete={'off'}
          onSubmit={handleLogin}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <AccountCircleOutlinedIcon />
                    </InputAdornment>
                  ),
                }}
                placeholder={'Username'}
                required
                fullWidth
                id='username'
                label='Username'
                name='username'
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <ShieldOutlinedIcon />
                    </InputAdornment>
                  ),
                }}
                placeholder={'Password'}
                required
                fullWidth
                id='password'
                label='Password'
                name='password'
                type='password'
              />
            </Grid>
          </Grid>

          <Button
            type='submit'
            fullWidth
            variant='contained'
            disabled={loading}
            sx={{ mt: 3, mb: 2 }}
          >
            {loading && <CircularProgress size={18} sx={{ mr: 1 }} />}
            Log in
          </Button>

          {showAlert && (
            <Alert
              onClose={() => setShowAlert(false)}
              severity={'error'}
              sx={{ mb: 1 }}
            >
              <AlertTitle>{loginFailMessage.toString()}</AlertTitle>
            </Alert>
          )}

          <Grid container>
            <Grid item>
              <Link href='/signup' variant='body2'>
                Don't have an account? Sign up here
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}

export default LoginPage;
import React, { useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  Grid,
  IconButton,
  TextField,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { AuthClient } from '../../utils/auth-client';
import { getTokens, saveTokens, useAuth } from '../../context/UserContext';

type ChangeUsernameDialogProps = {
  dialogOpen: boolean;
  setDialogOpen: (isOpen: boolean) => void;
};

function ChangeUsernameDialog(props: ChangeUsernameDialogProps) {
  const { dialogOpen, setDialogOpen } = props;
  const [loading, setLoading] = useState(false);
  const authClient = useAuth();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const username = data.get('username');
    const password = data.get('password');
    const newUsername = data.get('newUsername');

    if (!username || !password || !newUsername) {
      return;
    }

    const body = {
      username: username.toString(),
      password: password.toString(),
      newUsername: password.toString(),
    };

    setLoading(true);
    AuthClient.changeUsername(body)
      .then((resp) => {
        if (resp.status !== 200) throw new Error(resp.data.message);

        // success
        const { token } = getTokens();
        saveTokens(token, newUsername.toString()); // save in browser
        authClient.setUser({ username: newUsername.toString() }); // save in context
        setDialogOpen(false);
      })
      .catch((err) => {
        // error
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Dialog open={dialogOpen}>
      <DialogTitle>Change username</DialogTitle>

      <Box position='absolute' top={0} right={0}>
        <IconButton onClick={() => setDialogOpen(false)}>
          <Close />
        </IconButton>
      </Box>

      <Box
        sx={{
          paddingLeft: 5,
          paddingRight: 5,
          paddingBottom: 5,
        }}
        component='form'
        autoComplete='off'
        onSubmit={handleSubmit}
      >
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <TextField
              placeholder='Username'
              required
              fullWidth
              id='username'
              label='Username'
              name='username'
              variant='standard'
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              placeholder='Password'
              required
              fullWidth
              id='password'
              label='Password'
              name='password'
              type='password'
              variant='standard'
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              placeholder='New username'
              required
              fullWidth
              id='newUsername'
              label='New Username'
              name='newUsername'
              variant='standard'
            />
          </Grid>

          <Grid
            item
            sx={{ display: 'flex', justifyContent: 'flex-end' }}
            xs={12}
          >
            <Button variant='contained' type='submit' disabled={loading}>
              {loading && <CircularProgress size={18} sx={{ mr: 1 }} />}
              Confirm
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Dialog>
  );
}

export default ChangeUsernameDialog;

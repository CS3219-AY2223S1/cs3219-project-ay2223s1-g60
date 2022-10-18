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
import { useSnackbar } from '../../context/SnackbarContext';
import { getTokens } from '../../context/UserContext';

type ChangePasswordDialogProps = {
  dialogOpen: boolean;
  setDialogOpen: (isOpen: boolean) => void;
};

function ChangePasswordDialog(props: ChangePasswordDialogProps) {
  const { dialogOpen, setDialogOpen } = props;
  const [loading, setLoading] = useState(false);

  const snackBar = useSnackbar();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const username = data.get('username');
    const password = data.get('password');
    const newPassword = data.get('newPassword');

    if (!username || !password || !newPassword) {
      return;
    }

    const headers = {
      Authorization: `Bearer ${getTokens().token}`,
      'Content-Type': 'application/json',
    };

    const body = {
      username: username.toString(),
      oldPassword: password.toString(),
      newPassword: newPassword.toString(),
    };

    setLoading(true);
    AuthClient.changePassword(headers, body)
      .then((resp) => {
        if (resp.status !== 200) throw new Error(resp.data.message);

        // success
        setDialogOpen(false);
        snackBar.setSuccess('Change password success', 2000);
      })
      .catch((err) => {
        snackBar.setError(err.toString());
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Dialog open={dialogOpen}>
      <DialogTitle>Change password</DialogTitle>

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
              placeholder='New password'
              required
              fullWidth
              id='newPassword'
              label='New password'
              name='newPassword'
              type='password'
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

export default ChangePasswordDialog;

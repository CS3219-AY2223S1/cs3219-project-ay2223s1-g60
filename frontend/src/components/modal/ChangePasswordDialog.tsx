import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useAuth } from '../../context/UserContext';

export default function ChangePasswordDialog({ isOpen }: { isOpen: boolean }) {
  const [open, setOpen] = React.useState(isOpen);
  const [username, setUsername] = React.useState('');
  const [currentPassword, setCurrentPassword] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const auth = useAuth();

  const handleClickOpen = () => {
    console.log('opened :', isOpen);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async () => {
    try {
      auth.changePassword(username, currentPassword, newPassword);
      handleClose();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      {/* <Button variant="outlined" onClick={handleClickOpen}>
        Open form dialog
      </Button> */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin='dense'
            id='username'
            label='Username'
            type='text'
            fullWidth
            variant='standard'
            onChange={(event) => setUsername(event.target.value)}
          />
          <TextField
            autoFocus
            margin='dense'
            id='currentPass'
            label='Current Password'
            type='password'
            fullWidth
            variant='standard'
            onChange={(event) => setCurrentPassword(event.target.value)}
          />
          <TextField
            autoFocus
            margin='dense'
            id='newPass'
            label='New Password'
            type='password'
            fullWidth
            variant='standard'
            onChange={(event) => setNewPassword(event.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Apply</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

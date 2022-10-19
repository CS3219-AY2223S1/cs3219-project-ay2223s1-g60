import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
} from '@mui/material';
import { SchoolSharp, SettingsSharp } from '@mui/icons-material';
import ConfirmationDialog from './modal/ConfirmationDialog';
import { useAuth } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import ChangeUsernameDialog from './modal/ChangeUsernameDialog';
import ChangePasswordDialog from './modal/ChangePasswordDialog';

function Navbar() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [changeUnameDialogOpen, setChangeUnameDialogOpen] = useState(false);
  const [changePasswordDialogOpen, setChangePasswordDialogOpen] =
    useState(false);

  const authClient = useAuth();
  const navigate = useNavigate();

  const handleOpenSettingsMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleChangeUsername = () => {
    setAnchorEl(null);
    setChangeUnameDialogOpen(true);
  };

  const handleChangePassword = () => {
    setAnchorEl(null);
    setChangePasswordDialogOpen(true);
  };

  const handleDeleteAccount = () => {
    setAnchorEl(null);
    setConfirmDialogOpen(true);
  };

  const handleDeleteUser = () => {
    authClient.deleteUser();
  };

  const handleLogout = () => {
    authClient.logout();
  };

  return (
    <AppBar position='relative' sx={{ boxShadow: 'none', height: '60px' }}>
      <Toolbar>
        <IconButton
          size='large'
          edge='start'
          color='inherit'
          aria-label='menu'
          onClick={() => navigate('/home')}
        >
          <SchoolSharp />
        </IconButton>

        <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
          PeerPrep
        </Typography>

        <IconButton onClick={handleOpenSettingsMenu} color='inherit'>
          <SettingsSharp />
        </IconButton>

        <Menu
          id='menu-appbar'
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
        >
          <MenuItem onClick={handleChangeUsername}>Change username</MenuItem>
          <MenuItem onClick={handleChangePassword}>Change password</MenuItem>
          <MenuItem onClick={handleDeleteAccount} sx={{ color: 'red' }}>
            Delete account
          </MenuItem>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </Toolbar>

      <ConfirmationDialog
        dialogOpen={confirmDialogOpen}
        setDialogOpen={setConfirmDialogOpen}
        message={'Confirm the deletion of your account?'}
        onConfirmAction={handleDeleteUser}
      />

      <ChangeUsernameDialog
        dialogOpen={changeUnameDialogOpen}
        setDialogOpen={setChangeUnameDialogOpen}
      />

      <ChangePasswordDialog
        dialogOpen={changePasswordDialogOpen}
        setDialogOpen={setChangePasswordDialogOpen}
      />
    </AppBar>
  );
}

export default Navbar;

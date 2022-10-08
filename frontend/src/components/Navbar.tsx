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

function Navbar() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const authClient = useAuth();
  const navigate = useNavigate();

  const handleOpenSettingsMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseSettingsMenu = () => {
    setAnchorEl(null);
  };

  const handleDeleteAccount = () => {
    setAnchorEl(null);
    setConfirmDialogOpen(true);
  };

  const handleDeleteUser = () => {
    try {
      authClient.deleteUser();
      navigate('/');
    } catch (err) {
      // TODO: error handling
      console.log(err);
    }
  };

  return (
    <AppBar position={'relative'} sx={{ boxShadow: 'none' }}>
      <Toolbar>
        <IconButton
          size='large'
          edge='start'
          color='inherit'
          aria-label='menu'
          onClick={() => console.log('clicked')}
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
          onClose={handleCloseSettingsMenu}
        >
          <MenuItem onClick={handleCloseSettingsMenu}>Change username</MenuItem>
          <MenuItem onClick={handleCloseSettingsMenu}>Change password</MenuItem>
          <MenuItem onClick={handleDeleteAccount} sx={{ color: 'red' }}>
            Delete account
          </MenuItem>
          <MenuItem onClick={handleCloseSettingsMenu}>Logout</MenuItem>
        </Menu>
      </Toolbar>

      <ConfirmationDialog
        dialogOpen={confirmDialogOpen}
        setDialogOpen={setConfirmDialogOpen}
        message={'Confirm the deletion of your account?'}
        onConfirmAction={handleDeleteUser}
      ></ConfirmationDialog>
    </AppBar>
  );
}

export default Navbar;

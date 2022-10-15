import React from 'react';
import { Button, Dialog, DialogActions, DialogTitle } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const MatchLeftDialog = (props: { open: boolean }) => {
  const { open } = props;
  const navigate = useNavigate();

  return (
    <Dialog open={open}>
      <DialogTitle>Match has Left!</DialogTitle>
      <DialogActions sx={{ flexDirection: 'column' }}>
        <Button variant='contained' onClick={() => navigate('/match')}>
          Find New Match
        </Button>
        <Button variant='text' onClick={() => navigate('/')}>
          Return to Home
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MatchLeftDialog;

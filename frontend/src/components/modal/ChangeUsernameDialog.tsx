import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useUser, useAuth } from "../../context/UserContext";
import {
  URL_USER_CHANGE_USERNAME,
  LOCAL_STORAGE_USERNAME_KEY,
} from "../../configs";
import axios from "axios";

export default function ChangeUsernameDialog({ isOpen }: { isOpen: boolean }) {
  const user = useUser();
  const authClient = useAuth();
  const [open, setOpen] = React.useState(isOpen);
  const [username, setUsername] = React.useState("");
  const [newUsername, setNewUsername] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  
  const handleSubmit = async () => {
    try {
      await authClient.changeUsername(username, newUsername, password);
      handleClose();
    } catch (err) {
      console.log(err);
    }
  }
  return (
    <div>
      {/* <Button variant="outlined" onClick={handleClickOpen}>
        Open form dialog
      </Button> */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Change Username</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="username"
            label="Username"
            type="text"
            fullWidth
            variant="standard"
            onChange={(event) => setUsername(event.target.value)}
          />
          <TextField
            autoFocus
            margin="dense"
            id="currentPass"
            label="Password"
            type="password"
            fullWidth
            variant="standard"
            onChange={(event) => setPassword(event.target.value)}
          />
          <TextField
            autoFocus
            margin="dense"
            id="newUsername"
            label="New Username"
            type="text"
            fullWidth
            variant="standard"
            onChange={(event) => setNewUsername(event.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit}>
            Apply
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

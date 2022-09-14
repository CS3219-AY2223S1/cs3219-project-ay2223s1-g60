import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useUser } from "../../context/UserContext";
import {
  URL_USER_CHANGE_USERNAME,
  LOCAL_STORAGE_USERNAME_KEY,
} from "../../configs";
import axios from "axios";

export default function ChangeUsernameDialog({ isOpen }: { isOpen: boolean }) {
  const user = useUser();

  const [open, setOpen] = React.useState(false);
  const [username, setUsername] = React.useState("");
  const [newUsername, setNewUsername] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const changeUsername = async (newUsername: string, password: string) => {
    const body = {
      username: user.username,
      newUsername: newUsername,
      password: password,
    };

    const resp = await axios
      .post(URL_USER_CHANGE_USERNAME, body)
      .catch((err) => {
        if (err.response) {
          throw new Error("Change password failed");
        }
      });

    window.localStorage.setItem(LOCAL_STORAGE_USERNAME_KEY, newUsername);
    handleClose();
  };

  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen}>
        Open form dialog
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Change Password</DialogTitle>
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
          <Button onClick={() => changeUsername(newUsername, password)}>
            Apply
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

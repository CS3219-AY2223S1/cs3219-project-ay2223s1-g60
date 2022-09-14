import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useUser } from "../../context/UserContext";
import { URL_USER_CHANGE_PASSWORD } from "../../configs";
import axios from "axios";

export default function ChangePasswordDialog({ isOpen }: { isOpen: boolean }) {
  const user = useUser();

  const [open, setOpen] = React.useState(isOpen);
  const [username, setUsername] = React.useState("");
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const changePassword = async (
    currentPassword: string,
    newPassword: string
  ) => {
    const body = {
      username: user.username,
      newPassword: newPassword,
      oldPassword: currentPassword,
    };

    const resp = await axios
      .post(URL_USER_CHANGE_PASSWORD, body)
      .catch((err) => {
        if (err.response) {
          throw new Error("Change username failed");
        }
      });

    handleClose();
    return resp;
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
            label="Current Password"
            type="password"
            fullWidth
            variant="standard"
            onChange={(event) => setCurrentPassword(event.target.value)}
          />
          <TextField
            autoFocus
            margin="dense"
            id="newPass"
            label="New Password"
            type="password"
            fullWidth
            variant="standard"
            onChange={(event) => setNewPassword(event.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={() => changePassword(newPassword, currentPassword)}>
            Apply
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

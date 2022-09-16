import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import { SetStateAction, useState } from "react";
import { Link } from "react-router-dom";
import React from "react";
import { useAuth, useUser } from "../context/UserContext";

function SignupPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("");
  const [dialogMsg, setDialogMsg] = useState("");
  const [isSignupSuccess, setIsSignupSuccess] = useState(false);

  const authClient = useAuth();
  const user = useUser();

  const handleSignup = async () => {
    try {
      await authClient.signup(username, password);
      setIsSignupSuccess(true);
      setSuccessDialog("Account successfully created");
    } catch (error) {
      let message = "Unknown Error";
      if (error instanceof Error) message = error.message;
      setErrorDialog(message);
    }
  };

  const closeDialog = () => setIsDialogOpen(false);

  const setSuccessDialog = (msg: SetStateAction<string>) => {
    setIsDialogOpen(true);
    setDialogTitle("Success");
    setDialogMsg(msg);
  };

  const setErrorDialog = (msg: SetStateAction<string>) => {
    setIsDialogOpen(true);
    setDialogTitle("Error");
    setDialogMsg(msg);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", width: "30%" }}>
      <Typography variant={"h3"} marginBottom={"2rem"}>
        Sign Up
      </Typography>
      <TextField
        label="Username"
        variant="standard"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        sx={{ marginBottom: "1rem" }}
        autoFocus
      />
      <TextField
        label="Password"
        variant="standard"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        sx={{ marginBottom: "2rem" }}
      />
      <Box display={"flex"} flexDirection={"row"} justifyContent={"flex-end"}>
        <Button variant={"outlined"} onClick={handleSignup}>
          Sign up
        </Button>
      </Box>

      <Dialog open={isDialogOpen} onClose={closeDialog}>
        <DialogTitle>{dialogTitle}</DialogTitle>
        <DialogContent>
          <DialogContentText>{dialogMsg}</DialogContentText>
        </DialogContent>
        <DialogActions>
          {isSignupSuccess ? (
            <Button component={Link} to="/login">
              Log in
            </Button>
          ) : (
            <Button onClick={closeDialog}>Done</Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default SignupPage;

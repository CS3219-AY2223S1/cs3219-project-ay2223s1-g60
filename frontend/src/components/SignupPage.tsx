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
<<<<<<< HEAD
import { SetStateAction, useContext, useState } from "react";
import axios from "axios";
import { URL_USER_SVC, URL_USER_SIGNUP } from "../configs";
=======
import { SetStateAction, useState } from "react";
import axios from "axios";
import { URL_USER_SIGNUP } from "../configs";
>>>>>>> 4488821e511bc360226f8ba214a5c1fa771be0a8
import { STATUS_CODE_CONFLICT, STATUS_CODE_CREATED } from "../constants";
import { Link } from "react-router-dom";
import React from "react";
import UserContext, { User } from "../context/UserContext";

function SignupPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("");
  const [dialogMsg, setDialogMsg] = useState("");
  const [isSignupSuccess, setIsSignupSuccess] = useState(false);

  const { user, setUser } = useContext(UserContext);

  const handleSignup = async () => {
    console.log("User " + user.username);

    setIsSignupSuccess(false);
    const res = await axios
      .post(URL_USER_SIGNUP, { username, password })
      .catch((err) => {
        if (err.response.status === STATUS_CODE_CONFLICT) {
          setErrorDialog("This username already exists");
        } else {
          setErrorDialog("Please try again later");
        }
      });
    if (res && res.status === STATUS_CODE_CREATED) {
      setSuccessDialog("Account successfully created");
      console.log("Resp : " + res);
      // const user: User = { username: res.username, token: res.token };
      //setUser(user);
      setIsSignupSuccess(true);
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
    <Box display={"flex"} flexDirection={"column"} width={"30%"}>
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

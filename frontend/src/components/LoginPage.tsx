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
import { SetStateAction, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/UserContext";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("");
  const [dialogMsg, setDialogMsg] = useState("");
  const [isLoginSuccess, setIsLoginSuccess] = useState(false);
  const navigate = useNavigate();
  const authClient = useAuth();

  // useEffect(() => {
  //   const login = async () => {
  //     try {
  //       await authClient.loginWithToken();
  //       navigate("/home");
  //     } catch (error) {
  //       console.log("login ", error);
  //     }
  //   };
  //   login();
  // }, []);

  const handleLogin = async () => {
    try {
      await authClient.loginWithUname(username, password);
      navigate("/home");
    } catch (error) {
      let message = "Unknown Error";
      if (error instanceof Error) message = error.message;
      setErrorDialog(message);
    }
  };

  const closeDialog = () => setIsDialogOpen(false);

  const setErrorDialog = (msg: SetStateAction<string>) => {
    setIsDialogOpen(true);
    setDialogTitle("Error");
    setDialogMsg(msg);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", width: "30%" }}>
      <Typography variant={"h3"} marginBottom={"2rem"}>
        Login
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
        <Button variant={"outlined"} onClick={handleLogin}>
          Login
        </Button>
      </Box>

      <Dialog open={isDialogOpen} onClose={closeDialog}>
        <DialogTitle>{dialogTitle}</DialogTitle>
        <DialogContent>
          <DialogContentText>{dialogMsg}</DialogContentText>
        </DialogContent>
        <DialogActions>
          {isLoginSuccess ? (
            <Button component={Link} to="/home">
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

export default LoginPage;

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import SignupPage from "./components/SignupPage";
import { Box } from "@mui/material";
import React from "react";
import { UserProvider } from "./context/UserContext";
import LoginPage from "./components/LoginPage";
import HomePage from "./components/HomePage";
import Navbar from "./components/Navbar";
import { useUser } from "../src/context/UserContext";

function App() {
  const user = useUser();

  return (
    <div className="App">
      <Box sx={{ display: "flex", flexDirection: "column", padding: "4rem" }}>
        <Router>
          {user.username && <Navbar />}
          {user.username ? (
            <Routes>
              <Route path="/" element={<Navigate replace to="/" />} />
              <Route path="/home" element={<HomePage />} />
            </Routes>
          ) : (
            <Routes>
              <Route
                path="/"
                element={<Navigate replace to="/signup" />}
              ></Route>
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="*" element={<Navigate replace to="/login" />} />
            </Routes>
          )}
        </Router>
      </Box>
    </div>
  );
}

export default App;

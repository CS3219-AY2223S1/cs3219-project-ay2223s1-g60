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

function App() {
  return (
    <div className="App">
      <UserProvider>
        <Box display={"flex"} flexDirection={"column"} padding={"4rem"}>
          <Router>
            <Routes>
              <Route
                path="/"
                element={<Navigate replace to="/signup" />}
              ></Route>
              <Route path="/signup" element={<SignupPage />} />
            </Routes>
          </Router>
        </Box>
      </UserProvider>
    </div>
  );
}

export default App;

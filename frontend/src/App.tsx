import {BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";
import SignupPage from './components/SignupPage';
import {Box} from "@mui/material";
import React from "react";
import LoginPage from "./components/LoginPage";
import HomePage from "./components/HomePage";

function App() {
    return (
        <div className="App">
            <Box display={"flex"} flexDirection={"column"} padding={"4rem"}>
                <Router>
                    <Routes>
                        <Route path="/" element={<Navigate replace to="/login" />}></Route>
                        <Route path="/signup" element={<SignupPage/>}/>
                        <Route path="/login" element={<LoginPage/>}/>
                        <Route path="/home" element={<HomePage/>}/>
                    </Routes>
                </Router>
            </Box>
        </div>
    );
}

export default App;

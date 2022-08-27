import React from "react";
import {BrowserRouter as Router, Navigate, Route, Routes} from "react-router-dom";
import SignupPage from "./components/SignupPage";
import {Box} from "@mui/material";

const App: React.FC = () => {
    return (
        <div className="App">
            <Box display={"flex"} flexDirection={"column"} padding={"4rem"}>
                <Router>
                    <Routes>
                        <Route path="/" element={<Navigate replace to="/signup"/>}/>
                        <Route path="/signup" element={<SignupPage/>}/>
                    </Routes>
                </Router>
            </Box>
        </div>
    );
}

export default App;
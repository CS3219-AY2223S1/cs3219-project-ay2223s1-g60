import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { Box, ThemeProvider } from '@mui/material';
import React from 'react';
import Navbar from './components/Navbar';
import { useUser } from './context/UserContext';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import MatchingPage from './pages/MatchingPage';
import RoomPage from './pages/RoomPage';
import SignupPage from './pages/SignupPage';
import { theme } from './styles';

function App() {
  const user = useUser();

  const loggedInRoutes = (
    <Routes>
      <Route path='/' element={<Navigate replace to='/home' />} />
      <Route path='/home' element={<HomePage />} />
      <Route path='/match' element={<MatchingPage />} />
      <Route path='/room/*' element={<RoomPage />} />
      <Route path='*' element={<Navigate replace to='/home' />} />
    </Routes>
  );

  const guestRoutes = (
    <Routes>
      <Route path='/' element={<Navigate replace to='/signup' />}></Route>
      <Route path='/signup' element={<SignupPage />} />
      <Route path='/login' element={<LoginPage />} />
      <Route path='*' element={<Navigate replace to='/login' />} />
    </Routes>
  );

  return (
    <ThemeProvider theme={theme}>
      <div className='App' style={{ minHeight: '100vh' }}>
        <Box>
          <Router>
            {true && <Navbar />}
            {true ? loggedInRoutes : guestRoutes}
          </Router>
        </Box>
      </div>
    </ThemeProvider>
  );
}

export default App;

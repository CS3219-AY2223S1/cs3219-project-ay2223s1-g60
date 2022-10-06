import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import SignupPage from './components/SignupPage';
import { Box } from '@mui/material';
import React from 'react';
import LoginPage from './components/LoginPage';
import HomePage from './components/HomePage';
import MatchingPage from './components/MatchingPage';
import Navbar from './components/Navbar';
import { useUser } from '../src/context/UserContext';
import RoomPage from './views/RoomPage';

function App() {
  const user = useUser();

  const loggedInRoutes = (
    <Routes>
      <Route path='/' element={<Navigate replace to='/' />} />
      <Route path='/home' element={<HomePage />} />
      <Route path='/match' element={<MatchingPage />} />
      <Route path='/room/*' element={<RoomPage />} />
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
    <div className='App'>
      <Box sx={{ display: 'flex', flexDirection: 'column', padding: '4rem' }}>
        <Router>
          {user.username && <Navbar />}
          {user.username ? loggedInRoutes : guestRoutes}
        </Router>
      </Box>
    </div>
  );
}

export default App;

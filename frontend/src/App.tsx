import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { theme } from './styles';
import SignupPage from './components/SignupPage';
import MatchingPage from './components/MatchingPage';
import RoomPage from './views/RoomPage';
import { Box, ThemeProvider } from '@mui/material';
import React from 'react';

function App() {
  return (
    <div className='App'>
      <ThemeProvider theme={theme}>
        <Box display={'flex'} flexDirection={'column'} padding={'4rem'}>
          <Router>
            <Routes>
              <Route
                path='/'
                element={<Navigate replace to='/signup' />}
              ></Route>
              <Route path='/signup' element={<SignupPage />} />
              <Route path='/match' element={<MatchingPage />} />
              <Route path='/room' element={<RoomPage />} />
            </Routes>
          </Router>
        </Box>
      </ThemeProvider>
    </div>
  );
}

export default App;

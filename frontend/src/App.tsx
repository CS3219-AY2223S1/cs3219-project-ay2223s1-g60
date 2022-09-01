import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import SignupPage from './components/SignupPage';
import MatchingPage from './components/MatchingPage';
import { Box } from '@mui/material';
import React from 'react';

function App() {
  return (
    <div className='App'>
      <Box display={'flex'} flexDirection={'column'} padding={'4rem'}>
        <Router>
          <Routes>
            <Route path='/' element={<Navigate replace to='/signup' />}></Route>
            <Route path='/signup' element={<SignupPage />} />
            <Route path='/match' element={<MatchingPage />} />
          </Routes>
        </Router>
      </Box>
    </div>
  );
}

export default App;

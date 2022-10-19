import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { UserProvider } from './context/UserContext';
import { SnackbarProvider } from './context/SnackbarContext';
import { theme } from './styles';
import { ThemeProvider } from '@mui/material';

// @ts-ignore
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <SnackbarProvider>
    <ThemeProvider theme={theme}>
      <UserProvider>
        <App />
      </UserProvider>
    </ThemeProvider>
  </SnackbarProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(undefined);

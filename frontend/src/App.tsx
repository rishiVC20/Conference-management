import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Login from './pages/Login';
import Register from './pages/Register';
import PresenterHome from './pages/PresenterHome';
import AttendeeHome from './pages/AttendeeHome';
import AdminHome from './pages/AdminHome';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './context/AuthContext';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const theme = createTheme({
  palette: {
    primary: {
      main: '#00838F', // Darker turquoise as main color
      light: '#4DD0E1', // Previous main color becomes light
      dark: '#006064', // Even darker shade for hover/emphasis
      contrastText: '#fff',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        contained: {
          backgroundColor: '#00838F',
          '&:hover': {
            backgroundColor: '#006064',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#00838F',
        },
      },
    },
  },
});

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <AuthProvider>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/presenter"
                element={
                  <PrivateRoute role="presenter">
                    <PresenterHome />
                  </PrivateRoute>
                }
              />
              <Route
                path="/attendee"
                element={
                  <PrivateRoute role="attendee">
                    <AttendeeHome />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <PrivateRoute role="admin">
                    <AdminHome />
                  </PrivateRoute>
                }
              />
              <Route path="/" element={<Login />} />
            </Routes>
          </AuthProvider>
        </LocalizationProvider>
      </Router>
    </ThemeProvider>
  );
};

export default App;

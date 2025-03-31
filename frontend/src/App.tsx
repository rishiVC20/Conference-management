import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Login from './pages/Login';
import Register from './pages/Register';
import PresenterHome from './pages/PresenterHome';
import AttendeeHome from './pages/AttendeeHome';
import AdminHome from './pages/AdminHome';
import AdminDashboard from './pages/AdminDashboard';
import AddPaper from './pages/AddPaper'; 
import ScheduleManager from './pages/ScheduleManager';
import CommunicationCenter from './pages/CommunicationCenter';
import PresenterManagement from './pages/PresenterManagement';
import PrivateRoute from './components/PrivateRoute';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import AddSpecialSession from './pages/AddSpecialSession';

import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
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
            <NotificationProvider>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password/:token" element={<ResetPassword />} />
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
                <Route
                  path="/admin/dashboard"
                  element={
                    <PrivateRoute role="admin">
                      <AdminDashboard />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/admin/schedule"
                  element={
                    <PrivateRoute role="admin">
                      <ScheduleManager />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/admin/communications"
                  element={
                    <PrivateRoute role="admin">
                      <CommunicationCenter />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/admin/add-paper"
                  element={
                    <PrivateRoute role="admin">
                      <AddPaper />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/admin/presenters"
                  element={
                    <PrivateRoute role="admin">
                      <PresenterManagement />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/admin/add-special-session"
                  element={
                    <PrivateRoute role="admin">
                      <AddSpecialSession />
                    </PrivateRoute>
                  }
                />
                <Route path="/" element={<Login />} />
              </Routes>
            </NotificationProvider>
          </AuthProvider>
        </LocalizationProvider>
      </Router>
    </ThemeProvider>
  );
};

export default App;

import React, { useState } from 'react';
import {
  AppBar,
  Box,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Button,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  Dashboard as DashboardIcon,
  CalendarToday as TimetableIcon,
  Login as LoginIcon,
  PersonAdd as RegisterIcon,
  Assignment as PaperIcon,
  People as PresentersIcon,
  EventNote as ScheduleIcon,
  Forum as CommunicationIcon,
  Add as AddIcon,
  Logout as LogoutIcon,
  Person as ProfileIcon
} from '@mui/icons-material';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const drawerWidth = 240;

interface Props {
  children: React.ReactNode;
  onScrollToDashboard?: () => void;
}

const getNavItems = (role: string | null, onScrollToDashboard?: () => void, isHomePage: boolean = false, isTimetablePage: boolean = false, navigate?: (path: string) => void) => {
  const commonItems = [
    { text: 'Home', path: '/', icon: <HomeIcon /> },
    ...(isHomePage ? [{ 
      text: 'Dashboard', 
      path: '#', 
      icon: <DashboardIcon />, 
      onClick: onScrollToDashboard
    }] : [{ 
      text: 'Dashboard', 
      path: '/', 
      icon: <DashboardIcon />, 
      onClick: () => navigate?.('/#dashboard')
    }]),
    { text: 'Timetable', path: '/timetable', icon: <TimetableIcon /> },
  ];

  if (!role) {
    return [
      ...commonItems,
      { text: 'Login', path: '/login', icon: <LoginIcon /> },
      { text: 'Register', path: '/register', icon: <RegisterIcon /> }
    ];
  }

  switch (role) {
    case 'admin':
      return [
        { text: 'Home', path: '/', icon: <HomeIcon /> },
        { text: 'Timetable', path: '/timetable', icon: <TimetableIcon /> },
        { text: 'Profile', path: '/admin', icon: <ProfileIcon /> },
      ];
    case 'presenter':
      return [
        ...commonItems,
        { text: 'Profile', path: '/presenter', icon: <ProfileIcon /> },
      ];
    case 'attendee':
      return [
        ...commonItems,
        { text: 'Profile', path: '/attendee', icon: <ProfileIcon /> },
      ];
    default:
      return commonItems;
  }
};

const Layout: React.FC<Props> = ({ children, onScrollToDashboard }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const isHomePage = location.pathname === '/';
  const isTimetablePage = location.pathname === '/timetable';
  const navItems = getNavItems(user?.role || null, onScrollToDashboard, isHomePage, isTimetablePage, navigate);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleNavigation = (item: any) => {
    if (item.onClick) {
      item.onClick();
      if (isMobile) {
        handleDrawerToggle();
      }
    }
  };

  const drawer = (
    <Box>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
        <img src="/logo.jpg" alt="PICT Logo" style={{ height: 40, marginRight: 10 }} />
        <Typography variant="subtitle1">
          Conference 2026
        </Typography>
      </Box>
      <Divider />
      <List>
        {navItems.map((item: any) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              component={item.onClick ? 'button' : RouterLink}
              to={!item.onClick ? item.path : undefined}
              selected={location.pathname === item.path}
              onClick={() => handleNavigation(item)}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: theme.palette.primary.main,
                  color: 'white',
                  '&:hover': {
                    backgroundColor: theme.palette.primary.dark,
                  },
                  '& .MuiListItemIcon-root': {
                    color: 'white',
                  },
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
        {user && (
          <ListItem disablePadding>
            <ListItemButton onClick={handleLogout}>
              <ListItemIcon sx={{ minWidth: 40 }}>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </ListItem>
        )}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: '100%',
          ml: 0
        }}
      >
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <img src="/logo.jpg" alt="PICT Logo" style={{ height: 40, marginRight: 10 }} />
            <Box>
              <Typography variant="h6" sx={{ 
                fontSize: { xs: '1.1rem', sm: '1.25rem' }
              }}>
                Conference 2026
              </Typography>
            </Box>
          </Box>

          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
            {!isMobile && (
              <>
                {navItems.map((item: any) => (
                  <Button
                    key={item.text}
                    component={item.onClick ? 'button' : RouterLink}
                    to={!item.onClick ? item.path : undefined}
                    color="inherit"
                    startIcon={item.icon}
                    onClick={() => handleNavigation(item)}
                    sx={{
                      ml: 2,
                      ...(location.pathname === item.path && {
                        backgroundColor: 'rgba(255, 255, 255, 0.12)',
                      }),
                    }}
                  >
                    {item.text}
                  </Button>
                ))}
                {user && (
                  <Button
                    color="inherit"
                    onClick={handleLogout}
                    startIcon={<LogoutIcon />}
                    sx={{ ml: 2 }}
                  >
                    Logout
                  </Button>
                )}
              </>
            )}
            {isMobile && (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="end"
                onClick={handleDrawerToggle}
                sx={{ ml: 2 }}
              >
                <MenuIcon />
              </IconButton>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      {isMobile && (
        <Box
          component="nav"
          sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        >
          <Drawer
            variant="temporary"
            anchor="right"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
            sx={{
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
            }}
          >
            {drawer}
          </Drawer>
        </Box>
      )}

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: '100%',
          mt: { xs: 7, sm: 8 }
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Layout; 